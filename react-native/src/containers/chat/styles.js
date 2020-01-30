// @flow


/* REACT */
import { StyleSheet } from "react-native";
import { COLORS } from "src/configs/styles";
import { getHeightWithScaleFactor, getWidthWithScaleFactor, getFontWithScaleFactor } from "src/utils/layout";

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column"
  },
  inputWrapper: {
    height: 85,
    flexDirection: "row",
    bottom: 0,
    paddingHorizontal: getWidthWithScaleFactor(25),
    paddingVertical: getHeightWithScaleFactor(15),
    borderTopColor: COLORS.BUTTON.BACKGROUND_COLOR,
    borderTopWidth: getWidthWithScaleFactor(1),
  },
  attachment: {
    width: getWidthWithScaleFactor(40),
    height: getHeightWithScaleFactor(40),
    padding: getHeightWithScaleFactor(10)
  },
  input: {
    flex: 1,
    marginHorizontal: getWidthWithScaleFactor(10),
  },
  flexStyle: {
    width: getWidthWithScaleFactor(100),
    borderRadius: getHeightWithScaleFactor(25)
  },
  send: {
    width: getWidthWithScaleFactor(40),
    height: getHeightWithScaleFactor(40),
    padding: getHeightWithScaleFactor(10)
  },
  sendIcon: {
    width: getWidthWithScaleFactor(20),
    height: getHeightWithScaleFactor(20)
  },

  creatorMessageAvatar: {
    width: getWidthWithScaleFactor(30),
    height: getHeightWithScaleFactor(30),
    borderRadius: getHeightWithScaleFactor(15),
    marginHorizontal: getWidthWithScaleFactor(5)
  },
  messageBox: {
    width: getWidthWithScaleFactor(150),
    backgroundColor: COLORS.BUTTON.BACKGROUND_COLOR,
    borderRadius: getWidthWithScaleFactor(20),
    marginBottom: getHeightWithScaleFactor(5)
  },

  isCreatorsMessage: {
    borderTopRightRadius: 0,
  },
  isntCreatorsMessage: {
    borderTopLeftRadius: 0,
  },

  messageStyle: {
    width: getWidthWithScaleFactor(100),
    padding: getHeightWithScaleFactor(10),
    fontSize: getFontWithScaleFactor(14),
    lineHeight: getFontWithScaleFactor(20),
    color: COLORS.WHITE,
  },
  containerMessageBlock: {
    flex: 1,
    flexDirection: "row",
  },
  separator: {
    textAlign: "center",
    margin: getHeightWithScaleFactor(20)
  }
});
