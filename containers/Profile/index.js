import React, { PureComponent } from "react";
import { Row, Col, Page } from "../../components/ui/Layout";
import { Panel } from "../../components/ui";
import Input from "../../components/ui/Input";
import { compose, bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import withAuth from "../../services/auth/withAuth";
import { setUserData, clearUserData } from '../../actions/index';
import { updateCroppedImage } from '../../actions/avatar_editor';
import PropTypes from "prop-types";
import classNames from 'classnames';
import './style.less';
import AvatarEditor from '../../components/widgets/AvatarEditor';
import AvatarPreview from '../../components/ui/AvatarPreview.js';
import S3Service from '../../services/S3Service.js';

const s3 = new S3Service();

class ProfileBig extends PureComponent {
  /* jshint ignore:start */
  static propTypes = {
    user: PropTypes.object,
    auth: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    setUserData: PropTypes.func,
    clearUserData: PropTypes.func,
    setAuthenticated: PropTypes.func,
    croppedImageUrl: PropTypes.string,
    updateCroppedImage: PropTypes.func
  }
  /* jshint ignore:end */
  constructor(...props) {
    super(...props);

    this.state = {
      email: null,
      given_name: null,
      family_name: null,
      phone_number: null,
      company_title: null,
      address: null,
      profile: null,
      profile_pic: "",
      showAlert: false,
      showAlertText: "",
      editAvatar: false
    };
    this.titleChange = this.titleChange.bind(this);
    this.firstnameChange = this.firstnameChange.bind(this);
    this.lastnameChange = this.lastnameChange.bind(this);
    this.phoneChange = this.phoneChange.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.profile_picChange = this.profile_picChange.bind(this);
    this.onResult = this.onResult.bind(this);
    this.valueOf = this.valueOf.bind(this);
  }

  titleChange(e) {
    let value = e.target.value.trim();
    this.updateValueOf('company_title', value);
  }

  firstnameChange(e) {
    let value = e.target.value.trim();
    this.updateValueOf('given_name', value);
  }

  lastnameChange(e) {
    let value = e.target.value.trim();
    this.updateValueOf('family_name', value);
  }

  phoneChange(e) {
    let value = e.target.value.trim();
    this.updateValueOf('phone_number', value);
  }

  addressChange(e) {
    let value = e.target.value.trim();
    this.updateValueOf('address', value);
  }

  profile_picChange(file) {
    return new Promise((resolve) => {
      this.resetError();
      this.setState({ profile_pic: file });
      if (file.type.indexOf("image") == -1) {
        this.handleError(
          'File not supported, please upload file with extension "jpg", "jpeg", "png"'
        );

        resolve(false);
      }
      if (file.size > 1024000) {
        this.handleError("Image too big (max 1MB)");

        resolve(false);
      }

      s3.uploadFile(file, "profile-images")
        .then(data => {
          this.updateValueOf('profile',  data.Location);
          this.setState({editAvatar: false});
          resolve();
        })
        .catch(err => resolve(err));
    });
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showAlert: false
    });
  }

  async saveProfile(e) {
    e.preventDefault();
    this.resetError();

    if (this.state.given_name === "") {
      this.handleError("First Name cannot be empty. Please, enter First Name.");
      return;
    }

    if (this.state.family_name === "") {
      this.handleError("Last Name cannot be empty. Please, enter Last Name.");
      return;
    }
    const attributes = {};
    const attributeList = [
      'phone_number',
      'company_title',
      'address',
      'given_name',
      'family_name',
      'profile'
    ];

    for (let name of attributeList) {
      if (this.state[name] !== null) {
        attributes[name] = this.state[name];
      }
    }

    let {err, result} = await this.props.auth.updateAttributes(attributes);
    this.onResult(err, result);
  }

  onResult(err, result) {
    if (err) {
      if (err.message) this.handleError(err.message);
      else
        this.handleError(
          "Unable to update. Please, try again later or contact an administrator."
        );
      return;
    }

    if (!result) {
      this.handleError(
        "Invalid data from server. Please, try again later or contact an administrator."
      );
      return;
    }

    this.props.auth.getUserAttributes().then((data) => {
      this.props.setUserData(data);
      this.props.updateCroppedImage(null);

      this.props.history.push({
        pathname: "/app/dashboard"
      });
    });
  }

  componentDidMount() {
    this.props.auth.getUserAttributes().then((data) => {
      this.setState(data);
    });
  }

  valueOf(param) {
    return (this.state[param] === null)
    ? (this.props.user[param] || '')
    : (this.state[param] || '');
  }

  updateValueOf(param, value) {
    this.setState({ [param]: (value == (this.props.user[param] || "").trim()) ? null : value });
  }
  /* jshint ignore:start */
  render() {
    const { editAvatar } = this.state;
    const { croppedImageUrl, updateCroppedImage, user: { profile } } = this.props;

    return (
      <Page>
        <Row>
          <Col size="12">
            <Panel title="Personal">
            {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}
              <div className="user-profile">
                <form className={classNames("form-horizontal", "user-profile__main")}>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Email</label>
                    <div className="col-sm-10">
                      <Input
                        type="text"
                        value={this.valueOf("email")}
                        className="form-control"
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">
                      First name
                    </label>
                    <div className="col-sm-10">
                      <Input
                        placeholder="first name"
                        type="text"
                        onChange={this.firstnameChange}
                        value={this.valueOf("given_name")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">
                      Last name
                    </label>
                    <div className="col-sm-10">
                      <Input
                        placeholder="last name"
                        type="text"
                        onChange={this.lastnameChange}
                        value={this.valueOf("family_name")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">
                      Title/position
                    </label>
                    <div className="col-sm-10 text-center">
                      <Input
                        placeholder="Title/position"
                        type="text"
                        onChange={this.titleChange}
                        value={this.valueOf("company_title")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Phone</label>
                    <div className="col-sm-10 text-center">
                      <Input
                        placeholder="phone number"
                        type="text"
                        onChange={this.phoneChange}
                        value={this.valueOf("phone_number")}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Address</label>
                    <div className="col-sm-10 text-center">
                      <Input
                        placeholder="address"
                        type="text"
                        onChange={this.addressChange}
                        value={this.valueOf("address")}
                      />
                    </div>
                  </div>
                </form>
                <div className="user-profile__avatar">
                { !editAvatar ? (
                  <AvatarPreview
                    avatar={croppedImageUrl || profile}
                    onClick={(e) => {e.preventDefault(); this.setState({editAvatar: true})}}
                  />
                ) : (
                  <AvatarEditor
                    src={profile}
                    croppedImageUrl={croppedImageUrl}
                    onCropChange={updateCroppedImage}
                    onChange={this.profile_picChange}
                    onCancel={() => {this.setState({editAvatar: false})}}
                  />
                )}
                </div>
              </div>
              <div className="line line-dashed line-lg pull-in" />
                <div className="user-profile-buttons">
                  <button type="button" className="btn btn-primary" onClick={e => this.saveProfile(e)}>Save</button>
                </div>
            </Panel>
          </Col>
        </Row>
      </Page>
    );
  }
  /* jshint ignore:end */
}

function mapStateToProps(state) {
  return {
    user: state.user,
    croppedImageUrl: state.avatar_editor.croppedImageUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
      ...bindActionCreators({
        clearUserData,
        setUserData,
        updateCroppedImage
      }, dispatch)
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(mapStateToProps, mapDispatchToProps)
)(ProfileBig);
