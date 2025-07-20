import { GENERAL_STYLES } from "../constants/general.styles";
import { BackHandler, FlatList, StatusBar, Text, View } from "react-native";
import { useContext, useEffect, useState } from "react";
import { Login } from "./Login";
import { getStorageUserData } from "../services/storage.services";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";
import { DiaryIcon } from "./icons/DiaryIcon";
import { SettingsContext } from "../contexts/settingsContext";
import { InfoBar } from "./InfoBar";
import { GamesIlustration } from "./icons/GamesIlustration";
import { useNavigation } from "@react-navigation/native";
import { LoadingIndicator } from "./LoadingIndicator";
import { FlatListCard } from "./FlatListCard";
import { HOME_STYLES } from "../constants/home.styles";
import { colorBlack, colorGreen, colorPink, colorPurple, colorWhiteBackground } from "../constants/constants";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { areDatesEqual } from "../utils/date.utils";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";
import BooksIlustration from "./icons/BooksIlustration";
import { ActivityCompletionContext, ActivityKind } from "../contexts/activityCompletionContext";
import { GamesData } from "../types/game";
import ProfileIlustration from "./icons/ProfileIlustration";

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
  activityKind?: ActivityKind
}

const activityCompletionColor = new Map<keyof RootStackParamList, string>([
  ["DiaryScreen", colorPurple],
  ["BooksScreen", colorGreen],
  ["GamesScreen", colorPink]
])

const Home: React.FC = () => {
  const [activityCompletionMap, setActivityCompletionMap] = useState(new Map<ActivityKind, boolean>())
  const navigation: NativeStackNavigationProp<RootStackParamList> = useNavigation();
  const [authenticated, setAuthenticated] = useState<boolean>(
    getStorageUserData().authenticated,
  );
  const translationsContext = useContext(TranslationsContext);
  const settingsContext = useContext(SettingsContext);
  const activityCompletionContext = useContext(ActivityCompletionContext)
  useWipePeriodicContent()

  useEffect(() => {
    if (activityCompletionContext) {
      const bookData = activityCompletionContext.activityCompletionMap.get(ActivityKind.Book) as StorageBook[];
      const gameData = activityCompletionContext.activityCompletionMap.get(ActivityKind.Game) as GamesData[]
      const diaryData = activityCompletionContext.activityCompletionMap.get(ActivityKind.Diary) as DiaryEntry[]
      const updatedActivityCompletionMap = new Map(activityCompletionMap)
      if (bookData && bookData.length > 0) {
        updatedActivityCompletionMap.set(ActivityKind.Book, bookData.every(storageBook => storageBook.data && storageBook.data.finished))
      }
      if (gameData && gameData.length > 0) {
        updatedActivityCompletionMap.set(ActivityKind.Game, gameData.every(storageGame => storageGame.won))
      }

      if (diaryData && diaryData.length > 0) {
        updatedActivityCompletionMap.set(ActivityKind.Diary,
          diaryData.some(
            diaryEntry =>
              areDatesEqual(new Date(), new Date(diaryEntry.registration.registrationDate))
          )
        )
      }

      setActivityCompletionMap(updatedActivityCompletionMap)
    }
  }, [activityCompletionContext]);

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
      activityKind: ActivityKind.Diary
    },
    {
      name: translations.home.profile,
      screenName: "MySpaceScreen",
      Icon: ProfileIlustration,
    },
    {
      name: translations.home.books,
      screenName: "BooksScreen",
      Icon: BooksIlustration,
      activityKind: ActivityKind.Book
    },
    {
      name: translations.home.games,
      screenName: "GamesScreen",
      Icon: GamesIlustration,
      activityKind: ActivityKind.Game
    },
  ];

  return authenticated || !settings.general.enableOnlineFeatures ? (
    <View
      style={[
        GENERAL_STYLES.flexGrow,
        GENERAL_STYLES.whiteBackgroundColor,
      ]}
    >
      <StatusBar
        animated={true}
        backgroundColor={colorBlack}
        barStyle={"light-content"}
      />
      <InfoBar
        activityCompletionMap={activityCompletionMap}
      />
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
                  backgroundColor: item.screenName !== 'MySpaceScreen'
                    ? (item.activityKind !== undefined && activityCompletionMap.get(item.activityKind)
                      ? activityCompletionColor.get(item.screenName)
                      : colorWhiteBackground)
                    : colorBlack
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
