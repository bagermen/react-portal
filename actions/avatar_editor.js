/**
 * Avatar Editors
 */
export const UPDATE_CROPPED_IMAGE = 'UPDATE_CROPPED_IMAGE';
export function updateCroppedImage(croppedImageUrl) {
  return {
    type: UPDATE_CROPPED_IMAGE,
    value: croppedImageUrl
  }
}