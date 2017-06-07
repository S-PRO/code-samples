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
  replaceSpaces,
  getGoogleProfile,
  getFBProfile
} from './common/auth.functions';
import styles from './styles';
import type { _t_signin_props, _t_signin_state } from './flow.types';
import type { _t_sdk_instance } from './common/flow.types';

@inject((allStores) => ({
  auth: allStores.auth,
  store: allStores.signin,
  createProfile: allStores.createYourProfile
}))
@observer
export default class Signin extends Component {

  state: _t_signin_state;
  instance: _t_sdk_instance;

  constructor(props: _t_signin_props) {
    super(props);
    this.state = {
      logo: null,
      isActiveCheckbox: false,
      secureTextEntry: true,
      emailError: false,
      passwordError: false,
      wrongCredential: false
    };
    this.instance = props.screenProps.sdk;
  }

  componentWillReceiveProps(nextProps: {}) { }

  componentDidMount() {
    this.instance.tenant.getTenant((tenant) => {
      if (tenant.logo) {
        this.setState({
          logo: tenant.logo
        });
      }
    });
  }

  componentWillReact() { }

  _emailChanged(event: string) {
    this.setState({ emailError: false });
    this.props.store.setValue({ email: replaceSpaces(event) });
  }

  _passwordChanged(event: string) {
    this.setState({ passwordError: false });
    this.props.store.setValue({ password: replaceSpaces(event) });
  }

  _getUser() { }

  _signin() {
    let emailValid = validateEmail(this.props.store.email),
      passValid = validatePassword(this.props.store.password);

    this.setState({
      emailError: !emailValid,
      passwordError: !passValid,
      wrongCredential: false
    });

    if (emailValid && passValid) {
      this.instance.auth
        .signIn({
          email: this.props.store.email,
          password: this.props.store.password
        })
        .then((res) => {
          this.props.auth.setEmail(res.email);
          this.props.auth.setUid(res.uid);
          this._getUser();
        })
        .catch((error) => {
          parseErrorResponse(error);
          this.setState({
            wrongCredential: true
          });
        });
    }
  }

  _fbSignin() {
    this.instance.auth.fb()
      .then((res) => {
        getFBProfile(res.fb.userID, (result, err) => {
          if (result) {
            this.props.createProfile.setValue(result);
          }
          this.props.auth.setValue({ fbToken: res.fb.accessToken });
          this.props.auth.setUid(res.data.uid);
          this.props.auth.setEmail(res.data.email);
          this._getUser();
        });
      })
      .catch((error) => {
        parseErrorResponse(error);
      });
  }

  _googleSignin() {
    this.instance.auth.google()
      .then((res) => {
        getGoogleProfile(res.google).then((data) => {
          this.props.createProfile.setValue({
            birthday: data.birthday,
            gender: data.gender,
            zip: data.address.zip,
            city: data.address.city,
            country: data.address.country
          });
        });
        this.props.auth.setValue({ googleToken: res.google.accessToken });
        this.props.auth.setUid(res.data.uid);
        this.props.auth.setEmail(res.data.email);
        this._getUser();
      })
      .catch((error) => {
        parseErrorResponse(error);
      });
  }

  _goToForgotPage() {
    this.props.navigation.navigate('ForgotPassword');
  }

  _onPressCheckbox() {
    this.setState({
      isActiveCheckbox: !this.state.isActiveCheckbox,
      secureTextEntry: !this.state.secureTextEntry
    });
  }

  render() {
    const buttonList = [
      {
        label: "LOGIN",
        color: "green",
        onPress: this._signin.bind(this),
      },
      {
        label: "LOGIN WITH GOOGLE",
        color: "red",
        onPress: this._googleSignin.bind(this),
      },
      {
        label: "LOGIN WITH FACEBOOK",
        color: "blue",
        onPress: this._fbSignin.bind(this),
      },
      {
        label: "FORGOT PASSWORD?",
        color: "transparent",
        onPress: this._goToForgotPage.bind(this),
      },
    ];
    const emailFormat = "Check please your email format";
    const passwordFormat = "Your password should have minimum: length 8 characters; 1 number; 1 capital letter.";
    const wrongCredential = "Wrong credentials provided";
    const passwordInvalid = "Your password format is invalid";
    return (
      <View style={styles.mainContainer}>
        <ScrollView>
          <View style={styles.pageBody}>
            <Logo uri={this.state.logo} />
            <TextInputFiled
              isShowAlert={this.state.emailError || this.state.wrongCredential}
              textInputLabel={"Enter email address"}
              textInputAlert={this.state.wrongCredential ? wrongCredential : emailFormat}
              secureTextEntry={false}
              onChangeText={(emailValue) => this._emailChanged(emailValue)}
              value={this.props.store.email}
              isShowCheckbox={false}
            />
            <TextInputFiled
              isShowAlert={this.state.passwordError || this.state.wrongCredential}
              textInputLabel={"Enter password"}
              textInputAlert={this.state.wrongCredential ? wrongCredential : passwordInvalid}
              secureTextEntry={this.state.secureTextEntry}
              onChangeText={(passwordValue) => this._passwordChanged(passwordValue)}
              value={this.props.store.password}
              isShowCheckbox={true}
              onPress={this._onPressCheckbox.bind(this)}
              isActiveCheckbox={this.state.isActiveCheckbox}
              isShowNotification={this.state.passwordError}
              textNotification={passwordFormat}
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
