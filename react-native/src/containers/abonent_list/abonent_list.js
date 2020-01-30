// @flow


/* REACT */
import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  FlatList,
  Image
} from "react-native";

/* CUSTOM MODULES */
import {
  BaseInput,
  BaseText,
  HeaderTitle,
} from "src/components";

import { COLORS } from "src/configs/styles";

import { getContacts } from "src/utils/requests/chat/chat";

/* STYLES */
import styles from "./styles";

/* TYPES */
import type { Node } from "react";
import type { _t_navigation, _t_abonent } from "src/types";

type _t_defaultProps = {|
  navigation: _t_navigation
|};

type _t_props = {|
  ..._t_defaultProps
|};

type _t_state = {|
  value: string,
  array: _t_abonent[]
|};

export default class extends PureComponent<_t_props, _t_state> {

  filteredArray = []

  static navigationOptions = () => ({
    headerTitle: <HeaderTitle textKey="main_page:main_page" />
  });

  state = {
    value: "",
    array: []
  };

  componentDidMount() {
    getContacts().then(
      (data) => {
        this.filteredArray = data;
        this.setState(() => ({ array: data }));
      }
    );
  }

  /**
   * Go to page
   *
   * @route {string} routeName - route to navigate to
   */
  goToPage = (routeName: string) => {
    const { navigation } = this.props;
    if (navigation) {
      navigation.navigate({ routeName });
    }
  };

  filteredFunction = (value: string) => {
    this.setState(() => ({ array: this.filteredArray.filter((x) => x.name.includes(value)), value }));
  }

  renderCardAbonent = ({ item }: { item: _t_abonent}) => (
    <TouchableOpacity
      onPress={() => { this.goToPage("Chat"); }}
    >
      <View
        style={styles.card}
      >
        <Image
          style={styles.logo}
          source={{ uri: item.avatar }}
        />
        <View style={styles.textContent}>
          <BaseText style={styles.name}>
            {item.name}
          </BaseText>
          <BaseText style={{ color: item.online ? COLORS.BLUE : COLORS.RED, opacity: 0.5 }}>
            {item.online ? "online" : "offline"}
          </BaseText>
        </View>
      </View>
    </TouchableOpacity>
  )

  render(): Node {
    return (
      <SafeAreaView style={styles.container}>
        <BaseInput
          value={this.state.value}
          placeholder="chat_list:search_placeholder"
          onChangeText={(value) => {
            this.filteredFunction(value);
          }}
        />

        <FlatList
          data={this.state.array}
          extraData={this.state.array}
          bounces={false}
          keyExtractor={(o) => `${o.id}`}
          contentContainerStyle={styles.wrapper}
          renderItem={this.renderCardAbonent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }


}
