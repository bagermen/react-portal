import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";


export default class DashboardTopPanel extends Component {
  /* jshint ignore:start */
  static propTypes = {
    active: PropTypes.number,
    total: PropTypes.number,
    opportunities: PropTypes.number,
    completions: PropTypes.number,
    fillRate:  PropTypes.number,
    revenue: PropTypes.number
  }
  
  /* jshint ignore:end */
  render () {
    return (
      <div className={classNames('dashboard-top-panel', this.props.className)}>
        <div>{this.props.active || 0} of {this.props.total || 0}</div>
        <div>Active channels</div>
        <div>{this.props.opportunities}</div>
        <div>Opportunities</div>
        <div>{this.props.impressions}</div>
        <div>Impressions</div>
        <div>{this.props.completions}</div>
        <div>Ads completed</div>
        <div>{this.props.fillRate.toLocaleString('en-EN', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 2 }).replace(/[\%\s]/,'')} %</div>
        <div>Fill rate</div>
        <div>$ {this.props.revenue.toLocaleString('en-EN', { style: 'currency', currency: 'USD' }).replace(/[\$\s]/,'') }</div>
        <div>Revenue</div>
        <div>{this.props.children}</div>
      </div>
    )
  }
}