import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { getUserRegistrations } from "../services/activityRegistrations.services";
import { SettingsContext } from "./settingsContext";
import { getStorageUserData } from "../services/storage.services";
import { UserDataContext } from "./userDataContext";

export const ActivityRegistrationsContext =
  createContext<ActivityRegistrationsContext | null>(null);

interface ActivityRegistrationsContext {
  activityRegistrationsData: ActivityRegistrationsData;
  setActivityRegistrationsData: React.Dispatch<
    React.SetStateAction<ActivityRegistrationsData>
  >;
}

interface ActivityRegistrationsProviderProps {
  children: ReactNode;
}

export const ActivityRegistrationsProvider: React.FC<
  ActivityRegistrationsProviderProps
> = ({ children }) => {
  const [activityRegistrations, setActivityRegistrations] =
    useState<ActivityRegistrationsData>({
      activityRegistrations: [],
      error: false,
    });
  const settingsContext = useContext(SettingsContext)?.settings;
  const userDataContext = useContext(UserDataContext);
  // Set context initial value from local storage
  useEffect(() => {
    if (
      settingsContext &&
      settingsContext.general.enableOnlineFeatures &&
      userDataContext &&
      userDataContext.userData.authenticated
    ) {
      const userData = getStorageUserData();
      getUserRegistrations(userData.userId)
        .then((registrations) => {
          setActivityRegistrations({
            activityRegistrations: registrations,
            error: false,
          });
        })
        .catch(() =>
          setActivityRegistrations({
            activityRegistrations: [],
            error: true,
          }),
        );
    }
  }, [settingsContext, userDataContext]);

  return (
    <ActivityRegistrationsContext.Provider
      value={{
        activityRegistrationsData: activityRegistrations,
        setActivityRegistrationsData: setActivityRegistrations,
      }}
    >
      {children}
    </ActivityRegistrationsContext.Provider>
  );
};
