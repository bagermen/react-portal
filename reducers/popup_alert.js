import {
    POPUP_ALERT
} from '../actions/popup_alert';

const initialState = {
    title: 'Attention!',
    body: ''
};
export default function(state = initialState, action = {}) {
    switch (action.type) {
        case POPUP_ALERT:
            return {...state, ...{title: action.title, body: action.body}};
        default:
            return state;
    }
}