// @flow


/* REACT */
import { StyleSheet } from "react-native";
import { COLORS } from "src/configs/styles";
import { getHeightWithScaleFactor, getWidthWithScaleFactor } from "src/utils/layout";

export default StyleSheet.create({

  container: {
    flex: 1,
    paddingTop: getHeightWithScaleFactor(20),
    paddingHorizontal: getWidthWithScaleFactor(25)
  },
  wrapper: {
    flexGrow: 1,
    flexDirection: "column",
  },
  content: {
    marginTop: getHeightWithScaleFactor(10)
  },
  card: {
    height: getHeightWithScaleFactor(75),
    borderTopWidth: getHeightWithScaleFactor(1),
    borderColor: COLORS.BLACK,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    width: getWidthWithScaleFactor(50),
    height: getHeightWithScaleFactor(50),
    borderRadius: getHeightWithScaleFactor(25),
    marginRight: getWidthWithScaleFactor(10)
  },
  contentBlockMessageCard: { flexDirection: "row", alignContent: "space-between" },
  userName: {
    flex: 1,
    color: COLORS.BLACK,
    marginBottom: getHeightWithScaleFactor(5)
  },
  lastMassage: {
    color: COLORS.BLACK,
    opacity: 0.5
  },
  wrapperContentBlock: { flex: 1 },
  createNewChatButton: {
    paddingTop: getHeightWithScaleFactor(10),
    paddingLeft: getWidthWithScaleFactor(5),
    position: "absolute",
    width: getWidthWithScaleFactor(40),
    backgroundColor: COLORS.BUTTON.BACKGROUND_COLOR,
    bottom: getHeightWithScaleFactor(20),
    right: 0,
    borderRadius: getHeightWithScaleFactor(20),
    height: getHeightWithScaleFactor(40),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: getWidthWithScaleFactor(0), height: getHeightWithScaleFactor(2) },
    shadowOpacity: 0.8,
    shadowRadius: getHeightWithScaleFactor(2),
  },
  fly: {
    width: getWidthWithScaleFactor(25),
    height: getHeightWithScaleFactor(25)
  },
  iconCreateNewChatButton: {
    width: getWidthWithScaleFactor(50),
    height: getHeightWithScaleFactor(50),
    borderRadius: getHeightWithScaleFactor(25)
  },
  swipeZone: {
    width: getWidthWithScaleFactor(100),
    backgroundColor: COLORS.RED
  },
  labelSwipeZone: {
    width: getWidthWithScaleFactor(100),
    height: getHeightWithScaleFactor(75),
    alignItems: "center",
    paddingTop: getHeightWithScaleFactor(30)
  },
  cardMessage: {
    height: getHeightWithScaleFactor(75)
  },
  lastMessage: {
    opacity: 0.6
  }
});
