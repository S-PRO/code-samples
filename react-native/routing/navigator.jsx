/**
 * @flow
 */

import React, { Component } from 'react';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { observer, inject } from 'mobx-react/native';
import SplashScreen from 'react-native-splash-screen';

import LinkChecker from './linkChecker';
import AuthTabs from './authTabs';
import RestorePassword from './restorePassword';
import Onboarding from './onboarding';
import Main from './main';
import CommonRoutes from './commonRoutes';


const routeConfig = {
  ...AuthTabs,
  ...RestorePassword,
  ...Onboarding,
  ...Main,
  ...CommonRoutes
};


function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  return route.routeName;
}


@inject((allStores) => ({
  auth: allStores.auth,
  info: allStores.info,
  main: allStores.main
}))
@observer
export default class Navigator extends Component {
  linkChecker: Object | null;
  navigator: { dispatch: null | Function } | null;

  constructor(props: {}) {
    super(props);
    this.navigator = null;
    this.linkChecker = null;
  }

  componentDidMount() {
    this.linkChecker = new LinkChecker((url) => {
      if (url.query.mode === 'resetPassword') {
        this._handleResetPassword(url.query.oobCode, url.query.apiKey);
      }
      else if (url.query.mode === 'verifyEmail') {
        this._handleVerifyEmail(url.query.oobCode, url.query.apiKey);
      }
    });
  }

  _handleVerifyEmail(oobCode, apiKey) {
    const editUserProfileNavigate = NavigationActions.navigate({
      routeName: 'EditUserProfile',
      params: {
        oobCode: oobCode,
        apiKey: apiKey
      }
    });
    const { navigator } = this;

    if (navigator && navigator.dispatch) {
      navigator.dispatch(editUserProfileNavigate);
    }
  }

  _handleResetPassword(oobCode, apiKey) {
    const navigateAction = NavigationActions.navigate({
      routeName: 'ResetPassword',
      params: {
        oobCode,
        apiKey
      }
    });
    const { navigator } = this;

    if (navigator && navigator.dispatch) {
      navigator.dispatch(navigateAction);
    }
  }

  _initRouter() {
    return StackNavigator(routeConfig, this._setNavigatorConfig());
  }

  _defaultAllStores() {
    //clear selected stores when redirecting to AuthTabs
    this.props.main.clearStore();
  }

  _setNavigatorConfig() {
    let _isAuth = this.props.auth.isHydrated && this.props.auth.uid,
      _showIntro = this.props.info.showIntro;

    return {
      initialRouteName: _isAuth ? 'MainTabs' : _showIntro ? 'IntroductionScreen' : 'AuthTabs'
    };
  }

  render() {
    if (!this.props.auth.isHydrated || !this.props.info.isHydrated) {
      return null;
    }

    if (SplashScreen && this.props.auth.isHydrated && this.props.info.isHydrated) {
      SplashScreen.hide();
    }

    let screenProps = {
      sdk: this.props.instance
    },
      Router = this._initRouter();

    return (
      <Router
        onNavigationStateChange={(prevState, currentState) => {
          let startResetRoutes = ['Signup', 'Signin'],
            prev = getCurrentRouteName(prevState),
            current = getCurrentRouteName(currentState);
          if (startResetRoutes.indexOf(current) > -1 && startResetRoutes.indexOf(prev) === -1) {
            this._defaultAllStores();
          }
        }}
        ref={nav => { this.navigator = nav; }}
        screenProps={screenProps} />
    );
  }
}
