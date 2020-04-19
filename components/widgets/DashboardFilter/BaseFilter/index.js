import React, { PureComponent } from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import {uniqueId} from 'lodash';
import Input from '../../../ui/Input';
import './style.less';
/**
 * 
 */
export default class Filter extends PureComponent {
  /* jshint ignore:start */
  static propTypes = {
    filterType: PropTypes.string.isRequired,
    filterName: PropTypes.string.isRequired,
    className: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    allowMany: PropTypes.bool
  };
  static defaultProps = {
    value: '',
    filterType: 'def',
    filterName: 'Default',
    allowMany: false,
    color: 'grey',
    onChange: function() {}
  };

  idPrefix = 'id_';

  constructor(props) {
    super(props);
    const me = this;

    me.updateValue = me.updateValue.bind(me);

    me.state = {
      filterId: uniqueId(me.idPrefix)
    }

    props.onChange({
      value: '',
      serverValue: {},
      user: 'Default'
    });
  }

  updateValue(e) {
    const me = this,
      value = e.currentTarget.value,
      serverValue = {
        default: e.currentTarget.value
      },
      user = `Default:${e.currentTarget.value}`;

    me.props.onChange({
      value, // filter value
      serverValue, // object for server
      user // filter visible string
    });
  }

  /* jshint ignore:end */
  render () {
    const me = this,
      { value, className} = me.props;

    return (
      <div className={classNames('dashboard-filter', className)}>
        <div className='form-horizontal'>
          <div className='form-group'>
            <label className='col-sm-2 control-label' htmlFor={me.state.filterId}>Default:</label>
            <Input id={me.state.filterId} classes={'col-sm-10'} value={value} onFieldChange={me.updateValue}/>
          </div>
        </div>
      </div>
    )
  }
}