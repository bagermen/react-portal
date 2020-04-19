/**
 * Page descriotion
 */
import {
    UPDATE_PAGE_NAME, UPDATE_PAGE_DESCRIPTION
} from '../actions/page';
  
  const initialState = {
    name: '',
    description: ''
  };
  
export default function page(state = initialState, action) {
  switch (action.type) {
    case UPDATE_PAGE_NAME:
      if (state.name !== action.data) {
        return Object.assign({}, state, {
          name: action.data
        });
      }
    case UPDATE_PAGE_DESCRIPTION:
      if (state.description !== action.data) {
        return Object.assign({}, state, {
          description: action.data
        });
      }
  }

  return state;
}