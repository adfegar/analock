import { useContext, useEffect, useState } from "react";
import { getUserDiaryEntries } from "../services/diaryEntries.services";
import { SettingsContext } from "../contexts/settingsContext";

interface UseUserDiaryEntriesResult {
  userDiaryEntries: DiaryEntry[];
  setUserDiaryEntries: React.Dispatch<React.SetStateAction<DiaryEntry[]>>;
  userDiaryEntriesError: string | undefined;
}

export function useUserDiaryEntries(
  userId: number,
  authenticated: boolean,
): UseUserDiaryEntriesResult {
  const [userDiaryEntries, setUserDiaryEntries] = useState<DiaryEntry[]>([]);
  const [userDiaryEntriesError, setUserDiaryEntriesError] = useState<string>();
  const settingsContext = useContext(SettingsContext);

  useEffect(() => {
    if (
      authenticated &&
      settingsContext &&
      settingsContext.settings.general.enableOnlineFeatures
    ) {
      getUserDiaryEntries(userId)
        .then((diaryEntries) => {
          setUserDiaryEntries(
            diaryEntries.sort(
              (a, b) =>
                b.registration.registrationDate -
                a.registration.registrationDate,
            ),
          );
        })
        .catch((error) => {
          setUserDiaryEntriesError(error);
        });
    }
  }, [settingsContext, authenticated]);

  return {
    userDiaryEntries,
    setUserDiaryEntries,
    userDiaryEntriesError: userDiaryEntriesError,
  };
}
