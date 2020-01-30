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
  content: {
    marginTop: getHeightWithScaleFactor(10)
  },
  card: {
    height: getHeightWithScaleFactor(60),
    borderTopWidth: getHeightWithScaleFactor(1),
    borderColor: COLORS.BLACK,
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  logo: {
    width: getWidthWithScaleFactor(25),
    height: getHeightWithScaleFactor(25),
    borderRadius: getHeightWithScaleFactor(15),
    marginRight: getWidthWithScaleFactor(10)
  },
  textContent: { flex: 1, alignContent: "center" },
  name: { color: COLORS.BLACK }

});
