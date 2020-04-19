import React, {Component} from 'react';
import {Button, Panel} from '../../components/ui';
import {Row, Col, Page} from '../../components/ui/Layout';
import Input from '../../components/ui/Input';
import { withRouter } from "react-router";
import { Redirect } from "react-router-dom";
import withAuth from "../../services/auth/withAuth";
import { compose } from 'redux';

class ChangePassword extends Component{
  constructor(props) {
    super(props);
    this.cognitoUser = null;
    this.state = {
      current: '',
      new1: '',
      new2: '',
      cognitoUser: null,
      showAlert: false,
      showAlertText: '',
      redirectToLogin: false
    };

    this.currentChange = this.currentChange.bind(this);
    this.new1Change = this.new1Change.bind(this);
    this.new2Change = this.new2Change.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
  }

  componentDidMount() {
    // we need userAttributes in order to change password
    if ( !this.props.location.state || !this.props.location.state.userAttributes ) {
      this.setState({redirectToLogin: true});
    } else if (this.props.location.state.cognitoUser) {
      // We need a cognitoUser in order to change its password
      this.cognitoUser = this.props.location.state.cognitoUser;
    } else {
      this.props.auth.getUser().then((cognitoUser) => {
        this.cognitoUser = cognitoUser;
        if (!cognitoUser) {
          this.setState({redirectToLogin: true});
        }
        this.cognitoUser = null;
      });
    }
  }
  componentWillUnmount() {
    this.cognitoUser = null;
  }

  currentChange(e) {
    this.setState({current:e.target.value});
  }

  new1Change(e) {
    this.setState({new1:e.target.value});
  }

  new2Change(e) {
    this.setState({new2:e.target.value});
  }

  handleSubmit(e) {
    let me = this;
    e.preventDefault();
    this.resetError();

    if (this.state.current === '')
    {
      this.handleError("Current password cannot be empty.");
      return;
    }
    if (this.state.new1 === '' || this.state.new2 === '')
    {
      this.handleError("New password cannot be empty.");
      return;
    }
    if (this.state.new1 !== this.state.new2)
    {
      this.handleError("New password not matching. Please, enter it again.");
      return;
    }

    if (this.cognitoUser) {
      this.cognitoUser.completeNewPasswordChallenge(this.state.new1, null,
        {
          onSuccess: function() {
            me.setState({redirectToLogin: true});
          },
          onFailure: function(err) {
            alert(err);
          }
        }
      );
    }
  }

  handleReset() {
    this.setState({current:'', new1:'', new2:'', showAlert:false, showAlertText:''});
  }

  handleError(err) {
    this.setState({showAlert:true, showAlertText:"" + err});
  }

  resetError() {
    this.setState({showAlert:false, showAlertText:''});
  }

  render() {
    if (this.state.redirectToLogin) {
      /* jshint ignore:start */
      return (<Redirect to="/"/>);
      /* jshint ignore:end */
    }
    /* jshint ignore:start */
    return(
      <Page>
        <Row>
          <div className="col-md-4"></div>
          <div className="col-md-4" style={{marginTop:'30px'}}>
            <Panel className="rounded" >
              <h1>Change password</h1>
              <hr/>
              {
                this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
                ) : null
              }
            
              <form role="form" className="form-horizontal">
                <div className="form-group">
                  <label className="control-label col-lg-2">E-mail</label>
                  <label className="control-label col-lg-2">{this.props.location.state.userAttributes.email ? this.props.location.state.userAttributes.email : null}</label>
                </div>
                <div className="form-group">
                  <label className="control-label col-lg-2">Current password</label>
                  <Input classes={'col-lg-10'} placeholder="password" type="password" onChange={this.currentChange} value={this.state.current} />
                </div>
                <div className="form-group">
                  <label className="control-label col-lg-2">New password</label>
                  <Input classes={'col-lg-10'} placeholder="password" type="password" onChange={this.new1Change} value={this.state.new1} />
                </div>
                <div className="form-group">
                  <label className="control-label col-lg-2">Repeat password</label>
                  <Input classes={'col-lg-10'} placeholder="password" type="password" onChange={this.new2Change} value={this.state.new2} />
                </div>

                <div className="form-group">
                </div>

                <div className="form-group">
                  <div className="col-lg-offset-2 col-lg-4">
                    <Button label="Login" color="btn-info" onClick={this.handleSubmit}/>{' '}
                  </div>
                </div>
              </form>
            </Panel>
          </div>
          <div className="col-md-4"></div>
        </Row>
        </Page>
    )
    /* jshint ignore:end */
  }
}

export default compose(
  withRouter,
  withAuth
)(ChangePassword);