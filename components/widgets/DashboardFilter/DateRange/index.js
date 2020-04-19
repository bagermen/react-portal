import React, { Component }  from 'react';
import DateTimeRangePicker from 'react-bootstrap-daterangepicker';
import PropTypes from "prop-types";
import classNames from 'classnames';
import 'bootstrap-daterangepicker/daterangepicker.css';
import m from 'moment-timezone';
import { Button } from '../../../ui/index';

const _ranges = Symbol('ranges');
const _locale = Symbol('locale');

export default class DateRangePicker extends Component {
  /* jshint ignore:start */
  static propTypes = {
    startDate: PropTypes.number,
    endDate: PropTypes.number,
    period: PropTypes.string,
    tz:  PropTypes.string,
    open:  PropTypes.string,
    dateFormat: PropTypes.string,
    updateRange: PropTypes.func,
    ranges: PropTypes.object
  }
  static defaultProps = {
    period: 'today',
    tz: m.tz.guess(),
    open: 'left',
    dateFormat: 'MM/DD/YYYY',
    ranges: {
      'today': {label: 'Today', range: [ m().startOf('day'), m().endOf('day') ]},
      'yesterday': {label: 'Yesterday', range: [ m().subtract(1, 'days').startOf('day'), m().startOf('day') ]},
      'l1h': {label: 'Last 1 hour', range: [ m().subtract(1, 'hours'), m() ]},
      'l3h': {label: 'Last 3 hours', range: [ m().subtract(3, 'hours'), m() ]},
      'l6h': {label: 'Last 6 hours', range: [ m().subtract(6, 'hours'), m() ]},
      'l12h': {label: 'Last 12 hours', range: [ m().subtract(12, 'hours'), m() ]},
      'l24h': {label: 'Last 24 hours', range: [ m().subtract(24, 'hours'), m() ]},
      'l48h': {label: 'Last 48 hours', range: [ m().subtract(48, 'hours'), m() ]},
      'l72h': {label: 'Last 72 hours', range: [ m().subtract(72, 'hours'), m() ]},
      'l7d': {label: 'Last 7 days', range: [ m().subtract(6, 'days'), m().endOf('day') ]},
      'l30d': {label: 'Last 30 days', range: [ m().subtract(29, 'days'), m().endOf('day') ]},
      'l90d': {label: 'Last 90 days', range: [ m().subtract(89, 'days'), m().endOf('day') ]},
      'l180d': {label: 'Last 180 days', range: [ m().subtract(179, 'days'), m().endOf('day') ]},
      'l365d': {label: 'Last 365 days', range:[ m().subtract(364, 'days'), m().endOf('day') ]}
    },
    updateRange: function() {}
  };

  static getDerivedStateFromProps(nextProps) {
    const [startDate, endDate] = DateRangePicker.getRangeFromProps(nextProps);
    m.tz.setDefault(nextProps.tz);

    return {startDate, endDate};
  }

  static getRangeFromProps({period, ranges, startDate, endDate}) {
    if (period in ranges) {

      return [ranges[period].range[0].clone(), ranges[period].range[1].clone()];
    } else {

      return [m.unix(Number(startDate)), m.unix(Number(endDate))];
    }
  }
  /* jshint ignore:end */

  constructor(...props) {
    super(...props);
    const me = this;

    me.onApply = me.onApply.bind(me);

    me.state = {
      startDate: 0,
      endDate: 0
    }
  }
  get ranges() {
    const me = this;
    let key, range;

    if (!me[_ranges]) {
      me[_ranges] = {};
      for (key in me.props.ranges) {
        if (me.props.ranges.hasOwnProperty(key)) {
          range = me.props.ranges[key];
          me[_ranges][range.label] = range.range;
        }
      }
    };

    return me[_ranges];
  }

  get locale() {
    const me = this;

    if (!me[_locale]) {
      me[_locale] = {
        separator: ' to ',
        format: this.props.dateFormat,
        applyLabel: 'Submit',
        cancelLabel: 'Cancel',
        fromLabel: 'From',
        toLabel: 'To',
        customRangeLabel: 'Custom',
        daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr','Sa'],
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        firstDay: 1
      };
    }

    return me[_locale];
  }
  onApply(ev, picker) {
    const me = this,
      start = picker.startDate,
      end = picker.endDate;

    let period = 'custom';

    for (let range in me.props.ranges) {
      if (!me.props.ranges.hasOwnProperty(range)) {
        continue;
      }

      if (me.props.ranges[range].label === picker.chosenLabel) {
        period = range;
      };
    }

    me.props.updateRange({
      tz: me.props.tz || m.tz.guess(),
      startDate: start.clone().startOf('day').unix(),
      endDate: end.clone().endOf('day').unix(),
      period: period
    });
  }

  onShow(ev, picker) {
    picker.calculateChosenLabel();
  }

  render() {
    const me = this,
          { startDate, endDate } = me.state,
          { opens, className, period, ranges } = me.props,
          label = (period in ranges) ? ranges[period].label
          : ((startDate && endDate && startDate.isValid() && endDate.isValid())
            ? `${startDate.format('MMMM D, YYYY')} - ${endDate.format('MMMM D, YYYY')}`
            : 'Click Me To Open Picker!'
          );

    return (
      <DateTimeRangePicker
        autoUpdateInput={false}
        startDate={startDate}
        endDate={endDate}
        opens={opens}
        showDropdowns={true}
        showWeekNumbers={true}
        timePicker={false}
        buttonClasses={['btn', 'btn-sm']}
        applyClass={'btn-primary'}
        cancelClass={'btn-default'}
        ranges={me.ranges}
        locale={me.locale}
        onApply={me.onApply}
        onShow={me.onShow}
      >
        <Button icon="fa-calendar" classes={classNames('btn-default', className)} label={label}/>
      </DateTimeRangePicker>
    )
  }
}