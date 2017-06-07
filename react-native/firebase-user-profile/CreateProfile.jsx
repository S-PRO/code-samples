// @flow

import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import Geocoder from 'react-native-geocoder';
import { observer, inject } from 'mobx-react/native';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';

import DatePicker from './components/datePicker';
import AccountPhoto from './components/accountPhoto/AccountPhoto';
import TextInputFiled from './components/textInputField/TextInputFiled';
import TextField from './components/textField';
import BonusCardNumber from './components/bonusCardNumber/BonusCardNumber';
import Button from './components/buttons/Button';
import RowChooseOneOfThird from './components/rowChooseOnOfThird/RowChooseOneOfThird';
import styles from './styles';
import { getFileFormat } from './common/file.functions';
import { showActionSheet } from './components/actionSheet';
import type { _t_props, _t_state } from './flow.types';
import type { _t_sdk_instance } from './common/flow.types';

@inject((allStores) => ({
  auth: allStores.auth,
  store: allStores.createYourProfile
}))
@observer
export default class CreateProfile extends Component {
  state: _t_state;
  instance: _t_sdk_instance;
  constructor(props: _t_props) {
    super(props);
    this.state = {
      activeGender: 0,
      valid: true
    };
    this.instance = props.screenProps.sdk;
  }

  componentWillUnmount() {
    this.props.store.clearStore();
  }

  _imagePathChanged(imagePath) {
    this.props.store.setValue({ imagePath });
  }

  _firstChanged(event: string) {
    this.props.store.setValue({ first: event });
  }

  _lastChanged(event: string) {
    this.props.store.setValue({ last: event });
  }

  _genderChanged(gender: string, index: number) {
    this.setState({ activeGender: index }, () => {
      this.props.store.setValue({ gender });
    });
  }

  _birthdayChanged(birthday, date) {
    this.props.store.setValue({ birthday: moment(birthday, 'DD. MMM YYYY') });
  }

  _zipChanged(zip: string) {
    this.props.store.setValue({ zip });
  }

  _cityChanged(city: string) {
    this.props.store.setValue({ city });
  }

  _countryChanged(country: string) {
    this.props.store.setValue({ country });
  }

  _bonusCardChanged(bonusCard: string) {
    this.props.store.setValue({ bonusCard });
  }

  _autoPopulateCity() {
    if (this.props.store.zip) {
      // test zipcode - 12201 - Rhodel
      Geocoder.geocodeAddress(this.props.store.zip)
        .then(res => {
          if (res.length) {
            this.props.store.setValue({ city: res[0].locality });
            this.props.store.setValue({ country: res[0].country });
          }
        })
        .catch(err => { });
    }
  }

  _setImage(image) {
    this.props.store.setValue({
      image: {
        ...image,
        format: getFileFormat(image.mime),
      }
    });
  }

