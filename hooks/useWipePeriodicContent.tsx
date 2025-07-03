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
  const userSettings = useContext(SettingsContext)?.settings;

  useEffect(() => {
    if (userSettings) {
      let dailyWipe = false;
      let weeklyWipe = false;
      const userData = getStorageUserData();
      const currentDate: Date = new Date();

      // if user opened app on a different day than previous, reset daily progress.
      if (userData.lastOpenedAppDate) {
        const lastDate: Date = timestampToDate(userData.lastOpenedAppDate);

        // execute daily wipe
        if (!areDatesEqual(lastDate, currentDate)) {
          // wipe daily content
          dailyWipe = true;
        }

        // if user opened app on a diferent week than previous time, reset weekly progress.
        if (!areDateWeeksEqual(currentDate, lastDate, userSettings)) {
          weeklyWipe = true;
        }
        console.log(`last used app date: ${lastDate}, 
                        current date: ${currentDate}`);
        if (dailyWipe) {
          console.log("performing daily wipe...");
          // delete StorageBook data property for each stored book
          const bookData = getStorageBooks()
          if (bookData) {
            for (const savedBook of bookData) {
              updateStorageBookData({ id: savedBook.id })
            }
          }
          // delete game data
          deleteStorageGamesData();
        }

        if (weeklyWipe) {
          console.log("performing weekly wipe...");
          // delete selected subject
          delete userData.selectedBookSubject
          // delete EPUB files
          const selectedBooks = getSelectedBooks()
          for (const book of selectedBooks) {
            RNFS.exists(`${APP_DOCUMENTS_PATH}/${book.identifier}`)
              .then(() => {
                RNFS.unlink(`${APP_DOCUMENTS_PATH}/${book.identifier}`)
                  .then(() => console.log(`deleted ${book.identifier} on weekly wipe`))
                  .catch((err) => console.error(`error removing EPUB on weekly wipe: ${err}`))
              })
          }
          // delete selected books and selected books data from storage
          setSelectedBooks([])
          setStorageBook([])
        }
      }

      // set last oppened date
      userData.lastOpenedAppDate = currentDate.valueOf();
      setStorageUserData(userData);

      setWiped(dailyWipe || weeklyWipe);
    }
  }, [userSettings]);
  return wiped;
}
