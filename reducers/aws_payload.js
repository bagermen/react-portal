import {
    AWS_PAYLOAD_UPDATE,
    AWS_PAYLOAD_CLEAR
} from '../actions/aws_user';

const initialState = {
};
export default function(state = initialState, action = {}) {
    switch (action.type) {
        case AWS_PAYLOAD_UPDATE:
                return {...state, ...action.value};
        case AWS_PAYLOAD_CLEAR:
            return {...initialState};
        default:
            return state;
    }
}