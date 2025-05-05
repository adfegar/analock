import { Text, TextInput, TouchableOpacity } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { useContext, useState } from "react";
import {
  areDatesEqual,
  emptyDateTime,
  timestampToDate,
} from "../utils/date.utils";
import {
  addUserDiaryEntry,
  updateUserDiaryEntry,
} from "../services/diaryEntries.services";
import { getStorageUserData } from "../services/storage.services";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

const DiaryEntryDetailScreen: React.FC = ({ route }) => {
  const {
    id,
    title,
    content,
    publishDate,
    isUpdate,
    userDiaryEntries,
    setUserDiaryEntries,
  } = route.params;
  const [titleInput, setTitleInput] = useState<string>(!isUpdate ? "" : title);
  const [contentInput, setContentInput] = useState<string>(
    !isUpdate ? "" : content,
  );
  const translationsContext = useContext(TranslationsContext);
  const navigation = useNavigation();

  return (
    translationsContext && (
      <BaseScreen>
        <View
          style={[
            GENERAL_STYLES.flexCol,
            GENERAL_STYLES.flexGap,
            GENERAL_STYLES.flexGrow,
            GENERAL_STYLES.paddingBottom,
          ]}
        >
          {publishDate && (
            <Text
              style={[
                GENERAL_STYLES.uiText,
                GENERAL_STYLES.textGray,
                GENERAL_STYLES.textBold,
              ]}
            >
              {new Date(publishDate).toLocaleDateString(undefined, {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          )}
          <TextInput
            style={[
              GENERAL_STYLES.uiText,
              GENERAL_STYLES.generalBorder,
              GENERAL_STYLES.generalPadding,
              GENERAL_STYLES.textBlack,
              GENERAL_STYLES.textTitle,
            ]}
            placeholder={translationsContext.translations.diary.title}
            placeholderTextColor={"gray"}
            defaultValue={!isUpdate ? "" : title}
            onChange={(event) => setTitleInput(event.nativeEvent.text)}
            editable={areInputsEditableAndSaveButtonShown(
              isUpdate,
              publishDate,
            )}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            autoFocus={true}
            maxLength={40}
          />
          <TextInput
            style={[
              GENERAL_STYLES.uiText,
              GENERAL_STYLES.textBlack,
              GENERAL_STYLES.generalBorder,
              GENERAL_STYLES.flexGrow,
              GENERAL_STYLES.generalPadding,
            ]}
            placeholder={translationsContext.translations.diary.content}
            placeholderTextColor={"gray"}
            defaultValue={!isUpdate ? "" : content}
            onChange={(event) => setContentInput(event.nativeEvent.text)}
            editable={areInputsEditableAndSaveButtonShown(
              isUpdate,
              publishDate,
            )}
            hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
            textAlignVertical="top"
            multiline={true}
            maxLength={300}
          />
          {areInputsEditableAndSaveButtonShown(isUpdate, publishDate) && (
            <TouchableOpacity
              onPressIn={() => {
                const currentDate = new Date();
                const userData = getStorageUserData();
                emptyDateTime(currentDate);

                if (!isUpdate) {
                  const diaryEntry: AddDiaryEntryRequest = {
                    title: titleInput,
                    content: contentInput,
                    publishDate: currentDate.valueOf(),
                    userId: userData.userId,
                  };
                  addUserDiaryEntry(diaryEntry)
                    .then((savedEntry) => {
                      if (savedEntry) {
                        const diaryEntries = [savedEntry, ...userDiaryEntries];
                        setUserDiaryEntries(diaryEntries);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  const diaryEntry: UpdateDiaryEntryRequest = {
                    title: titleInput,
                    content: contentInput,
                    publishDate: currentDate.valueOf(),
                  };
                  updateUserDiaryEntry(id, diaryEntry)
                    .then((updatedEntry) => {
                      if (updatedEntry) {
                        const diaryEntries = [...userDiaryEntries];
                        const indexToBeUpdated = diaryEntries.findIndex(
                          (diaryEntry) => diaryEntry.id === updatedEntry.id,
                        );
                        diaryEntries[indexToBeUpdated] = updatedEntry;
                        setUserDiaryEntries(diaryEntries);
                      }
                    })
                    .catch((err) => console.error(err));
                }

                navigation.goBack();
              }}
              disabled={isSaveButtonDisabled(
                isUpdate,
                titleInput,
                contentInput,
                title,
                content,
              )}
              style={[
                GENERAL_STYLES.uiButton,
                isSaveButtonDisabled(
                  isUpdate,
                  titleInput,
                  contentInput,
                  title,
                  content,
                ) && GENERAL_STYLES.buttonDisabled,
              ]}
            >
              <Text
                style={[
                  GENERAL_STYLES.uiText,
                  GENERAL_STYLES.textCenter,
                  GENERAL_STYLES.textWhite,
                ]}
              >
                {translationsContext.translations.diary.save}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BaseScreen>
    )
  );
};

function areInputsEditableAndSaveButtonShown(
  isUpdate: boolean,
  publishDate: number,
): boolean {
  return !isUpdate || areDatesEqual(new Date(), timestampToDate(publishDate));
}

/**
 * Checks whether the form's save buton should be disabled
 *
 *  @param isUpdate
 *   @param titleInput the title input's content
 *   @param contentInput the content input's content
 *   @param currentTitle the current entry's title (if updated)
 *   @param currentContent the current entry's content (if updated)
 *    @returns a boolean indicating whether the buton should be disabled
 */
function isSaveButtonDisabled(
  isUpdate: boolean,
  titleInput: string,
  contentInput: string,
  currentTitle: string,
  currentContent: string,
) {
  return (
    (!isUpdate &&
      (titleInput.trim().length === 0 || contentInput.trim().length === 0)) ||
    (isUpdate && currentTitle === titleInput && currentContent === contentInput)
  );
}

export default DiaryEntryDetailScreen;
