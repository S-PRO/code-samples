// @flow

/* REACT */
import React, { Component } from "react";
import {
  View,
  SafeAreaView,
  SectionList,
  TouchableOpacity,
  Image,
  Alert
} from "react-native";

import DocumentPicker from "react-native-document-picker";

/* CUSTOM MODULES */
import { getMessagesList } from "src/utils/requests/chat/chat";
import {
  HeaderTitle,
  KeyboardWrapper,
  BaseText,
  BaseInput,
} from "src/components";

import logger from "src/utils/logger";

import * as IMAGE_CONSTANTS from "src/assets/img";

import styles from "./styles";

import type
{
  _t_messagesList,
  _t_navigation,
  _t_creator
} from "src/types";

type sectionsList = {|
  title: string,
  data: _t_messagesList[],
|}

type _t_defaultProps = {|
  navigation: _t_navigation
|};

type _t_props = {|
  ..._t_defaultProps
|};

type _t_state = {|
  array: sectionsList[],
  newMessage: string,
  refreshing: boolean
|};

export default class extends Component<_t_props, _t_state> {

  filteredMessagesList: _t_messagesList[] | [];

  state = {
    array: [],
    newMessage: "",
    refreshing: false
  }

  static navigationOptions = () => ({
    headerTitle: <HeaderTitle textKey="main_page:main_page" />
  });

  componentDidMount() {
    getMessagesList().then(
      (data) => {
        const arrayMessages = {};
        data.forEach((message) => {
          if (arrayMessages[message.createDate]) {
            arrayMessages[message.createDate].push(message);
          } else {
            arrayMessages[message.createDate] = [message];
          }
        });

        this.setState(() => ({
          array: Object.keys(arrayMessages)
            .sort((a, b) => (new Date(b) - new Date(a)))
            .map((createDate) => ({ title: createDate, data: arrayMessages[createDate] || [] }))
        }));

      }
    );
  }

  handleRefresh = () => {
    this.setState(() => ({ refreshing: true }));
    setTimeout(() => {
      this.setState(() => ({ refreshing: false }));
    }, 2000);
    // TODO(anybody): network or db request
    logger.warn("get refresh");
  }

  handleLoadMore = () => {
    // TODO(anybody): network or db request
    logger.warn("get more");
  }

  /**
   * Function return icon for user
   */
  renderUserAvatar = (creator: _t_creator) => (
    <Image
      style={styles.creatorMessageAvatar}
      source={{ uri: creator.avatar ? creator.avatar : IMAGE_CONSTANTS.DEFAULT_AVATAR }}
    />
  );

  /**
   * Function return message row
   * @param {_t_messagesList} messageObject
   */
  messageRender = (messageObject: _t_messagesList) => (
    <View
      style={[
        styles.containerMessageBlock,
        { justifyContent: messageObject.isCreator ? "flex-end" : "flex-start" }
      ]}
    >
      { messageObject.isCreator ? null : this.renderUserAvatar(messageObject.sender) }
      <View style={[
        styles.messageBox,
        messageObject.isCreator ? styles.isCreatorsMessage : styles.isntCreatorsMessage
      ]}
      >
        <BaseText
          style={styles.messageStyle}
          numberOfLines={0}
        >
          {messageObject.message}
        </BaseText>
      </View>
      { messageObject.isCreator ? this.renderUserAvatar(messageObject.receiver) : null }
    </View>
  );

  sendMessage = () => { logger.warn("send new message"); }

  /**
   * Function render element input with 2 icons - send and add attachment
  */
  renderInputElement = () => (
    <View style={styles.inputWrapper}>
      <View style={styles.attachment}>
        <TouchableOpacity onPress={() => { this.addAttachment(); }} >
          <Image
            style={styles.sendIcon}
            source={IMAGE_CONSTANTS.ATTACHMENT}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.input}>
        <BaseInput
          style={styles.flexStyle}
          value={this.state.newMessage}
          placeholder="chat_page:input"
          onChangeText={(value) => {
            this.setState(() => ({ newMessage: value }));
          }}
        />
      </View>
      <View style={styles.send}>
        <TouchableOpacity onPress={() => { this.sendMessage(); }} >
          <Image
            style={styles.sendIcon}
            source={IMAGE_CONSTANTS.FLY}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  addAttachment = () => {

    Alert.alert(
      "What file do u want to add?",
      "",
      [
        { text: "Document", onPress: () => this.addDocument() },
        { text: "Photo", onPress: () => logger.log("OK Pressed") },
        {
          text: "Cancel",
          onPress: () => logger.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false },
    );


  };

  addDocument = () => {
    try {
      const res = DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.plainText],
      });
      logger.log(
        res.uri,
        res.type,
        res.name,
        res.size
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        logger.warn("User cancel add");
      } else {
        logger.warn(err.title);
      }
    }
  }


  // ==================
  // ===== RENDER =====
  // ==================

  render() {

    const { array, refreshing } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <KeyboardWrapper style={styles.container}>
          <SectionList
            sections={array}
            extraData={array}
            keyExtractor={(item, index) => `${index}`}
            renderItem={
              ({ item }) => this.messageRender(item)
            }
            renderSectionFooter={
              ({ section: { title } }) => (
                <BaseText style={styles.separator}>{title}</BaseText>
              )
            }
            inverted
            refreshing={refreshing}
            progressViewOffset={100}
            onRefresh={this.handleRefresh}
            onEndReachedThreshold={1}
            onEndReached={this.handleLoadMore}
            showsVerticalScrollIndicator={false}
          />

          { this.renderInputElement() }

        </KeyboardWrapper>
      </SafeAreaView>
    );
  }
}
