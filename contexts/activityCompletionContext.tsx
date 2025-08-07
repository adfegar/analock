import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getStorageBooks,
  getStorageGamesData,
  getStorageUserData,
} from "../services/storage.services";
import { SettingsContext } from "./settingsContext";
import { getIntervalUserDiaryEntries } from "../services/diaryEntries.services";
import { GamesData } from "../types/game";
import { UserDataContext } from "./userDataContext";

export const ActivityCompletionContext =
  createContext<ActivityCompletionContext | null>(null);

export type ActivityData = StorageBook[] | GamesData[] | DiaryEntriesData;

interface ActivityCompletionContext {
  activityCompletionMap: Map<ActivityKind, ActivityData>;
  setActivityCompletionMap: React.Dispatch<
    React.SetStateAction<Map<ActivityKind, ActivityData>>
  >;
}

interface AuthInfoProviderProps {
  children: ReactNode;
}

export enum ActivityKind {
  Book,
  Diary,
  Game,
}

export const ActivityCompletionProvider: React.FC<AuthInfoProviderProps> = ({
  children,
}) => {
  const [activityCompletionMap, setActivityCompletionMap] = useState(
    new Map<ActivityKind, ActivityData>(),
  );
  const userSettingsContext = useContext(SettingsContext);
  const userDataContext = useContext(UserDataContext);
  // Set context initial value from local storage
  useEffect(() => {
    const bookData = getStorageBooks();
    const gameData = getStorageGamesData();
    const updatedActivityCompletionMap = new Map(activityCompletionMap);

    if (bookData.length > 0) {
      updatedActivityCompletionMap.set(ActivityKind.Book, bookData);
    }
    if (gameData) {
      updatedActivityCompletionMap.set(ActivityKind.Game, gameData);
    }

    // only get diary entries when online features are active
    if (
      userSettingsContext &&
      userSettingsContext.settings.general.enableOnlineFeatures &&
      userDataContext &&
      userDataContext.userData.authenticated
    ) {
      const userData = getStorageUserData();
      getIntervalUserDiaryEntries(userData.userId)
        .then((diaryEntries) => {
          diaryEntries.sort(
            (a, b) =>
              b.registration.registrationDate - a.registration.registrationDate,
          );
          updatedActivityCompletionMap.set(ActivityKind.Diary, {
            diaryEntries,
          });
          setActivityCompletionMap(updatedActivityCompletionMap);
        })
        .catch((error) => {
          console.error(
            `Error happened when getting user diary entries: ${error}`,
          );
          updatedActivityCompletionMap.set(ActivityKind.Diary, {
            diaryEntries: [],
            error,
          });
        });
    } else {
      setActivityCompletionMap(updatedActivityCompletionMap);
    }
  }, [userSettingsContext, userDataContext]);

  return (
    <ActivityCompletionContext.Provider
      value={{
        activityCompletionMap,
        setActivityCompletionMap,
      }}
    >
      {children}
    </ActivityCompletionContext.Provider>
  );
};
