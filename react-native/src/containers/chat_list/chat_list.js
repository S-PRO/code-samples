// @flow


/* REACT */
import React, { PureComponent } from "react";
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  Text
} from "react-native";

import { SwipeableFlatList } from "react-native-swipeable-flat-list";

/* CUSTOM MODULES */
import {
  BaseInput,
  BaseText,
  HeaderTitle,
  KeyboardWrapper,
} from "src/components";

import { getChatList } from "src/utils/requests/chat/chat";
import logger from "src/utils/logger";
import * as IMAGE_CONSTANTS from "src/assets/img";

/* STYLES */
import styles from "./styles";

/* TYPES */
import type { Node } from "react";
import type { _t_navigation, _t_messageInList } from "src/types";

type _t_defaultProps = {|
  navigation: _t_navigation
|};

type _t_props = {|
  ..._t_defaultProps
|};

type _t_state = {|
    value: string,
    array: _t_messageInList[],
    refreshing: boolean
|};

export default class extends PureComponent<_t_props, _t_state> {

  arrayMessages: _t_messageInList[] = [];

  static defaultProps: _t_defaultProps;

  static navigationOptions = () => ({
    headerLeft: null,
    headerTitle: <HeaderTitle textKey="chat_list:title" />,
    headerRight: null
  });

  state = {
    value: "",
    array: [],
    refreshing: false
  };

  componentDidMount() {
    getChatList().then(
      (data) => {
        this.arrayMessages = data;
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

  /**
   * Filtering
   */
  filteredFunction = (value: string) => {
    if (!value.length) {
      this.setState(() => ({ array: this.arrayMessages }));
    } else {
      this.setState(() => ({ array: this.arrayMessages.filter((x) => x.human.name.includes(value)), value }));
    }
  }

  loadMore = () => {
    logger.log("action load more");
  }

  renderChatItem = (chatObject: _t_messageInList) => (
    <TouchableOpacity
      style={styles.cardMessage}
      onPress={() => { this.goToPage("Chat"); }}
    >
      <View style={styles.card}>
        <Image
          style={styles.icon}
          source={{ uri: chatObject.human.avatar }}
        />
        <View
          style={styles.wrapperContentBlock}
        >
          <View style={styles.contentBlockMessageCard}>
            <BaseText style={styles.userName}>
              {chatObject.human.name}
            </BaseText>
            <BaseText>
              {chatObject.lastDate}
            </BaseText>
          </View>
          <BaseText style={styles.lastMessage}>
            {chatObject.lastMessage}
          </BaseText>
        </View>
      </View>
    </TouchableOpacity>
  )

  renderRightSwipeItem = () => (
    <TouchableOpacity
      onPress={() => this.deleteChat()}
      style={styles.swipeZone}
    >
      <View
        style={styles.labelSwipeZone}
      >
        <Text>Delete</Text>
      </View>
    </TouchableOpacity>
  );

  deleteChat = () => {
    logger.warn("delete chat");
  }

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    setTimeout(() => {
      this.setState(() => ({ refreshing: false }));
    }, 2000);
  }

  // ==================
  // ===== RENDER =====
  // ==================


  render(): Node {

    const { value, array, refreshing } = this.state;
    return (
      <SafeAreaView style={styles.container}>

        <BaseInput
          value={value}
          placeholder="chat_list:search_placeholder"
          onChangeText={this.filteredFunction}
        />

        <KeyboardWrapper style={styles.content} >
          <SwipeableFlatList
            data={array}
            refreshing={refreshing}
            onRefresh={this.handleRefresh}
            onEndReachedThreshold={100}
            onEndReached={this.loadMore}
            renderItem={this.renderChatItem}
            renderRight={this.renderRightSwipeItem}
            swipeOpenThresholdPercentage={0}
            swipeThreshold={100}
            onOpen={() => { logger.log("on open"); }}
            onClose={() => { logger.log("on close"); }}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.createNewChatButton}>
            <TouchableOpacity
              onPress={() => this.goToPage("AbonentList")}
            >
              <Image
                style={styles.fly}
                source={IMAGE_CONSTANTS.FLY}
              />
            </TouchableOpacity>
          </View>
        </KeyboardWrapper>
      </SafeAreaView>
    );
  }
}
