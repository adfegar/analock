import { useContext, useEffect, useState } from "react";
import {
  deleteStorageGamesData,
  getSelectedBooks,
  getStorageBooks,
  getStorageUserData,
  setSelectedBooks,
  setStorageBook,
  setStorageUserData,
  updateStorageBookData,
} from "../services/storage.services";
import {
  areDateWeeksEqual,
  areDatesEqual,
  timestampToDate,
} from "../utils/date.utils";
import { SettingsContext } from "../contexts/settingsContext";
import RNFS from "react-native-fs";
import { APP_DOCUMENTS_PATH } from "../services/download.services";

// hook to handle daily and weekly content wipes
export function useWipePeriodicContent(): boolean {
  const [wiped, setWiped] = useState<boolean>(false);
  const settingsContext = useContext(SettingsContext);

  useEffect(() => {
    if (settingsContext?.settings) {
      let dailyWipe = false;
      let weeklyWipe = false;
      const userData = getStorageUserData();
      const currentDate: Date = new Date();

      if (userData.lastOpenedAppDate) {
        const lastDate: Date = timestampToDate(userData.lastOpenedAppDate);

        if (!areDatesEqual(lastDate, currentDate)) {
          dailyWipe = true;
        }

        if (!areDateWeeksEqual(currentDate, lastDate, settingsContext.settings)) {
          weeklyWipe = true;
        }

        if (dailyWipe) {
          console.log("performing daily wipe...");
          const bookData = getStorageBooks();
          if (bookData) {
            for (const savedBook of bookData) {
              updateStorageBookData({ id: savedBook.id });
            }
          }
          deleteStorageGamesData();
        }

        if (weeklyWipe) {
          console.log("performing weekly wipe...");
          delete userData.selectedBookSubject;
          const selectedBooks = getSelectedBooks();
          for (const book of selectedBooks) {
            RNFS.exists(`${APP_DOCUMENTS_PATH}/${book.identifier}`)
              .then(() => {
                RNFS.unlink(`${APP_DOCUMENTS_PATH}/${book.identifier}`)
                  .then(() => console.log(`deleted ${book.identifier} on weekly wipe`))
                  .catch((err) => console.error(`error removing EPUB on weekly wipe: ${err}`));
              });
          }
          setSelectedBooks([]);
          setStorageBook([]);
        }
      }

      userData.lastOpenedAppDate = currentDate.valueOf();
      setStorageUserData(userData);
      setWiped(dailyWipe || weeklyWipe);
    }
  }, [settingsContext]);

  return wiped;
}