import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSettings, getStorageBooks, getStorageGamesData, getStorageUserData, StorageData } from "../services/storage.services";
import { SettingsContext } from "./settingsContext";
import { getIntervalUserDiaryEntries } from "../services/diaryEntries.services";
import { useUserDiaryEntries } from "../hooks/useUserDiaryEntries";

export const ActivityCompletionContext = createContext<ActivityCompletionContext | null>(null);

interface ActivityCompletionContext {
    activityCompletionMap: Map<ActivityKind, StorageData[]>;
    setActivityCompletionMap: React.Dispatch<React.SetStateAction<Map<ActivityKind, StorageData[]>>>;
}

interface AuthInfoProviderProps {
    children: ReactNode;
}

export enum ActivityKind {
    Book,
    Diary,
    Game
}

export const ActivityCompletionProvider: React.FC<AuthInfoProviderProps> = ({
    children,
}) => {
    const [activityCompletionMap, setActivityCompletionMap] = useState(new Map<ActivityKind, StorageData[]>())
    // Set context initial value from local storage
    useEffect(() => {
        const userSettings = getSettings()
        const bookData = getStorageBooks();
        const gameData = getStorageGamesData();
        const updatedActivityCompletionMap = new Map(activityCompletionMap)

        if (bookData.length > 0) {
            updatedActivityCompletionMap.set(ActivityKind.Book, bookData)
        }
        if (gameData) {
            updatedActivityCompletionMap.set(ActivityKind.Game, gameData)
        }

        if (!userSettings.general.enableOnlineFeatures) {
            setActivityCompletionMap(updatedActivityCompletionMap)
        } else {
            const userData = getStorageUserData()
            getIntervalUserDiaryEntries(userData.userId)
                .then(diaryEntries => {
                    updatedActivityCompletionMap.set(ActivityKind.Diary, diaryEntries)
                    setActivityCompletionMap(updatedActivityCompletionMap)
                })
                .catch(error => console.error(`Error happened when getting user diary entries: ${error}`))
        }
    }, [])

    return (
        <ActivityCompletionContext.Provider
            value={{
                activityCompletionMap,
                setActivityCompletionMap
            }}
        >
            {children}
        </ActivityCompletionContext.Provider>
    );
};
