import React, {Component} from 'react';
import withAuth from "../../services/auth/withAuth";
import { compose } from 'redux';
import classNames from 'classnames';
import ModalFromFactory from "../../components/modals/factory";
import {WIN_CHANGE_PASSWORD} from "../../constants/windows";

class PasswChange extends Component {
  constructor(props) {
    super(props);

    this.onCurrentPasswordChange = this.onCurrentPasswordChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onRepeatChange = this.onRepeatChange.bind(this);

    this.state = {
      currentPassword: '',
      newPassword: '',
      repeatPassword: '',
      errorCurrentPassw: '',
      errorNewPassword: '',
      errorRepeatPassword: '',
      disable: true,
      errorMessage: ''
    };
  }
  onPasswordChange(e) {
    this.resetErrors();
    this.setState({ newPassword: e.target.value });
  }

  onRepeatChange(e) {
    this.resetErrors();
    this.setState({ repeatPassword: e.target.value });
  }

  onCurrentPasswordChange(e) {
    this.resetErrors();
    this.setState({ currentPassword: e.target.value });
  }

  resetErrors() {
    this.setState({
      errorCurrentPassw: '',
      errorNewPassword: '',
      errorRepeatPassword: '',
      disable: false,
      errorMessage: ''
    });
  }

  handleCreate(e) {
    e.preventDefault();

    this.setState({disable: true});

    if (this.state.currentPassword === '') {
      this.setState({ errorCurrentPassw: "Current password cannot be empty." });
      return;
    }
    if (this.state.newPassword === '') {
      this.setState({ errorRepeatPassword: "New password cannot be empty." });
      return;
    }
    if (this.state.newPassword !== this.state.repeatPassword) {
      this.setState({ errorRepeatPassword: "New password not matching. Please, enter it again." });
      return;
    }

     this.props.auth.passwChange(this.state.currentPassword, this.state.newPassword)
     .then(({success, err}) => {
        this.setState({disable: false});
        if (success) {
          ModalFromFactory.hide(WIN_CHANGE_PASSWORD);
        } else {
          this.setState({errorMessage: err || 'Unknown error. Try again'});
        }
     });
  }
  render() {
    /* jshint ignore:start */
    return (
    <section style={{marginBottom:0}}>
      <div className="panel-body m-b-none">
        {this.state.errorMessage ? (<div class="alert alert-danger" role="alert"><p className="login-alert">{this.state.errorMessage}</p></div>):null}
        <form role="form">
        <div className={classNames("form-group", {"has-error": !!this.state.errorCurrentPassw})}>
          <input autoComplete={'off'} type="password" className="form-control" value={this.state.currentPassword} placeholder={'Current Password'} onChange={this.onCurrentPasswordChange}/>
          <span className="text-muted help-block m-b-none">{this.state.errorCurrentPassw}</span>
        </div>
        <div className={classNames("form-group", {"has-error": !!this.state.errorNewPassword})}>
          <input type="password" className="form-control" value={this.state.newPassword} placeholder={'New Password'} onChange={this.onPasswordChange}/>
          <span className="text-muted help-block m-b-none">{this.state.errorNewPassword}</span>
        </div>
        <div className={classNames("form-group", {"has-error": !!this.state.errorRepeatPassword})}>
          <input type="password" className="form-control" value={this.state.onRepeatChange} placeholder={'Repeat Password'} onChange={this.onRepeatChange}/>
          <span className="text-muted help-block m-b-none">{this.state.errorRepeatPassword}</span>
        </div>
        <div className="">
          <button type="button" disabled={this.state.disable}onClick={(e)=>this.handleCreate(e)} className="btn btn-info btn-block w-pad">Change Password</button>
        </div>
        </form>
      </div>
    </section>
    );
    /* jshint ignore:end */
  }
}

export default compose(
  withAuth
)(PasswChange);