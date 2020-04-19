/**
 * Copyright 2015-present, Lights in the Sky (3273741 NS Ltd.)
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree. 
 * 
 * @providesModule MenuLink
 */

import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter, matchPath } from 'react-router';
import classNames from 'classnames';
import PropTypes from "prop-types";


class MenuItem extends React.Component {
  /* jshint ignore:start */
  static propTypes = {
    icon: PropTypes.string,
    badgeCount: PropTypes.number,
    color: PropTypes.string,
    link:  PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    linkText: PropTypes.string,
    location: PropTypes.object
  }
  /* jshint ignore:end */
  constructor(props) {
    super(props);
    this.state = {
      open : false
    }
  }

  renderSubMenu() {
    if (!this.props.children) return null;
    return (
      <ul className="nav bg-black" style={ { display: this.state.open ? 'block' : 'none'}}>
        {this.props.children}
      </ul>
    )
  }

  toggleOpen(e) {
    e.preventDefault();
    this.setState({open:!this.state.open});
  }

	render() {
    const { location: { pathname } } = this.props,
      match = matchPath(pathname, this.props.link),
      badge = this.props.badgeCount ? (<b className="badge bg-danger">{this.props.badgeCount}</b>) : null,
      iconClasses = classNames('m-l-md fa icon', this.props.icon),
      itemClass = classNames({
        'active': (match && (match.isExact || this.props.children && !match.isExact && pathname.startsWith(this.props.link))),
        [this.props.color]: !!this.props.color
      });

    if (this.props.children) {
      return (
        <li className={itemClass}>
          <a className={itemClass} href="#" onClick={(e)=>this.toggleOpen(e)}>
            <i className={iconClasses}></i>
              {badge}
            <span>{this.props.linkText}</span>
          </a>
          {this.renderSubMenu()}
        </li>
      );
    } else {
      return (
        <li className={itemClass}>
          <NavLink className={itemClass} activeClassName="active" to={this.props.link}>
            <i className={iconClasses}></i>
              {badge}
            <span>{this.props.linkText}</span>
          </NavLink>
        </li>
		  );
    }
	}
}

export default withRouter(MenuItem);