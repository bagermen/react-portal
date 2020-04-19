import React, {Component} from 'react';
import ActionLink from './ActionLink';
import ModalFactory from '../modals/factory';
import {WIN_CHANGE_PASSWORD} from "../../constants/windows";

export default class ChangePasswLink extends Component {

  constructor(...props) {
    super(...props);
    this.openPasswordChange = this.openPasswordChange.bind(this);
  }

  openPasswordChange(e) {
    e.preventDefault();
    ModalFactory.show(WIN_CHANGE_PASSWORD);
  }

  componentWillUnmount() {
    ModalFactory.hide(WIN_CHANGE_PASSWORD);
  }
  render() {
    /* jshint ignore:start */
    return (<ActionLink itemSelected={this.openPasswordChange}>{this.props.children || 'Change Password'}</ActionLink>);
    /* jshint ignore:end */
  }
}
