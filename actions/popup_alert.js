import ModalFromFactory from "../components/modals/factory";
import {WIN_ALERT_WINDOW} from "../constants/windows";
/**
 * Avatar Editors
 */
export const POPUP_ALERT = 'POPUP_ALERT';
export function setAlert(body, title = 'Attention!') {
  ModalFromFactory.show(WIN_ALERT_WINDOW);
  return {
    type: POPUP_ALERT,
    title: body,
    title: title
  }
}