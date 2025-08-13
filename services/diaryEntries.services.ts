import { AXIOS_INSTANCE } from "./interceptors";

export async function getIntervalUserDiaryEntries(
  userId: number,
  startDate?: number,
  endDate?: number,
): Promise<DiaryEntry[]> {
  let getDiaryEntriesUrl = `${process.env.API_ROOT_URL}api/v1/diaryEntries/user/${userId}`;

  if (startDate && endDate) {
    getDiaryEntriesUrl += `?start_date=${startDate}&end_date=${endDate}`;
  }

  let userDiaryEntries: DiaryEntry[] = [];

  try {
    const userDiaryEntriesResponse =
      await AXIOS_INSTANCE.get(getDiaryEntriesUrl);

    userDiaryEntries = userDiaryEntriesResponse.data as DiaryEntry[];
  } catch (error) {
    throw error as Error;
  }

  return userDiaryEntries;
}

export async function addUserDiaryEntry(
  diaryEntry: AddDiaryEntryRequest,
): Promise<DiaryEntry | undefined> {
  const addDiaryEntryUrl = `${process.env.API_ROOT_URL}api/v1/diaryEntries`;
  let userDiaryEntry: DiaryEntry | undefined;

  try {
    const userDiaryEntriesResponse = await AXIOS_INSTANCE.post(
      addDiaryEntryUrl,
      diaryEntry,
    );

    userDiaryEntry = userDiaryEntriesResponse.data as DiaryEntry;
  } catch (error) {
    console.error(error);
  }

  return userDiaryEntry;
}

export async function updateUserDiaryEntry(
  diaryEntryId: number,
  diaryEntry: UpdateDiaryEntryRequest,
): Promise<DiaryEntry | undefined> {
  const addDiaryEntryUrl = `${process.env.API_ROOT_URL}api/v1/diaryEntries/${diaryEntryId}`;
  let userDiaryEntry: DiaryEntry | undefined;

  try {
    const userDiaryEntriesResponse = await AXIOS_INSTANCE.put(
      addDiaryEntryUrl,
      diaryEntry,
    );

    userDiaryEntry = userDiaryEntriesResponse.data as DiaryEntry;
  } catch (error) {
    console.error(error);
  }

  return userDiaryEntry;
}
