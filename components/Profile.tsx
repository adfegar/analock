import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, TouchableOpacity } from "react-native";
import { useContext, useEffect, useState } from "react";
import { BaseScreen } from "./BaseScreen";
import { TranslationsContext } from "../contexts/translationsContext";
import { useNavigation } from "@react-navigation/native";
import { CalendarScreen } from "./RegistrationsCalendar";
import { WeeklyActivityChart } from "./WeeklyActivityChart";
import { getStorageUserData } from "../services/storage.services";
import { View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { CalendarIcon } from "./icons/CalendarIcon";
import { SettingsIcon } from "./icons/SettingsIcon";
import { ProfileCircleContainer } from "./ProfileCircleContainer";
import { ProfileIcon } from "./icons/ProfileIcon";
import { useGetUserActivityRegistrations } from "../hooks/useGetUserActivityRegistrations";
import { formatString } from "../utils/string.utils";
import Settings from "./Settings";
import { SettingsContext } from "../contexts/settingsContext";
import { NavigationHeader } from "./NavigationHeader";

export type MySpaceStackParamList = {
  MySpace: undefined;
  Settings: undefined;
};

const MIN_ACTIVITY_NUMBER_FOR_STREAK = 1;

const MySpaceScreen = () => {
  const translations = useContext(TranslationsContext)?.translations;
  const MySpaceStack = createNativeStackNavigator();
  return (
    <MySpaceStack.Navigator
      initialRouteName="MySpace"
    >
      <MySpaceStack.Screen
        name="MySpace"
        component={MySpace}
        options={{
          headerTitle: translations?.home.profile,
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={true} />
        }}
      />
      <MySpaceStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          headerTitle: translations?.profile.calendar,
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={false} />
        }}
      />
      <MySpaceStack.Screen
        name="Settings"
        component={Settings}
        options={{
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={false} />,
          headerTitle: translations?.profile.settings,
        }}
      />
    </MySpaceStack.Navigator>
  );
};

function MySpace() {
  const navigation = useNavigation();
  const userSettingsContext = useContext(SettingsContext);
  const profileTranslations =
    useContext(TranslationsContext)?.translations.profile;
  const userData = getStorageUserData();
  const { userRegistrations, error } = useGetUserActivityRegistrations(
    userData.userId,
  );
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    if (userRegistrations.length > 0) {
      const currentDate = new Date();
      let day = currentDate.getDate() - 1;
      let streak = 0;
      let brokeStreak = false;

      while (!brokeStreak) {
        const date = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day,
        );

        if (
          userRegistrations.filter(
            (registration) =>
              registration.registration.registrationDate === date.valueOf(),
          ).length >= MIN_ACTIVITY_NUMBER_FOR_STREAK
        ) {
          streak++;
        } else {
          brokeStreak = true;
        }
        day--;
      }
      setStreak(streak);
    }
  }, [userRegistrations]);

  return (
    <BaseScreen>
      <View
        style={[
          GENERAL_STYLES.flexRow,
          GENERAL_STYLES.alignCenter,
          GENERAL_STYLES.flexGap,
          { marginBottom: 20 },
        ]}
      >
        <ProfileCircleContainer iconSize={64}>
          <ProfileIcon width={64} heigth={64} />
        </ProfileCircleContainer>
        <View style={[GENERAL_STYLES.flexCol, { alignSelf: "flex-start" }]}>
          <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack, GENERAL_STYLES.textExtraBig]}>
            {userData.userName !== undefined ? userData.userName : "Guest"}
          </Text>
          {profileTranslations &&
            !error &&
            userSettingsContext?.settings.general.enableOnlineFeatures && (
              <Text style={[GENERAL_STYLES.uiText]}>
                {formatString(profileTranslations.streak, streak)}
              </Text>
            )}
        </View>
      </View>
      {!error && userSettingsContext?.settings.general.enableOnlineFeatures && (
        <View>
          <View style={{ marginBottom: 20 }}>
            <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack, GENERAL_STYLES.textTitle]}>
              {profileTranslations?.weeklyProgress}
            </Text>
            <WeeklyActivityChart userRegistrations={userRegistrations} />
          </View>
        </View>
      )}
      <View style={[GENERAL_STYLES.flexRow, GENERAL_STYLES.flexGap]}>
        <TouchableOpacity
          onPressIn={() => {
            navigation.push("Calendar", { userRegistrations });
          }}
          style={[
            GENERAL_STYLES.generalBorder,
            GENERAL_STYLES.mediumBorderWidth,
            GENERAL_STYLES.smallPadding,
            GENERAL_STYLES.flexGrow,
          ]}
        >
          <View
            style={[
              GENERAL_STYLES.flexRow,
              GENERAL_STYLES.alignCenter,
              GENERAL_STYLES.flexGapSmall,
            ]}
          >
            <CalendarIcon />
            <Text
              style={[
                GENERAL_STYLES.uiText,
                GENERAL_STYLES.textBlack,
                GENERAL_STYLES.textBold,
                GENERAL_STYLES.alignCenter,
              ]}
            >
              {profileTranslations?.calendar}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPressIn={() => {
            navigation.push("Settings");
          }}
          style={[
            GENERAL_STYLES.generalBorder,
            GENERAL_STYLES.mediumBorderWidth,
            GENERAL_STYLES.smallPadding,
            GENERAL_STYLES.flexGrow,
          ]}
        >
          <View
            style={[
              GENERAL_STYLES.flexRow,
              GENERAL_STYLES.alignCenter,
              GENERAL_STYLES.flexGapSmall,
            ]}
          >
            <SettingsIcon />
            <Text
              style={[
                GENERAL_STYLES.uiText,
                GENERAL_STYLES.textBlack,
                GENERAL_STYLES.textBold,
                GENERAL_STYLES.alignCenter,
              ]}
            >
              {profileTranslations?.settings}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </BaseScreen>
  );
}

export default MySpaceScreen;
