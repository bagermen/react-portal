import React from "react";
import { Button, Panel } from "../../components/ui";
import { Row, Page } from "../../components/ui/Layout";
import { withRouter } from "react-router";
import { compose } from "redux";
import withAuth from "../../services/auth/withAuth";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      showAlert: false,
      showAlertText: ""
    };
    this.emailChange = this.emailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.onError = this.onError.bind(this);
    this.onVerificationCode = this.onVerificationCode.bind(this);
  }

  emailChange(e) {
    this.setState({ email: e.target.value.trim() });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.resetError();

    if (this.state.email === "") {
      console.log("Empty e-mail");
      this.handleError("E-mail cannot be empty.");
      return;
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.state.email)) {
      console.log("Invalid e-mail address");
      this.handleError("Enter a valid email address.");
      return;
    }

    this.props.auth
      .forgotPassword(this.props.auth.createUserWithName(this.state.email))
      .then(this.onVerificationCode)
      .catch(this.onError);
  }

  handleCancel() {
    console.log("Cancel");
    this.props.history.push("/");
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  onError(err) {
    if (err && err.message) this.handleError(err.message);
    else this.handleError("Unable to access with provided credentials.");
  }

  onVerificationCode() {
    this.props.history.push({
      pathname: "/verificationcode",
      search: "",
      state: { email: this.state.email }
    });
  }

  render() {
    return (
      <Page>
        <Row>
          <div className="col-md-4" />
          <div className="col-md-4 text-center" style={{ marginTop: "30px" }}>
            <Panel className="rounded">
              <h1 className="text-center">Reset Password</h1>
              <hr />
              {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}

              <br />
              <p className="text-muted">
                Please enter your email address to search for your account.
              </p>

              <form role="form">
                <input
                  type="text"
                  className="form-control"
                  onChange={this.emailChange}
                  value={this.state.email}
                />
                <br />
                <Button
                  label="Reset"
                  type="submit"
                  color="btn-info"
                  onClick={this.handleSubmit}
                />{" "}
                <Button label="Cancel" onClick={this.handleCancel} />
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
)(ForgotPassword);
