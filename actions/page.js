/**
 * Actions to update page name and description
 */
export const UPDATE_PAGE_NAME = 'UPDATE_PAGE_NAME';
export const UPDATE_PAGE_DESCRIPTION = 'UPDATE_PAGE_DESCRIPTION';

export function updatePageName(name) {
  return {
    type: UPDATE_PAGE_NAME,
    data: name
  }
}
export function updatePageDescription(description) {
  return {
    type: UPDATE_PAGE_DESCRIPTION,
    data: description
  }
}