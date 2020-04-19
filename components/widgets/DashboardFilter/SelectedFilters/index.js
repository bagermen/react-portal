import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import FilterItem from '../../../ui/FilterItem/index';


export default class SelectedFilters extends PureComponent {
  /* jshint ignore:start */
  static propTypes = {
    className: PropTypes.string,
    filters: PropTypes.array
  }
  static defaultProps = {
    filters: [],
    onRemove: () => {}
  }
  /* jshint ignore:end */

  onRemove(filterId) {
    const me = this;

    me.props.onRemove(filterId);
  }
  render() {
    const me = this,
      { className, filters } = me.props;

    return (
      <div className={classNames('dashboard-filter-selected', className)}>
        {filters.map((item) =>(
          <FilterItem
            key={item.filterId}
            name={item.userValue}
            filterId={item.filterId}
            color={item.color}
            onRemove={me.onRemove.bind(me, item.filterId)}
          />
        ))}
      </div>
    )
  }
}