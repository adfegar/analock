import { useEffect, useState } from "react";
import { HOME_STYLES } from "../constants/home.styles";
import { StyleSheet, Text, View } from "react-native";
import { Circle, Svg } from "react-native-svg";
import {
  getStorageBooks,
  getStorageGamesData,
} from "../services/storage.services";
import { GENERAL_STYLES } from "../constants/general.styles";
import { ProgressIcon } from "./icons/ProgressIcon";

interface StatusBarProperties {
  isHomeFocused: boolean;
  wiped: boolean;
}

export const StatusBar: React.FC<StatusBarProperties> = ({ isHomeFocused, wiped }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [booksCompleted, setBooksCompleted] = useState<boolean>(false)
  const [gamesCompleted, setGamesCompleted] = useState<boolean>(false)
  const [diaryCompleted, setDiaryCompleted] = useState<boolean>(false)

  // hook to update clock
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // hook to calculate activity progress
  useEffect(() => {
    if (isHomeFocused || wiped) {
      const bookData = getStorageBooks();
      const gameData = getStorageGamesData();
      if (bookData.length > 0) {
        setBooksCompleted(bookData.every(storageBook => storageBook.data && storageBook.data.finished))
      }
      if (gameData) {
        setGamesCompleted(gameData.every(storageGame => storageGame.won))
      }
    }
  }, [isHomeFocused, wiped]);

  const formattedTime = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`;
  return (
    <View style={[HOME_STYLES.statusBar, GENERAL_STYLES.grayBackgroundColor]}>
      <Text style={[GENERAL_STYLES.uiText, HOME_STYLES.statusBarTimeText, GENERAL_STYLES.textWhite]}>
        {formattedTime}
      </Text>
      <View style={HOME_STYLES.statusBarprogressContainer}>
        <ProgressIcon
          booksCompleted={booksCompleted}
          gamesCompleted={gamesCompleted}
          diaryCompleted={diaryCompleted} />
      </View>
    </View>
  );
};