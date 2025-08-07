import { useContext, useEffect, useState } from "react";
import {
  ActivityRegistration,
  getUserRegistrations,
} from "../services/activityRegistrations.services";
import { SettingsContext } from "../contexts/settingsContext";

interface GetUserActivityRegistrationsResponse {
  userRegistrations: ActivityRegistration[];
  setUserRegistrations: React.Dispatch<
    React.SetStateAction<ActivityRegistration[]>
  >;
  userRegistrationsError: boolean;
}

/**
 * Hook to get user activity registrations.
 *
 * @param userId the user's identifier
 * @param authenticated boolean indicating whether the user is authenticated
 * @param startDate the start date to search
 * @param endDate the end date to search
 * @returns the registrations and error state
 */
export function useGetUserActivityRegistrations(
  userId: number,
  authenticated: boolean,
  startDate?: number,
  endDate?: number,
): GetUserActivityRegistrationsResponse {
  const [userRegistrations, setUserRegistrations] = useState<
    ActivityRegistration[]
  >([]);
  const [userRegistrationsError, setUserRegistrationsError] =
    useState<boolean>(false);
  const settings = useContext(SettingsContext)?.settings;

  useEffect(() => {
    if (authenticated && settings && settings.general.enableOnlineFeatures) {
      getUserRegistrations(userId, startDate, endDate)
        .then((registrations) => {
          setUserRegistrations(registrations);
        })
        .catch(() => setUserRegistrationsError(true));
    }
  }, []);

  return { userRegistrations, setUserRegistrations, userRegistrationsError };
}
