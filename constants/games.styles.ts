import { StyleSheet } from "react-native";
import { colorBlack, colorBlue, colorGray, colorGreen, colorWhite, colorWhiteBackground } from "./constants";

export const GAME_STYLES = StyleSheet.create({
  sudukuContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  sudokuGrid: {
    borderWidth: 2,
    borderColor: colorBlack,
  },
  sudokuRow: {
    flexDirection: "row",
  },
  sudokuSelectedCell: {
    backgroundColor: colorBlue,
  },
  sudokuNormalCell: {
    backgroundColor: colorWhiteBackground,
  },
  sudokuValidCell: {
    color: colorBlack,
    fontWeight: "bold",
  },
  sudokuNotValidCell: {
    color: "red",
  },
  sudokuBottomBorder: {
    borderBottomWidth: 2,
  },
  sudokuRightBorder: {
    borderRightWidth: 2,
  },
  sudoukuCellText: {
    fontSize: 20,
  },
  sudokuNumberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
    width: 180,
  },
  sudokuNumberButton: {
    width: 50,
    height: 50,
    margin: 5,
    backgroundColor: colorBlack,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sudokuNumberButtonText: {
    color: colorWhite,
    fontSize: 24,
  },
  ttfeContainer: {
    flex: 1,
    gap: 30
  },
  ttfeScoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 20,
    backgroundColor: colorBlack,
  },
  ttfeScoreLabel: {
    color: colorWhite,
    fontSize: 18,
  },
  ttfeScoreValue: {
    color: colorWhite,
    fontSize: 18,
    fontWeight: "bold",
  },
  ttfeRow: {
    flexDirection: "row",
  },
  ttfeCellText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  ttfeGameOver: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colorWhiteBackground,
    opacity: 0.9
  },
  ttfeGameOverText: {
    fontSize: 40,
    fontWeight: "bold",
    color: colorBlack,
    marginBottom: 16,
  },
  ttfeResetButtonText: {
    color: colorWhite,
    fontSize: 18,
    fontWeight: "bold",
  },
});
