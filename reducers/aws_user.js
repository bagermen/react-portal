import {
    AWS_USER_SET,
    AWS_USER_REMOVE,
    AWS_USER_CLEAR,
    AWS_SET_AUTH_FLAG,
    AWS_PAYLOAD_UPDATE,
    AWS_PAYLOAD_CLEAR
} from '../actions/aws_user';
import payload from './aws_payload';

const initialState = {};
export default function(state = initialState, action = {}) {
    let stateCopy;

    switch (action.type) {
        case AWS_USER_SET:

            return {...state, ...{[action.key]: action.value}};
        case AWS_USER_REMOVE:
            stateCopy = {...state};
            delete stateCopy[action.key];

            return stateCopy;
        case AWS_USER_CLEAR:

            return {...initialState};
        case AWS_SET_AUTH_FLAG:

            return {...state, ...{isAuthenticated: !!action.value}};
        case AWS_PAYLOAD_UPDATE:
        case AWS_PAYLOAD_CLEAR:
            state.payload = payload(state.payload, action);

                return state;
        default:

                return state;
    }
}