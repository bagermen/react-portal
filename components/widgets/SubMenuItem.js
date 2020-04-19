import React from 'react';
import { NavLink } from 'react-router-dom';
import { withRouter, matchPath } from 'react-router';
import classNames from 'classnames';
import PropTypes from "prop-types";

class SubMenuItem extends React.Component {
  static propTypes = {
    link:  PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    linkText: PropTypes.string,
    location: PropTypes.object,
    badgeText: PropTypes.string
  }
  render() {
    const { location: { pathname } } = this.props,
      match = matchPath(pathname, this.props.link),
      itemClass = classNames({
        'active': (match && (match.isExact || this.props.children && !match.isExact && pathname.startsWith(this.props.link)))
      });

    let badge = this.props.badgeText
      ? <b className="badge bg-danger pull-right">{this.props.badgeText}</b>
      : null;
    return (
      <li className={itemClass}>
        {" "}<NavLink to={this.props.link} activeClassName="active">
          {" "}<i className="fa fa-angle-right" /> {badge}<span>{this.props.linkText}</span>
          {" "}
        </NavLink>
        {" "}
      </li>
    );
  }
}

export default withRouter(SubMenuItem);