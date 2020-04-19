import {
	USER_SET_DATA,
	USER_CLEAR_DATA,
	USER_CHANGE_ISMEM
} from '../actions';

const initialState = {
	sub: '',
	profile:'dist/images/avatar.png',
	email: '',
	given_name: '',
	family_name: '',
	phone_number: '',
	company_title: '',
	address: '',
	isMem: false
};

export default function user(state = initialState, action) {
	switch (action.type) {
		case USER_SET_DATA:
			return Object.assign({}, state, action.data);
		case USER_CLEAR_DATA:
			return Object.assign({}, initialState);
		case USER_CHANGE_ISMEM:
			return {...state, ...{isMem: action.value}};
		default:
  		return state;
	}
}