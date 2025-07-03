import { GENERAL_STYLES } from "../constants/general.styles";
import { BackHandler, FlatList, View } from "react-native";
import { ContentCard, ContentCardProps, RootStackParamList } from "./ContentCard";
import { StatusBar } from "./StatusBar";
import { useContext, useEffect, useState } from "react";
import { Login } from "./Login";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useWipePeriodicContent } from "../hooks/useWipePeriodicContent";
import { getStorageUserData, setStorageUserData } from "../services/storage.services";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";
import { DiaryIcon } from "./icons/DiaryIcon";
import { GamesIcon } from "./icons/GamesIcon";
import { BooksIcon } from "./icons/BooksIcon";
import { ProfileIcon } from "./icons/ProfileIcon";
import { SettingsContext } from "../contexts/settingsContext";

const Home: React.FC = () => {
  const navigation = useNavigation();
  const [authenticated, setAuthenticated] = useState<boolean>(
    getStorageUserData().authenticated,
  );
  const isHomeFocused = useIsFocused();
  const wiped = useWipePeriodicContent();
  const homeTranslations = useContext(TranslationsContext)?.translations.home;
  const userSettings = useContext(SettingsContext)?.settings;

  interface ContentCardData {
    name: string;
    screenName: keyof RootStackParamList;
    Icon: React.FC;
  }

  const homeSections: ContentCardData[] = [
    {
      name: homeTranslations!.diary,
      screenName: "DiaryScreen",
      Icon: DiaryIcon,
    },
    {
      name: homeTranslations!.profile,
      screenName: "MySpaceScreen",
      Icon: ProfileIcon,
    },
    {
      name: homeTranslations!.books,
      screenName: "BooksScreen",
      Icon: BooksIcon,
    },
    {
      name: homeTranslations!.games,
      screenName: "GamesScreen",
      Icon: GamesIcon,
    },
  ];

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
  }, []);

  return authenticated || !userSettings?.general.enableOnlineFeatures ? (
    <View
      style={[
        GENERAL_STYLES.flexGrow,
        GENERAL_STYLES.whiteBackgroundColor,
      ]}
    >
      <StatusBar isHomeFocused={isHomeFocused} wiped={wiped} />
      <BaseScreen>
        <FlatList
          numColumns={2}
          data={homeSections}
          keyExtractor={(homeSection) => homeSection.screenName}
          renderItem={({ item, index }) => (
            <ContentCard
              name={item.name}
              screenName={item.screenName}
              Icon={item.Icon}
              cardIndex={index}
            />
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
