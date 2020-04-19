import m from 'moment-timezone';
import {
  DASHBOARD_UPDATE_COMMON_DATA,
  DASHBOARD_LOAD_DATA,
  DASHBOARD_CLEAR_DATA
} from '../../actions/dashboard';

const initialState = {
  active: 0,
  total: 0,
  opportunities: 0,
  impressions: 0,
  completions: 0,
  revenue: 0,
  fillRate: 0,
  charts: {
    opportunities: {
      histogram: [],
      byChannel: [],
      byCountry: [],
      byEnvType: [],
      perDemand: []
    },
    impressions: {
      histogram: [],
      byChannel: [],
      byCountry: [],
      byEnvType: [],
      perDemand: []
    },
    completions: {
      histogram: [],
      byChannel: [],
      byCountry: [],
      byEnvType: [],
      perDemand: []
    }
  }
};
export default function(state = initialState, action = {}) {

  switch (action.type) {
    case DASHBOARD_UPDATE_COMMON_DATA:

      return {
        active: action.value.active || 0,
        total: action.value.total || 0,
        opportunities: action.value.opportunities || 0,
        impressions: action.value.impressions || 0,
        completions: action.value.completions || 0,
        revenue: action.value.revenue || 0,
        fillRate: action.value.fillRate || 0,
        charts: state.charts
      };
    case DASHBOARD_LOAD_DATA:
      return {...state, ...{
        charts: action.value
      }};
    case DASHBOARD_CLEAR_DATA:

    return { ...initialState };
    default:

        return state;
  }
}