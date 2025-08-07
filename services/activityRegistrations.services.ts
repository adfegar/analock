import { AXIOS_INSTANCE } from "./interceptors";

export type ActivityRegistration =
  | BookRegistration
  | GameRegistration
  | DiaryEntry;

/**
 * Gets user book registrations in a date interval.
 *
 * @param userId the user identifier
 * @param the start date of the interval
 * @returns the user registrations
 */
async function getUserBookRegistrations(
  userId: number,
  startDate?: number,
  endDate?: number,
): Promise<BookRegistration[]> {
  let requestUrl = `${process.env.API_ROOT_URL}api/v1/activityRegistrations/books/user/${userId}`;

  if (startDate && endDate) {
    requestUrl += `?start_date=${startDate}&end_date=${endDate}`;
  }

  let registrations: BookRegistration[] = [];
  try {
    const response = await AXIOS_INSTANCE.get(requestUrl);

    registrations = response.data as BookRegistration[];
  } catch (err) {
    throw err as Error;
  }

  return registrations;
}

/**
 * Gets user game registrations in a date interval.
 *
 * @param userId the user identifier
 * @param the start date of the interval
 * @returns the user registrations
 */
async function getUserGameRegistrations(
  userId: number,
  startDate?: number,
  endDate?: number,
): Promise<GameRegistration[]> {
  let requestUrl = `${process.env.API_ROOT_URL}api/v1/activityRegistrations/games/user/${userId}`;

  if (startDate && endDate) {
    requestUrl += `?start_date=${startDate}&end_date=${endDate}`;
  }

  let registrations: GameRegistration[] = [];
  try {
    const response = await AXIOS_INSTANCE.get(requestUrl);

    registrations = response.data as GameRegistration[];
  } catch (err) {
    throw err as Error;
  }

  return registrations;
}

/**
 * Gets all user registrations in a date interval.
 *
 * @param userId the user identifier
 * @param the start date of the interval
 * @returns the user registrations
 */
export async function getUserRegistrations(
  userId: number,
  startDate?: number,
  endDate?: number,
): Promise<ActivityRegistration[]> {
  const registrations: ActivityRegistration[] = [];
  try {
    const bookRegistrationsRequest = getUserBookRegistrations(
      userId,
      startDate,
      endDate,
    );

    const gameRegistrationsRequest = getUserGameRegistrations(
      userId,
      startDate,
      endDate,
    );

    const [bookRegistrations, gameRegistrations] = await Promise.all([
      bookRegistrationsRequest,
      gameRegistrationsRequest,
    ]);

    registrations.push(...bookRegistrations, ...gameRegistrations);
  } catch {
    throw new Error();
  }

  return registrations;
}

export async function addUserBookRegistration(
  request: AddBookRegistrationRequest,
): Promise<BookRegistration | undefined> {
  const requestUrl = `${process.env.API_ROOT_URL}api/v1/activityRegistrations/books`;

  try {
    const response = await AXIOS_INSTANCE.post(requestUrl, request);

    if (response.status === 200) {
      return response.data as BookRegistration;
    }

    console.error(
      `error response took place saving book registration: ${response.data}`,
    );
  } catch (err) {
    console.log(err);
  }

  return undefined;
}

export async function addUserGameRegistration(
  request: AddGameRegistrationRequest,
): Promise<GameRegistration | undefined> {
  const requestUrl = `${process.env.API_ROOT_URL}api/v1/activityRegistrations/games`;

  try {
    const response = await AXIOS_INSTANCE.post(requestUrl, request);

    if (response.status === 200) {
      return response.data as GameRegistration;
    }
    console.error(
      `error response took place saving game registration: ${response.data}`,
    );
  } catch (err) {
    console.log(err);
  }

  return undefined;
}
