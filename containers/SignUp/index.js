import React from "react";
import { Button, Panel } from "../../components/ui";
import { Row, Page } from "../../components/ui/Layout";
import Input from "../../components/ui/Input";
import { withRouter } from "react-router";
import ReCAPTCHA from "react-google-recaptcha";
import APIAction from "../../services/APIAction";
import { compose } from 'redux';
import { connect } from "react-redux";
import withAuth from "../../services/auth/withAuth";

import ModalFromFactory from "../../components/modals/factory";
import AvatarEditor from '../../components/modals/AvatarEditor';
import {WIN_EDIT_AVATAR} from "../../constants/windows";
import AvatarPreview from '../../components/ui/AvatarPreview';
import './style.less';

const Factory = ModalFromFactory.modalFromFactory;

const CONFIRM_COMPANY_API = "public/company-confirm/";
const CANCEL_COMPANY_API = "public/company-cancel/";

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      companyAdmin: false,
      company: 0,
      role: 0,
      firstname: "",
      lastname: "",
      title: "",
      email: "",
      phone: "",
      address: "",
      password1: "",
      password2: "",
      p_pic: "",
      company_list: [],
      recaptcha_token: "",
      checked: false,
      showAlert: false,
      showAlertText: "",
      isDisabled: false,
    };

    this.emailChange = this.emailChange.bind(this);
    this.companyChange = this.companyChange.bind(this);
    this.titleChange = this.titleChange.bind(this);
    this.firstnameChange = this.firstnameChange.bind(this);
    this.lastnameChange = this.lastnameChange.bind(this);
    this.phoneChange = this.phoneChange.bind(this);
    this.addressChange = this.addressChange.bind(this);
    this.password1Change = this.password1Change.bind(this);
    this.password2Change = this.password2Change.bind(this);
    this.recaptchaChange = this.recaptchaChange.bind(this);
    this.termsChange = this.termsChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.onResult = this.onResult.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    // Check if company is pre-selected
    if (this.props.location.state && this.props.location.state.companyId > 0) {
      this.setState({
        company: this.props.location.state.companyId,
        role: 1,
        companyAdmin: true,
      });
    }

    APIAction.getData("public/company-list", false)
      .then(data => {
        this.setState({ company_list: data.data });
      })
      .catch(err => {
        console.error(err);
        this.handleError(err);
      });
  }

  emailChange(e) {
    this.setState({ email: e.target.value.trim() });
  }

  companyChange(e) {
    this.setState({ company: e.target.value.trim() });
  }

  titleChange(e) {
    this.setState({ title: e.target.value.trim() });
  }

  firstnameChange(e) {
    this.setState({ firstname: e.target.value.trim() });
  }

  lastnameChange(e) {
    this.setState({ lastname: e.target.value.trim() });
  }

  phoneChange(e) {
    this.setState({ phone: e.target.value.trim() });
  }

  addressChange(e) {
    this.setState({ address: e.target.value.trim() });
  }

  password1Change(e) {
    this.setState({ password1: e.target.value });
  }

  password2Change(e) {
    this.setState({ password2: e.target.value });
  }

  recaptchaChange(value) {
    this.setState({ recaptcha_token: value });
  }

  termsChange(e) {
    this.setState({ checked: !this.state.checked });
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
    window.scrollTo(0, 0);
  }

  handleCancel() {
    if (this.state.companyAdmin) {
      APIAction.delData(
        CANCEL_COMPANY_API + this.state.company,
        false
      )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          if (response.data.message) {
            this.handleError(response.data.message)
          } else {
            this.handleError("Error while cancelling company registration (" + response.status + ")")
          }
          return
        }
      })
      .catch(err => {
        this.handleError(err)
        return;
      });
    }
    this.props.history.push("/");
  }

  handleSubmit(e) {
    e.preventDefault();
    this.resetError();

    if (this.state.company <= 0) {
      this.handleError("Company cannot be empty. Please, select company.");
      return;
    }

    if (this.state.firstname === "") {
      this.handleError("First Name cannot be empty. Please, enter First Name.");
      return;
    }

    if (this.state.lastname === "") {
      this.handleError("Last Name cannot be empty. Please, enter Last Name.");
      return;
    }

    if (this.state.email === "") {
      this.handleError("Email cannot be empty. Please, enter a valid e-mail.");
      return;
    }

    if (this.state.password1 === "" || this.state.password2 === "") {
      this.handleError("Password cannot be empty.");
      return;
    }
    if (this.state.password1 !== this.state.password2) {
      this.handleError("New password not matching. Please, enter it again.");
      return;
    }

    if (this.state.recaptcha_token === "") {
      this.handleError("Please validate that you are not a robot.");
      return;
    }

    if (this.state.checked === false) {
      this.handleError("Please accept Terms of Use and Privacy Policy.");
      return;
    }

    // Validate e-mail
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.state.email)) {
      this.handleError("Enter a valid email address.");
      return;
    }

    this.setState({ isDisabled: true });

    const attributeList = {
      email: this.state.email,
      phone_number: this.state.phone,
      "custom:company_title": this.state.title,
      address: this.state.address,
      "custom:company_id": "" + this.state.company,
      given_name: this.state.firstname,
      family_name: this.state.lastname,
      profile: this.state.p_pic,
      "custom:recaptcha_token": this.state.recaptcha_token,
      "custom:system": "CUSTOMER_PORTAL",
      "custom:company_role_id": "" + this.state.role,
    };

    // Check user and password at Cognito
    this.props.auth
      .signUp(this.state.email, this.state.password1, attributeList)
      .then(this.onResult)
      .catch(this.onError);
  }

  onResult(cognitoUser) {
    if (!cognitoUser) {
      this.handleError(
        "Invalid data from server. Please, try again later or contact an administrator."
      );
      this.setState({ isDisabled: false });
      return;
    }

    if (this.state.companyAdmin) {
      var dataForm = {
        companyId: this.state.company,
        firstName: this.state.firstname,
        lastName: this.state.lastname,
        typeId: 1,
        title: this.state.title,
        email: this.state.email,
        phone: this.state.phone,
        messaging: this.state.imessaging,
      };
  
      APIAction.putData(
        CONFIRM_COMPANY_API + this.state.company,
        JSON.stringify(dataForm),
        false
      )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          if (response.data.message) {
            this.handleError(response.data.message)
          } else {
            this.handleError("Error while confirming company registration (" + response.status + ")")
          }
          return;
        }
      })
      .catch(err => {
        this.handleError(err)
        return;
      });
    }

    this.props.history.push({
      pathname: "/signupconfirmation",
      search: "",
      state: { username: cognitoUser.getUsername() }
    });
  }

  onError(err) {
    if (err) {
      if (err.message) {
        this.handleError(err.message);
        this.setState({ isDisabled: false });
      } else {
        this.handleError(
          "Unable to sign up. Please, try again later or contact an administrator."
        );
        this.setState({ isDisabled: false });
      }
    }
  }

  render() {
    const { isDisabled } = this.state;
    return (
      <Page>
        <Row>
          <div className="col-md-3" />
          <div className="col-md-6" style={{ marginTop: "30px" }}>
            <Panel className="rounded">
              <center>
                <h1>{this.state.companyAdmin ? "Step 2: Register Company Administrator" : "Sign up as Company Member"}</h1>
              </center>
              <hr />
              {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}

              <div className="signup_avatar_wrapper">
                <AvatarPreview
                  avatar={this.state.p_pic}
                  onClick={(e) => {e.preventDefault(); ModalFromFactory.show(WIN_EDIT_AVATAR)}}
                />
              </div>
              <form role="form" className="form-horizontal">
                <div className="form-group">
                  <label className="control-label col-sm-3">Company*</label>
                  <div className="col-sm-9">
                    <select
                      className={"form-control"}
                      disabled={this.state.companyAdmin}
                      onChange={this.companyChange}
                      value={this.state.company}
                    >
                      <option value="">--Select Company--</option>
                      {this.state.company_list.map(function(item, key) {
                        return (
                          <option key={key} value={item.id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">First Name*</label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="first name"
                    type="text"
                    onChange={this.firstnameChange}
                    value={this.state.firstname}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Last Name*</label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="last name"
                    type="text"
                    onChange={this.lastnameChange}
                    value={this.state.lastname}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Title/position
                  </label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="Title/position"
                    type="text"
                    onChange={this.titleChange}
                    value={this.state.title}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">E-mail*</label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="email"
                    type="email"
                    onChange={this.emailChange}
                    value={this.state.email}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Phone</label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="phone number"
                    type="text"
                    onChange={this.phoneChange}
                    value={this.state.phone}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Address</label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="address"
                    type="text"
                    onChange={this.addressChange}
                    value={this.state.address}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Password*</label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="password"
                    type="password"
                    onChange={this.password1Change}
                    value={this.state.password1}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Repeat password*
                  </label>
                  <div className="col-sm-9">
                  <Input
                    placeholder="password"
                    type="password"
                    onChange={this.password2Change}
                    value={this.state.password2}
                  />
                  </div>
                </div>
                <div className="form-group">
                  <div id="cap_div" className="col-sm-12 text-center">
                    <ReCAPTCHA
                      sitekey="6LdS0psUAAAAAMDbypHsLShk-Zp6omR0gUSsng87"
                      onChange={this.recaptchaChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-12 text-center">
                    <input
                      type="checkbox"
                      name="termsofuse"
                      value={this.state.checked}
                      onChange={this.termsChange}
                    />{" "}
                    I agree to the
                    <a href="https://www.vidillion.com/terms-of-service.html" target="_blank">
                      Terms of Use
                    </a>
                    &nbsp;and&nbsp;
                    <a href="https://www.vidillion.com/privacy-policy.html" target="_blank">
                      Privacy Policy
                    </a>
                  </div>
                </div>

                <div className="form-group" />

                <div className="form-group">
                  <div className="col-sm-12 text-center">
                    <button
                      label="Register"
                      color="btn-info"
                      className="btn btn-info"
                      onClick={this.handleSubmit}
                      disabled={isDisabled}
                    >
                      Accept
                    </button>{" "}
                    <Button label="Cancel" onClick={this.handleCancel} />
                  </div>
                </div>
              </form>
            </Panel>
          </div>
          <div className="col-md-4" />
        </Row>
        <Factory
          modalref={WIN_EDIT_AVATAR}
          title="Choose avatar"
          factory={AvatarEditor}
          onChange={(p_pic) => this.setState({p_pic})}
        />
      </Page>
    );
  }
}
function mapStateToProps(state) {
  return {
    croppedImageUrl: state.avatar_editor.croppedImageUrl
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(mapStateToProps)
)(SignUp);
