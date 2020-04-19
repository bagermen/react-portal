import React from "react";
import { Redirect } from "react-router-dom";
import { Button, Panel } from "../../components/ui";
import { Row, Page } from "../../components/ui/Layout";
import Input from "../../components/ui/Input";
import { compose, bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import withAuth from "../../services/auth/withAuth";
import { setUserData, clearUserData } from "../../actions/index";
import PropTypes from "prop-types";

class Login extends React.Component {
  /* jshint ignore:start */
  static propTypes = {
    user: PropTypes.object,
    setUserData: PropTypes.func,
    clearUserData: PropTypes.func,
    auth: PropTypes.object,
    isAuthenticated: PropTypes.bool,
    setAuthenticated: PropTypes.func,
    checkAuth: PropTypes.func
  };
  /* jshint ignore:end */
  constructor(...props) {
    super(...props);
    this.state = {
      email: "",
      password: "",
      userAttributes: null,
      requiredAttributes: null,
      showAlert: false,
      showAlertText: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.passwordChange = this.passwordChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.handleForgotPassword = this.handleForgotPassword.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onNewPasswordRequired = this.onNewPasswordRequired.bind(this);
  }

  componentDidMount() {
    this.props.checkAuth();
  }

  emailChange(e) {
    this.setState({ email: e.target.value.trim() });
  }

  passwordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.resetError();

    if (this.state.email === "") {
      console.log("Empty e-mail");
      this.handleError(
        "Username cannot be empty. Please, enter a valid e-mail."
      );
      return;
    }
    if (this.state.password === "") {
      console.log("Empty password");
      this.handleError(
        "Password cannot be empty. Please, enter your password."
      );
      return;
    }

    // Validate e-mail
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.state.email)) {
      console.log("Invalid e-mail address");
      this.handleError("Enter a valid email address.");
      return;
    }

    this.props.auth
      .logIn(this.state.email, this.state.password)
      .then(({ status, cognitoUser, userAttributes, requiredAttributes }) => {
        switch (status) {
          case "newPasswordRequired":
            this.onNewPasswordRequired(
              cognitoUser,
              userAttributes,
              requiredAttributes
            );
            break;
          default:
            this.props.auth.getSession(cognitoUser).then(({ err, session }) => {
              if (!err && session && session.isValid()) {
                this.onSuccess(session);
              } else {
                this.onError(err);
              }
            });
        }
      })
      .catch(err => {
        this.onError(err);
      });
  }

  handleForgotPassword() {
    this.props.history.push("/forgotpassword");
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  onSuccess(session) {
    this.props.auth.getUserAttributes().then(data => {
      this.props.setUserData(data);
      this.props.setAuthenticated(true);
    });
  }

  onError(err) {
    const message =
      err && err.message
        ? err.message
        : "Unable to access with provided credentials.";

    this.props.clearUserData();
    this.props.setAuthenticated(false);
    this.handleError(message);
  }

  onNewPasswordRequired(cognitoUser, userAttributes, requiredAttributes) {
    this.props.history.push({
      pathname: "/changepassword",
      search: "",
      state: {
        cognitoUser: cognitoUser,
        userAttributes: userAttributes,
        requiredAttributes: requiredAttributes
      }
    });
  }

  render() {
    const from = (this.props.location.state &&
      this.props.location.state.from) || { pathname: "/app/dashboard" };

    if (this.props.isAuthenticated === true) {
      /* jshint ignore:start */
      return <Redirect to={from} />;
      /* jshint ignore:end */
    }

    /* jshint ignore:start */
    return (
      <Page>
        <Row>
          <div className="col-md-4" />
          <div className="col-md-4" style={{ marginTop: "30px" }}>
            <Panel className="rounded">
              <h1 className="text-center">Welcome to VIDtizer</h1>
              <hr />
              {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}

              <form role="form" className="form-horizontal">
                <div className="form-group">
                  <label className="control-label col-lg-2">E-mail</label>
                  <Input
                    classes={"col-lg-10"}
                    placeholder="email"
                    type="email"
                    onChange={this.emailChange}
                    value={this.state.email}
                  />
                </div>
                <div className="form-group">
                  <label className="control-label col-lg-2">Password</label>
                  <Input
                    classes={"col-lg-10"}
                    placeholder="password"
                    type="password"
                    onChange={this.passwordChange}
                    value={this.state.password}
                  />
                </div>
                <div className="form-group" />
                <div className="form-group">
                  <div className="col-lg-12 text-center">
                    <Button
                      label="Log in"
                      color="btn-info"
                      onClick={this.handleSubmit}
                      style={{ marginRight: "7px" }}
                    />{" "}
                    <a
                      href="/signup"
                      style={{ marginLeft: "7px" }}
                      className="btn btn-success"
                    >
                      Sign Up
                    </a>
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-lg-12 text-center">
                    <a
                      onClick={this.handleForgotPassword}
                      style={{ marginRight: "7px" }}
                      className="forgot-password"
                    >
                      Forgot Password?
                    </a>{" "}
                    <a
                      href="/registervsp"
                      style={{ marginLeft: "7px" }}
                      className="forgot-password"
                    >
                      Register as new VSP
                    </a>
                  </div>
                </div>
              </form>
            </Panel>
          </div>
          <div className="col-md-4" />
        </Row>
      </Page>
    );
    /* jshint ignore:end */
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        clearUserData,
        setUserData
      },
      dispatch
    )
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Login);
