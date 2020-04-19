import APIAction from '../../../../services/APIAction';
import {
  API_GET_CONTINENTS,
  API_GET_COUNTRIES,
  API_GET_STATES,
  API_GET_CITIES
} from '../../../../constants/endpoints';

export default {
  getContinents: function() {
    return APIAction.get(API_GET_CONTINENTS, true).then(({data}) => data);
  },

  getCountries: function(continent) {
    if (continent > 0) {
      return APIAction.get(API_GET_COUNTRIES, {
        params: { continent }
      }, true).then(({data}) => data);
    } else {
      return Promise.resolve([]);
    }
  },

  getStates: function(country) {
    if (country > 0) {
      return APIAction.get(API_GET_STATES, {
        params: { country }
      }, true).then(({data}) => data);
    } else {
      return Promise.resolve([]);
    }
  },

  getSities: function(state) {
    if (state > 0) {
      return APIAction.get(API_GET_CITIES, {
        params: { state }
      }, true).then(({data}) => data);
    } else {
      return Promise.resolve([]);
    }
  }
}