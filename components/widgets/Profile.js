/**
 * Copyright 2015-present, Lights in the Sky (3273741 NS Ltd.)
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree. 
 * 
 * @providesModule Profile
 */

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ChangePasswLink from '../ui/ChangePasswLink';
import Avatar from '../ui/Avatar.js';

export default class Profile extends Component {
	render() {
		return (
			<li className="dropdown">
        <a href="#" className="dropdown-toggle" data-toggle="dropdown">
          <Avatar profile={this.props.profile ? this.props.profile.profile: ''} className="thumb-sm pull-left"/>
          {this.props.profile.email ? this.props.profile.email : ''}
          <b className="caret"></b>
        </a>
        <ul className="dropdown-menu animated fadeInRight">
          <span className="arrow top"></span>
          <li>
            <Link to="/app/profile">Profile</Link>
          </li>
          <li>
            <ChangePasswLink>Change Password</ChangePasswLink>
          </li>
          {/*<li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/settings">Settings</Link>
          </li>*/}
          <li className="divider"></li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
        </ul>
      </li>
		);
	}
}
