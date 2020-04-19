import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import {uniqueId} from 'lodash';
import Select from '../../../ui/Select/index.js';


export default class FilterChooser extends Component {
  /* jshint ignore:start */
  static propTypes = {
    className: PropTypes.string,
    filterType: PropTypes.string,
    onChange: PropTypes.func,
    filterValue: PropTypes.string,
    onFilterValueChange: PropTypes.func
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const children = Array.isArray(nextProps.children) ? nextProps.children : [nextProps.children],
      itemsList = [];
    let matched = 0;

    for (let child of children) {
      if ('filterType' in child.props && 'filterName' in child.props) {
        if (child.props.filterType) {
          itemsList.push({
            label: child.props.filterName,
            value: child.props.filterType,
            allowMany: child.props.allowMany,
            color: child.props.color
          });
          matched += prevState.options.findIndex((opt) => opt.value == child.props.filterType) > -1 ? 1 : 0;
        }
      }
    }

    return matched != itemsList.length ? {...prevState, ...{options: itemsList}} : null;
  }
  /* jshint ignore:end */

  constructor(props) {
    super(props);

    const me = this;
    const idPrefix = 'id_';

    me.state ={
      filterId: uniqueId(idPrefix),
      options: []
    };

    // <option value="geo">Geography</option>
    // <option value="channel">Channel</option>
    // <option value="demand">Demand Type</option>
  }

  componentDidMount() {
    const me = this;
    let value, data;

    me.state.options.forEach((option) => {
        if (me.props.filterType == option.value) {
          value = option.value;
          data = option;
        }
    });

    if (value) {
      me.props.onChange(value, data);
    }
  }

  activeChildList(children, filterType) {
    const initialChilds = React.Children.toArray(children),
      active = [],
      me = this;

    for (let child of initialChilds) {
      if ('filterType' in child.props && 'filterName' in child.props) {
        if (child.props.filterType && child.props.filterType == filterType) {
          active.push(React.cloneElement(child, {...child.props, ...{
            value: me.props.filterValue,
            onChange: me.props.onFilterValueChange}}));
        }
      }
    }

    return active;
  }

  render () {
    const me = this,
      { options, filterId } = me.state,
      { children, className, filterType, onChange } = me.props;

    return (
      <div className={classNames('dashboard-filter-chooser', className)}>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-4 control-label" htmlFor={filterId}>Filter By:</label>
            <Select
              id={filterId}
              className="col-sm-8"
              value={filterType}
              options={options}
              onChange={onChange}
            />
          </div>
        </div>
        <div>
          {me.activeChildList(children, filterType)}
        </div>
      </div>
    )
  }
}