  _openCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true
    }).then(this._setImage.bind(this));
  }

  _openGallery() {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then(this._setImage.bind(this));
  }

  _callPhotoModule() {
    let options = [
      {
        label: 'Take a Photo',
        onPress: this._openCamera.bind(this)
      },
      {
        label: 'Choose Photo from gallery',
        onPress: this._openGallery.bind(this)
      },
      {
        label: 'Close',
        onPress: () => { console.log('Cancel'); },
        isCancel: true
      }
    ];

    showActionSheet(options);
  }

  _submit(toDashboard) {
    const { first, last, birthday, zip, city, country } = this.props.store,
      isValid = (first && last && birthday && zip && city && country) ? true : false;

    this.setState({
      valid: isValid
    });

    if (isValid) {
      this._sendRequest()
        .then((user) => {
          if (toDashboard) {
          }
          else {
            this.props.navigation.navigate("CreateEntity");
          }
        })
        .catch((err) => {
        });
    }
  }

  _sendRequest() {
    const { email, uid } = this.props.auth;
    const { image, first, last, gender, birthday, zip, city, country } = this.props.store;
    let source = {
      authSource: uid,
      avatar: image ? image : null,
      createdAt: moment().format('YYYY-MM-DD'),
      lastLoginAt: moment().format('YYYY-MM-DD'),
      profile: {
        personalData: {
          email: email,
          birthday: birthday.format('YYYY-MM-DD'),
          firstName: first,
          lastName: last,
          gender: gender,
          zip: zip,
          city: city,
          country: country
        }

      }
    };

    return this.instance.user.create(source, uid);
  }

  _renderDatePicker(value: null | Date) {
    return (
      <DatePicker
        ref="birthday"
        style={styles.datePicker}
        date={value}
        mode="date"
        format="DD. MMM YYYY"
        confirmBtnText={'Confirm'}
        cancelBtnText={'Cancel'}
        minDate={moment('1900', 'YYYY')}
        showIcon={false}
        onPressConfirm={this._birthdayChanged.bind(this)}
        onDateChange={this._birthdayChanged.bind(this)}
      />
    );
  }

  render() {
    const { image, first, last, gender, birthday, zip, city, country, bonusCard } = this.props.store;
    const optionsSex = [
      {
        label: "FEMALE",
        value: 'F',
        onPress: this._genderChanged.bind(this),
        isActive: gender === 'F',
        btnNumber: "first",
      },
      {
        label: "MALE",
        value: 'M',
        onPress: this._genderChanged.bind(this),
        isActive: gender === 'M',
        btnNumber: "second",
      },
      {
        label: "OTHER",
        value: 'other',
        onPress: this._genderChanged.bind(this),
        isActive: gender === 'other',
        btnNumber: "third",
      },
    ];
    const imageSource = image ? { uri: image.path } : null;
    const datePicker = this._renderDatePicker(birthday);

    return (
      <View style={styles.mainConteiner}>
        <ScrollView>
          <View style={styles.pageBody}>
            <AccountPhoto
              onPress={this._callPhotoModule.bind(this)}
              imgUrl={imageSource}
            />
            <TextInputFiled
              isShowAlert={!first && !this.state.valid}
              textInputLabel={"First Name"}
              textInputAlert="Check your First Name format"
              secureTextEntry={false}
              onChangeText={this._firstChanged.bind(this)}
              value={first}
              isShowCheckbox={false}
            />
            <TextInputFiled
              isShowAlert={!last && !this.state.valid}
              textInputLabel={"Last Name"}
              textInputAlert="Check your Last Name format"
              secureTextEntry={false}
              onChangeText={this._lastChanged.bind(this)}
              value={last}
              isShowCheckbox={false}
            />
            <RowChooseOneOfThird
              options={optionsSex}
            />
            <TextField
              isShowAlert={!birthday && !this.state.valid}
              textInputLabel={"Birthday"}
              textInputAlert="Check your Birthday format"
              onPressBlock={() => { this.refs.birthday.onPressDate(); }}
              value={birthday ? birthday.format('DD-MM-YYYY') : ''}
              isShowCheckbox={false}
              isShowTextInputIcon={true}
              imgUrl={require('../../../assets/img/calendar.png')}
            />
            <TextInputFiled
              isShowAlert={!zip && !this.state.valid}
              textInputLabel={"ZIP / Postal code"}
              onBlur={this._autoPopulateCity.bind(this)}
              textInputAlert="Check your ZIP / Postal code format"
              secureTextEntry={false}
              onChangeText={this._zipChanged.bind(this)}
              value={zip}
              isShowCheckbox={false}
            />
            <TextInputFiled
              isShowAlert={!city && !this.state.valid}
              textInputLabel={"City"}
              textInputAlert="Check your City code format"
              secureTextEntry={false}
              onChangeText={this._cityChanged.bind(this)}
              value={city}
              isShowCheckbox={false}
            />
            <TextInputFiled
              isShowAlert={!country && !this.state.valid}
              textInputLabel={"Country"}
              textInputAlert="Check your Country code format"
              secureTextEntry={false}
              onChangeText={this._countryChanged.bind(this)}
              value={country}
              isShowCheckbox={false}
            />
            <Button
              label={"NEXT - ADD YOUR ENTITY"}
              color={"green"}
              onPress={() => { this._submit(); }}
            />
            <Button
              label={"SKIP ADD ENTITY AND GO TO HOMEPAGE"}
              color={"transparent"}
              onPress={() => { this._submit(true); }}
            />
          </View>
        </ScrollView>
        {datePicker}
      </View>
    );
  }
}
