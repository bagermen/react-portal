import {
    UPDATE_CROPPED_IMAGE
} from '../actions/avatar_editor';

const initialState = {
    croppedImageUrl: null
};
export default function(state = initialState, action = {}) {
    switch (action.type) {
        case UPDATE_CROPPED_IMAGE:
            return {...state, ...{croppedImageUrl: action.value}};
        default:
            return state;
    }
}