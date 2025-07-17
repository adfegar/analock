import { GENERAL_STYLES } from "../constants/general.styles";
import { BackHandler, FlatList, Text, View } from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { Login } from "./Login";
import { getStorageBooks, getStorageGamesData, getStorageUserData, setStorageUserData } from "../services/storage.services";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";
import { DiaryIcon } from "./icons/DiaryIcon";
import { BooksIcon } from "./icons/BooksIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { SettingsContext } from "../contexts/settingsContext";
import { InfoBar } from "./InfoBar";
import { GamesIlustration } from "./icons/GamesIlustration";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoadingIndicator } from "./LoadingIndicator";
import { FlatListCard } from "./FlatListCard";
import { HOME_STYLES } from "../constants/home.styles";
import { colorBlack, colorWhiteBackground } from "../constants/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getIntervalUserDiaryEntries } from "../services/diaryEntries.services";
import { areDatesEqual, timestampToDate } from "../utils/date.utils";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";

type RootStackParamList = {
  Home: undefined;
  BooksScreen: undefined;
  MySpaceScreen: undefined;
  GamesScreen: undefined;
  DiaryScreen: undefined;
};

interface ContentCardData {
  name: string;
  screenName: keyof RootStackParamList;
  Icon: React.FC;
}

const Home: React.FC = () => {
  const navigation: NativeStackNavigationProp<RootStackParamList> = useNavigation();
  const [authenticated, setAuthenticated] = useState<boolean>(
    getStorageUserData().authenticated,
  );
  const translationsContext = useContext(TranslationsContext);
  const settingsContext = useContext(SettingsContext);

  // hook to handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          BackHandler.exitApp();
        }
        return true;
      },
    );

    return () => {
      backHandler.remove();
    };
  }, [navigation]);

  if (!translationsContext || !settingsContext) {
    return <LoadingIndicator />;
  }

  const { translations } = translationsContext;
  const { settings } = settingsContext;


  const homeSections: ContentCardData[] = [
    {
      name: translations.home.diary,
      screenName: "DiaryScreen",
      Icon: DiaryIcon,
    },
    {
      name: translations.home.profile,
      screenName: "MySpaceScreen",
      Icon: ProfileIcon,
    },
    {
      name: translations.home.books,
      screenName: "BooksScreen",
      Icon: BooksIcon,
    },
    {
      name: translations.home.games,
      screenName: "GamesScreen",
      Icon: GamesIlustration,
    },
  ];

  return authenticated || !settings.general.enableOnlineFeatures ? (
    <View
      style={[
        GENERAL_STYLES.flexGrow,
        GENERAL_STYLES.whiteBackgroundColor,
      ]}
    >
      <InfoBar />
      <BaseScreen>
        <FlatList
          numColumns={2}
          data={homeSections}
          keyExtractor={(homeSection) => homeSection.screenName}
          renderItem={({ item, index }) => (
            <FlatListCard
              flatListIndex={index}
              onPress={() => navigation.navigate(item.screenName)}
            >
              <View style={[
                HOME_STYLES.contentCard,
                GENERAL_STYLES.defaultBorder,
                GENERAL_STYLES.defaultBorderWidth,
                {
                  borderTopLeftRadius: index !== 0 ? 0 : 40,
                  borderTopRightRadius: index !== 1 ? 0 : 40,
                  borderBottomLeftRadius: index !== 2 ? 0 : 40,
                  borderBottomRightRadius: index !== 3 ? 0 : 40,
                  backgroundColor: item.screenName !== 'MySpaceScreen' ? 'inherit' : colorBlack
                }]}>
                <item.Icon />
                <Text
                  style={[
                    GENERAL_STYLES.uiText,
                    GENERAL_STYLES.textBlack,
                    GENERAL_STYLES.textCenter,
                    GENERAL_STYLES.textSmall,
                    GENERAL_STYLES.textBold,
                    {
                      color: item.screenName !== 'MySpaceScreen' ? 'inherit' : colorWhiteBackground
                    }
                  ]}
                >
                  {item.name}
                </Text>
              </View>
            </FlatListCard>
          )}
          contentContainerStyle={[
            GENERAL_STYLES.flexGap,
            GENERAL_STYLES.flexGrow,
          ]}
          removeClippedSubviews={false}
        />
      </BaseScreen>
    </View>
  ) : (
    <Login setAuthenticated={setAuthenticated} />
  );
};

export default Home;
