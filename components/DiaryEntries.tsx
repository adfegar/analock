import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext, useEffect, useState } from "react";
import DiaryEntryDetailScreen from "./DiaryEntry";
import { useUserDiaryEntries } from "../hooks/useUserDiaryEntries";
import { BaseScreen } from "./BaseScreen";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { areDatesEqual } from "../utils/date.utils";
import { getSettings, getStorageUserData } from "../services/storage.services";
import { timestampToDate } from "../utils/date.utils";
import { GENERAL_STYLES } from "../constants/general.styles";
import { TranslationsContext } from "../contexts/translationsContext";
import { OnlineFeaturesDisclaimer } from "./OnlineFeaturesDisclaimer";
import { useNavigation } from "@react-navigation/native";
import { LoadingIndicator } from "./LoadingIndicator";
import { SafeAreaView } from "react-native-safe-area-context";
import { AddIcon } from "./icons/AddIcon";
import { ErrorScreen } from "./ErrorScreen";
import { NavigationHeader } from "./NavigationHeader";

const DiaryScreen = () => {
  const translations = useContext(TranslationsContext)?.translations;
  const DiaryEntriesStack = createNativeStackNavigator();
  return (
    <DiaryEntriesStack.Navigator
      initialRouteName="DiaryEntries"
    >
      <DiaryEntriesStack.Screen
        name="DiaryEntries"
        component={DiaryEntriesWrapper}
        options={{
          headerTitle: translations!.home.diary,
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={true} />
        }}
      />
      <DiaryEntriesStack.Screen
        name="DiaryEntry"
        component={DiaryEntryDetailScreen}
        options={({ route }) => ({
          headerTitle: (route.params?.isUpdate as boolean)
            ? translations?.diary.updateDiaryEntryHeader
            : translations?.diary.addDiaryEntryHeader,
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={false} />
        })}
      />
    </DiaryEntriesStack.Navigator>
  );
};

const DiaryEntriesWrapper: React.FC = () => {
  const userSettings = getSettings();

  return userSettings && userSettings.general.enableOnlineFeatures ? (
    <DiaryEntries />
  ) : (
    <OnlineFeaturesDisclaimer />
  );
};

const DiaryEntries: React.FC = () => {
  const userData = getStorageUserData();
  const { userDiaryEntries, setUserDiaryEntries, error } = useUserDiaryEntries(
    userData.userId,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();
  const translationsContext = useContext(TranslationsContext);

  // Hook to set the loading state when user's diary' entries are loaded
  useEffect(() => {
    if (userDiaryEntries.length > 0) {
      setLoading(false);
    }
  }, [userDiaryEntries]);

  return !error ? (
    <View style={[GENERAL_STYLES.generalHorizontalPadding, GENERAL_STYLES.whiteBackgroundColor]}>
      <TouchableOpacity
        disabled={isAddDiaryEntryButtonDisabled(userDiaryEntries!, loading)}
        onPressIn={() => {
          navigation.push("DiaryEntry", {
            isUpdate: false,
            userDiaryEntries,
            setUserDiaryEntries,
          });
        }}
        style={[
          GENERAL_STYLES.uiButton,
          GENERAL_STYLES.floatingRightButton,
          isAddDiaryEntryButtonDisabled(userDiaryEntries!, loading) &&
          GENERAL_STYLES.buttonDisabled,
        ]}
      >
        <AddIcon />
      </TouchableOpacity>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <SafeAreaView>
          {userDiaryEntries && (
            <FlatList
              numColumns={2}
              data={userDiaryEntries}
              keyExtractor={(entry) => entry.id.toString()}
              removeClippedSubviews={false}
              contentContainerStyle={[GENERAL_STYLES.flexGap, GENERAL_STYLES.generalVerticalPadding]}
              renderItem={({ item, index }) => {
                const diaryEntry = item;
                return (
                  <TouchableOpacity
                    key={diaryEntry.id}
                    style={[
                      GENERAL_STYLES.flexCol,
                      GENERAL_STYLES.flexGapSmall,
                      GENERAL_STYLES.flexGrow,
                      GENERAL_STYLES.generalBorder,
                      GENERAL_STYLES.mediumBorderWidth,
                      {
                        paddingHorizontal: 20,
                        paddingBottom: 10,
                        paddingTop: 5,
                        marginRight:
                          index !== userDiaryEntries.length - 1 &&
                            index % 2 === 0
                            ? 10
                            : 0,
                        marginLeft:
                          userDiaryEntries.length % 2 !== 0 &&
                            index !== userDiaryEntries.length - 1 &&
                            index % 2 !== 0
                            ? 10
                            : 0,
                      },
                    ]}
                    delayPressIn={500}
                    onPressIn={() => {
                      navigation.push("DiaryEntry", {
                        id: diaryEntry.id,
                        title: diaryEntry.title,
                        content: diaryEntry.content,
                        publishDate: diaryEntry.registration.registrationDate,
                        isUpdate: true,
                        userDiaryEntries,
                        setUserDiaryEntries,
                      });
                    }}
                  >
                    <Text
                      numberOfLines={1}
                      style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack, GENERAL_STYLES.textBold]}
                    >
                      {diaryEntry.title}
                    </Text>
                    <Text numberOfLines={3} style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack]}>
                      {diaryEntry.content.replaceAll(/(\n)/g, " ")}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </SafeAreaView>
      )}
    </View>
  ) : (
    <ErrorScreen
      errorText={translationsContext?.translations.errors.genericNetworkError}
    />
  );
};

/**
 * Checks if the add diary entry button should be disabled.
 *
 *   @param userDiaryEntries the user's diary entries
 *   @returns a boolean indicating whether the add diary entry button should be disabled
 */
function isAddDiaryEntryButtonDisabled(
  userDiaryEntries: DiaryEntry[],
  loading: boolean,
): boolean {
  return (
    loading ||
    userDiaryEntries?.find((diaryEntry) =>
      areDatesEqual(
        timestampToDate(diaryEntry.registration.registrationDate),
        new Date(),
      ),
    ) !== undefined
  );
}

export default DiaryScreen;
