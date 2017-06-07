// @flow

import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import UserConfigBlock from './components/userConfigBlock';
import AccountInfoItem from './components/accountInfoItem';
import HeaderContentBlock from './components/headerContentBlock';
import type { _t_sdk_instance } from './common/flow.types';
import type { _t_parsed_user } from './common/user.parse';
import type { _t_state, _t_props } from './flow.types';
import { parseUser } from './common/user.parse';
import styles from './styles';

@inject((allStores) => ({
  auth: allStores.auth
}))
@observer
export default class UserProfile extends Component {
  state: _t_state;
  instance: _t_sdk_instance;
  constructor(props: _t_props) {
    super(props);
    this.state = {
      user: {}
    };

    this.instance = props.screenProps.sdk;
  }

  componentWillMount() {
    this.instance.user.getUser(`user-${this.props.auth.uid}`, (user) => {
      this.setState({ user });
    });
  }

  render() {
    const data: _t_parsed_user = parseUser(this.state.user);

    const accountInfoList = [
      {
        label: "City",
        title: data.city
      },
      {
        label: "Birhtday",
        title: data.birthday
      },
      {
        label: "Gender",
        title: data.gender
      },
      {
        label: "ZIP",
        title: data.zip
      },
      {
        label: "Type",
        title: "Owner",
      },
      {
        label: "Email",
        title: data.email
      },
    ];

    return (
      <View style={styles.mainPageContainer}>
        <ScrollView>
          <View style={styles.pageContent}>
            <UserConfigBlock
              isShowLeftBtn={false}
              isShowRightBtn={false}
              accountPhotoUrl={data.avatar}
            />
            <View style={styles.accountInfoList}>
              {
                accountInfoList.map((item, index) =>
                  <AccountInfoItem
                    key={index}
                    title={item.title}
                    label={item.label}
                  />
                )
              }
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
