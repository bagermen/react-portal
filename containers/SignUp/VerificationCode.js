import React, { Component } from "react";
import { Button, Panel } from "../../components/ui";
import { Row, Page } from "../../components/ui/Layout";
import Input from "../../components/ui/Input";
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import { compose } from "redux";
import withAuth from "../../services/auth/withAuth";

class VerificationCode extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      code: "",
      newPassword1: "",
      newPassword2: "",
      showAlert: false,
      showAlertText: "",
      redirectToLogin: false
    };

    this.codeChange = this.codeChange.bind(this);
    this.password1Change = this.password1Change.bind(this);
    this.password2Change = this.password2Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
  }

  componentDidMount() {
    // we need userAttributes in order to change password
    if (!this.props.location.state || !this.props.location.state.email) {
      this.setState({ redirectToLogin: true });
      return;
    }
    this.setState({ email: this.props.location.state.email });
  }

  codeChange(e) {
    this.setState({ code: e.target.value });
  }

  password1Change(e) {
    this.setState({ newPassword1: e.target.value });
  }

  password2Change(e) {
    this.setState({ newPassword2: e.target.value });
  }

  handleSubmit(e) {
    let me = this;
    e.preventDefault();
    this.resetError();

    if (this.state.code === "") {
      console.log("Empty verification code");
      this.handleError("Please, enter the verification code.");
      return;
    }
    if (this.state.newPassword1 === "" || this.state.newPassword2 === "") {
      console.log("Empty new password");
      this.handleError("New password cannot be empty.");
      return;
    }
    if (this.state.newPassword1 !== this.state.newPassword2) {
      console.log("New password not matching");
      this.handleError("New password not matching. Please, enter it again.");
      return;
    }
    this.props.auth
      .createUserWithName(this.state.email)
      .confirmPassword(this.state.code, this.state.newPassword1, {
        onSuccess: function(result) {
          me.setState({ redirectToLogin: true });
        },
        onFailure: function(err) {
          alert(err);
        }
      });
  }

  handleCancel() {
    console.log("Cancel");
    this.setState({ redirectToLogin: true });
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  render() {
    if (this.state.redirectToLogin) {
      /* jshint ignore:start */
      return <Redirect to="/" />;
      /* jshint ignore:end */
    }
    return (
      <Page>
        <Row>
          <div className="col-md-4" />
          <div className="col-md-4" style={{ marginTop: "30px" }}>
            <Panel className="rounded">
              <h1 className="text-center">Reset your password</h1>
              <hr />
              {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}

              <br />
              <p className="text-muted text-center">
                A verification code was sent to your e-mail address
              </p>

              <form role="form" className="form-horizontal">
                <div className="form-group">
                  <label className="col-lg-5">E-mail</label>
                  <label className="col-lg-7">
                    {this.state.email ? this.state.email : null}
                  </label>
                </div>
                <div className="form-group">
                  <label className="col-lg-5">Verification code</label>
                  <Input
                    classes={"col-lg-7"}
                    placeholder="verification code"
                    type="text"
                    onChange={this.codeChange}
                    value={this.state.code}
                  />
                </div>
                <div className="form-group">
                  <label className="col-lg-5">New password</label>
                  <Input
                    classes={"col-lg-7"}
                    placeholder="password"
                    type="password"
                    onChange={this.password1Change}
                    value={this.state.newPassword1}
                  />
                </div>
                <div className="form-group">
                  <label className="col-lg-5">Repeat password</label>
                  <Input
                    classes={"col-lg-7"}
                    placeholder="password"
                    type="password"
                    onChange={this.password2Change}
                    value={this.state.newPassword2}
                  />
                </div>

                <div className="form-group" />

                <div className="form-group">
                  <div className="col-lg-12 text-center">
                    <Button
                      label="Accept"
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

export default compose(
  withRouter,
  withAuth
)(VerificationCode);
