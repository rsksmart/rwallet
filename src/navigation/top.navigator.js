import {
  NavigationActions,
  StackActions,
  // eslint-disable-next-line no-unused-vars
  NavigationReplaceActionPayload,
  // eslint-disable-next-line no-unused-vars
  NavigationPopActionPayload,
  // eslint-disable-next-line no-unused-vars
  NavigationNavigateActionPayload,
  // eslint-disable-next-line no-unused-vars
  NavigationResetActionPayload,
} from 'react-navigation';

let navigator;

function setTopLevelNavigator(navigatorRef) {
  navigator = navigatorRef;
}

function navigate(options) {
  navigator.dispatch(
    NavigationActions.navigate(options),
  );
}

function goBack() {
  navigator.dispatch(
    NavigationActions.back(),
  );
}

function replace(param) {
  navigator.dispatch(
    StackActions.replace(param),
  );
}

function pop(options) {
  navigator.dispatch(
    StackActions.pop(options),
  );
}

function popToTop(options) {
  navigator.dispatch(
    StackActions.popToTop(options),
  );
}

function reset(options) {
  navigator.dispatch(
    StackActions.reset(options),
  );
}

function getTopNavigator() {
  return navigator;
}

function getCurrentRoute() {
  return navigator.state.nav;
}

export default {
  goBack,
  navigate,
  replace,
  pop,
  popToTop,
  getTopNavigator,
  getCurrentRoute,
  setTopLevelNavigator,
  reset,
};
