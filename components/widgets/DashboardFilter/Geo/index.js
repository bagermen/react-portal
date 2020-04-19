import React from 'react';
import classNames from 'classnames';
import PropTypes from "prop-types";
import {uniqueId} from 'lodash';
import Filter from '../BaseFilter/index';
import Select from '../../../ui/Select/index';
import api from './api';
import './style.less';

export default class Geo extends Filter {
  /* jshint ignore:start */

  static defaultProps = {
    filterType: 'geo',
    filterName: 'Geography',
    allowMany: false,
    color: '#739860'
  }

  /* jshint ignore:end */

  constructor(props) {
    super(props);
    const me = this;
      let value = {};

    if (props.value) {
      try {
        value = JSON.parse(props.value);
      } catch (e) {}
    }

    me.state = {...me.state, ...{
      continent: value.continent,
      country: value.country,
      state: value.state,
      sity: value.sity,
      continents: [],
      countries: [],
      states: [],
      sities: [],

      filterId2: uniqueId(me.idPrefix),
      filterId3: uniqueId(me.idPrefix),
      filterId4: uniqueId(me.idPrefix),
    }};

    me.onChangeContinent = me.onChangeContinent.bind(me);
    me.onChangeCountry = me.onChangeCountry.bind(me);
    me.onChangeState = me.onChangeState.bind(me);
    me.onChangeSity = me.onChangeSity.bind(me);
  }

  componentDidMount() {
    const me = this,
      loadContinent = () => api.getContinents(),
      loadCountry = (id) => api.getCountries(id),
      loadState = (id) => api.getStates(id),
      loadSity = (id) => api.getSities(id);

    Promise.all([
      loadContinent(),
      !!me.state.continent && !!me.state.country && loadCountry(me.state.continent.id),
      !!me.state.country && !!me.state.state && loadState(me.state.country.id),
      !!me.state.state && !!me.state.sity && loadSity(me.state.state.id)
    ]).then(([continents, countries, states, sities]) => {
      me.setState({
        continents,
        countries: countries || [],
        states: states || [],
        sities: sities || []
      })
    });
  }

  async onChangeContinent(value, obj) {
    const me = this;
    const countries = await api.getCountries(value);

    me.setState({
      continent: obj,
      country: null,
      state: null,
      sity: null,
      countries,
      states: [],
      sities: []
    }, () => me.updateValue());
  }

  async onChangeCountry(value, obj) {
    const me = this;
    const states = await api.getStates(value);

    me.setState({
      country: obj,
      state: null,
      sity: null,
      states,
      sities: []
    }, () => me.updateValue());
  }

  async onChangeState(value, obj) {
    const me = this;
    const sities = await api.getSities(value);

    me.setState({
      state: obj,
      sity: null,
      sities
    }, () => me.updateValue());
  }

  onChangeSity(value, obj) {
    const me = this;
    me.setState({sity: obj}, () => me.updateValue());
  }

  updateValue() {
    const me = this;
    let value = JSON.stringify({
        continent: me.state.continent,
        country: me.state.country,
        state: me.state.state,
        sity: me.state.sity
      }),
      serverValue = {
        continent: me.state.continent && me.state.continent.id,
        country: me.state.country && me.state.country.id,
        state: me.state.state && me.state.state.id,
        sity: me.state.sity && me.state.sity.id
      },
      userValue = '';

    Object.keys(serverValue).forEach((key) => {
      if (!serverValue[key]) {
        delete serverValue[key];
      } else {
        userValue += (userValue ? ',' : '') + `${key[0].toUpperCase() + key.substr(1)}:${me.state[key].name}`;
      }
    });

    me.props.onChange({
      value,
      serverValue,
      userValue
    });
  }
  render () {
    const me = this,
      { className} = me.props,
      {
        country, continent, state, sity,
        countries, continents, states, sities,
        filterId, filterId2, filterId3, filterId4
      } = me.state,
      getOptionLabel = (data) => data && data.name,
      getOptionValue = (data) => data && data.id;

    return (
      <div className={classNames('dashboard-filter', 'dashboard-filter-geo', className)}>
        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor={filterId}>Continent:</label>
            <Select
              id={filterId}
              className="col-sm-10"
              value={continents.length && getOptionValue(continent)}
              options={continents}
              onChange={me.onChangeContinent}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              isDisabled={!continents.length}
              isSearchable={true}
            />
          </div>
        </div>

        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor={filterId2}>Country:</label>
            <Select
              id={filterId2}
              className="col-sm-10"
              value={countries.length && getOptionValue(country)}
              options={countries}
              onChange={me.onChangeCountry}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              isDisabled={!countries.length}
              isSearchable={true}
              isClearable={true}
            />
          </div>
        </div>

        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor={filterId3}>State/Region:</label>
            <Select
              id={filterId3}
              className="col-sm-10"
              value={states.length && getOptionValue(state)}
              options={states}
              onChange={me.onChangeState}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              isDisabled={!states.length}
              isSearchable={true}
              isClearable={true}
            />
          </div>
        </div>

        <div className="form-horizontal">
          <div className="form-group">
            <label className="col-sm-2 control-label" htmlFor={filterId4}>City:</label>
            <Select
              id={filterId4}
              className="col-sm-10"
              value={sities.length && getOptionValue(sity)}
              options={sities}
              onChange={me.onChangeSity}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              isDisabled={!sities.length}
              isSearchable={true}
              isClearable={true}
            />
          </div>
        </div>
      </div>
    )
  }
}