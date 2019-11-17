// import config, { getCurrentLanguage } from '../../containers/LanguageSwitcher/config';
import { Map } from 'immutable';
import I18n from 'react-native-i18n';
import actions from './actions';
import appContext from '../../common/appContext';

const initState = new Map({
  isActivated: false,
  language: 'en',
});

export default function (state = initState, action) {
  switch (action.type) {
    case actions.ACTIVATE_LANG_MODAL:
      return state;
    case actions.CHANGE_LANGUAGE:
      appContext.set('language', action.language);
      I18n.locale = action.language;
      return state.set('language', action.language);
    default:
      return state;
  }
}
