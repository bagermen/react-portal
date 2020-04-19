import {
    CHANGE_LOADING_STATUS
} from '../actions/index';

const initialState = {
    loading: false
};
export default function(state = initialState, action = {}) {
    switch (action.type) {
        case CHANGE_LOADING_STATUS:
            return {...state, ...{loading: action.value}};
        default:
            return state;
    }
}