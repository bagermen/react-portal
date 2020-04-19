import React from "react";
import { Button, Panel } from "../../components/ui";
import { Row, Page } from "../../components/ui/Layout";
import Input from "../../components/ui/Input";
import { withRouter } from 'react-router';
import { Redirect } from "react-router-dom";
import withAuth from "../../services/auth/withAuth";
import { compose } from 'redux';

class SignUpConfirmation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      code: "",
      showAlert: false,
      showAlertText: "",
      redirectToLogin: false
    };

    this.codeChange = this.codeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.onResult = this.onResult.bind(this);
  }

  componentDidMount() {
    // we need userAttributes in order to change password
    if (!this.props.location.state) {
      this.setState({redirectToLogin: true});
      return;
    }

    // We need a cognitoUser in order to confirm it
    if (this.props.location.state.username) {
      this.cognitoUser = this.props.auth.createUserWithName(this.props.location.state.username);
      this.setState({email: this.props.location.state.username});
    } else {
      this.props.auth.getUser().then((cognitoUser) => {
        this.cognitoUser = cognitoUser;
        if (cognitoUser) {
          this.setState({email: this.cognitoUser.username});
        } else {
          this.cognitoUser = null;
          this.setState({redirectToLogin: true, email: ''});
        }
      });
    }
  }

  componentWillUnmount() {
    this.cognitoUser = null;
  }

  codeChange(e) {
    this.setState({ code: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.resetError();

    if (this.state.code === "") {
      this.handleError("Please, enter the confirmation code.");
      return;
    }

    if (this.cognitoUser) {
      this.cognitoUser.confirmRegistration(
        this.state.code,
        true,
        (err, result) => this.onResult(err, result)
      );
    }
  }

  handleCancel() {
    this.setState({redirectToLogin: true});
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  onResult(err, result) {
    if (err) {
      if (err.message) {
        this.handleError(err.message)
      } else {
        this.handleError("Unable to confirm your account. Plase, try again later or contact an administrator.");
      }

      return;
    }
    this.setState({redirectToLogin: true});
  }

  render() {
    if (this.state.redirectToLogin) {
      /* jshint ignore:start */
      return (<Redirect to="/"/>);
      /* jshint ignore:end */
    }
    return (
      <Page>
        <Row>
          <div className="col-md-4" />
          <div className="col-md-4" style={{ marginTop: "30px" }}>
            <Panel className="rounded">
              <center>
                <h1>Account confirmation</h1>
              </center>
              <hr />
              {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}

              <br />
              <p className="text-muted">
                A confirmation code was sent to your e-mail address
              </p>

              <form role="form" className="form-horizontal">
                <div className="form-group">
                  <label className="control-label col-lg-2">E-mail</label>
                  <label className="control-label col-lg-2">
                    {this.state.email ? this.state.email : null}
                  </label>
                </div>
                <div className="form-group">
                  <label className="control-label col-lg-2">Code</label>
                  <Input
                    classes={"col-lg-10"}
                    placeholder="confirmation code"
                    type="text"
                    onChange={this.codeChange}
                    value={this.state.code}
                  />
                </div>

                <div className="form-group" />

                <div className="form-group">
                  <div className="col-lg-offset-2 col-lg-6">
                    <Button
                      label="Confirm"
                      color="btn-info"
                      onClick={this.handleSubmit}
                    />{" "}
                    <Button label="Cancel" onClick={this.handleCancel} />
                  </div>
                </div>
              </form>
            </Panel>
          </div>
          <div className="col-md-4" />
        </Row>
      </Page>
    );
  }
}

export default compose(withRouter, withAuth)(SignUpConfirmation);
