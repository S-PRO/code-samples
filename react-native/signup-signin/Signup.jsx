/**
 * @flow
 */

import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { observer, inject } from 'mobx-react/native';

import Logo from './components/logo/Logo';
import Button from './components/buttons/Button';
import TextInputFiled from './components/textInputField/TextInputFiled';
import {
  validateEmail,
  validatePassword,
  parseErrorResponse,
  userExist,
  replaceSpaces
} from './common/auth.functions';
import styles from './styles';
import type { _t_signup_props, _t_signup_state } from './flow.types';
import type { _t_sdk_instance } from './common/flow.types';

@inject((allStores) => ({
  auth: allStores.auth,
  store: allStores.signup
}))
@observer
export default class Signup extends Component {
  state: _t_signup_state;
  instance: _t_sdk_instance;
  constructor(props: _t_signup_props) {
    super(props);
    this.state = {
      isActiveCheckbox: false,
      secureTextEntry: true,
      isShowNotification: false,
      emailError: false,
      passwordError: false,
      notMatchPasswords: false,
    };
    this.instance = props.screenProps.sdk;
  }

  componentWillReact() { }

  _emailChanged(event) {
    this.setState({ emailError: false });
    this.props.store.setValue({ email: replaceSpaces(event) });
  }

  _passwordChanged(event) {
    this.setState({ passwordError: false });
    this.props.store.setValue({ password: replaceSpaces(event) });
  }

  _confirmPasswordChanged(event) {
    this.setState({ passwordError: false });
    this.props.store.setValue({ confirmPassword: replaceSpaces(event) });
  }

  _getUser() {
    this.instance.user.getUser(this.props.auth.uid, (user) => {
      if (!userExist(user)) {
        this.props.navigation.navigate('OnboardingTabs');
      }
      else {
      }
    });
  }

  _signup() {
    if (this.props.store.password === this.props.store.confirmPassword) {
      let emailValid = validateEmail(this.props.store.email),
        passValid = validatePassword(this.props.store.password),
        confirmPassValid = validatePassword(this.props.store.confirmPassword);

      if (emailValid && passValid && confirmPassValid) {
        this.instance.auth
          .signUp({
            email: this.props.store.email,
            password: this.props.store.password
          })
          .then((res) => {
            this.props.auth.setEmail(res.email);
            this.props.auth.setUid(res.uid);
            this.props.navigation.navigate('OnboardingTabs');
          })
          .catch((error) => {
            parseErrorResponse(error);
          });
      }
      else {
        this.setState({
          emailError: true,
          passwordError: true
        });
      }
    } else {
      this.setState({ notMatchPasswords: true });
    }
  }

  _fbSignup() {
    this.instance.auth.fb()
      .then((res) => {
        this.props.auth.setEmail(res.email);
        this.props.auth.setUid(res.uid);
        this._getUser();
      })
      .catch((error) => {
        parseErrorResponse(error);
      });
  }

  _googleSignup() {
    this.instance.auth.google()
      .then((res) => {
        this.props.auth.setEmail(res.email);
        this.props.auth.setUid(res.uid);
        this._getUser();
      })
      .catch((error) => {
        parseErrorResponse(error);
      });
  }

  _onPressCheckbox() {
    this.setState({
      isActiveCheckbox: !this.state.isActiveCheckbox,
      secureTextEntry: !this.state.secureTextEntry
    });
  }

  _onFocusPassword() {
    this.setState({
      isShowNotification: true,
    });
  }

  _onBlurPassword() {
    this.setState({
      isShowNotification: false,
    });
  }

  render() {
    const buttonList = [
      {
        label: "SIGN UP",
        color: "green",
        onPress: this._signup.bind(this),
      },
      {
        label: "SIGN UP WITH GOOGLE",
        color: "red",
        onPress: this._googleSignup.bind(this),
      },
      {
        label: "SIGN UP WITH FACEBOOK",
        color: "blue",
        onPress: this._fbSignup.bind(this),
      },
    ];
    const passwordValid = validatePassword(this.props.store.password);
    return (
      <View style={styles.mainContainer}>
        <ScrollView ref="scrollView">
          <View style={styles.pageBody}>
            <Logo uri={this.props.screenProps.logo} />
            <TextInputFiled
              isShowAlert={this.state.emailError}
              textInputLabel={"Enter email address"}
              textInputAlert="Check please your email format"
              secureTextEntry={false}
              onChangeText={(emailValue) => this._emailChanged(emailValue)}
              value={this.props.store.email}
              isShowCheckbox={false}
            />
            <TextInputFiled
              isShowAlert={this.state.passwordError}
              textInputLabel={"Enter password"}
              textInputAlert="Your password format is invalid"
              secureTextEntry={this.state.secureTextEntry}
              onChangeText={(passwordValue) => this._passwordChanged(passwordValue)}
              value={this.props.store.password}
              isShowCheckbox={true}
              onPress={this._onPressCheckbox.bind(this)}
              onFocus={this._onFocusPassword.bind(this)}
              onBlur={this._onBlurPassword.bind(this)}
              isActiveCheckbox={this.state.isActiveCheckbox}
              isShowNotification={!passwordValid && (this.state.isShowNotification || this.state.passwordError)}
              textNotification={"Your password should have minimum: length 8 characters; 1 number; 1 capital letter."}
            />
            <TextInputFiled
              isShowAlert={this.state.passwordError}
              textInputLabel={"Re-enter password"}
              textInputAlert="Your password format is invalid"
              secureTextEntry={this.state.secureTextEntry}
              onChangeText={(reEnterPasswordValue) => this._confirmPasswordChanged(reEnterPasswordValue)}
              value={this.props.store.confirmPassword}
              isShowCheckbox={true}
              onPress={this._onPressCheckbox.bind(this)}
              isActiveCheckbox={this.state.isActiveCheckbox}
            />
            {
              buttonList.map((button, index) =>
                <Button
                  key={index}
                  label={button.label}
                  color={button.color}
                  onPress={button.onPress}
                />
              )
            }
          </View>
        </ScrollView>
      </View>
    );
  }
}
