import { NavigationActions } from 'react-navigation';

let navigator;

const setTopLevelNavigator = (navigatorRef) => {
  navigator = navigatorRef;
};

const navigate = (routeName, params, subRouteName) => {
  const action = subRouteName && NavigationActions.navigate({ routeName: subRouteName });
  const navigation = NavigationActions.navigate({
    routeName,
    params,
    action,
  });
  navigator.dispatch(navigation);
};

const back = () => {
  navigator.dispatch(
    NavigationActions.back(),
  );
};

export default {
  back,
  navigate,
  setTopLevelNavigator,
};
