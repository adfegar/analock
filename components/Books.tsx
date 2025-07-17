import {
  useOpenLibraryBooksBySubject,
  useOpenLibraryBooksBySubjectResult,
} from "../hooks/useOpenLibraryBooksBySubject";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import BookDetailScreen from "./Book";
import { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { downloadAndUnzipEpub } from "../services/download.services";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";
import { LoadingIndicator } from "./LoadingIndicator";
import { ErrorScreen } from "./ErrorScreen";
import { getStorageUserData } from "../services/storage.services";
import { BookSubjectSelection } from "./BookSubjectSelection";
import { NavigationHeader } from "./NavigationHeader";
import { FlatListCard } from "./FlatListCard";
import { useNavigation } from "@react-navigation/native";
import { BooksIcon } from "./icons/BooksIcon";

const BOOK_NUMBER = 2;

type BookStackParamList = {
  Books: undefined;
  Book: { id: string; title: string };
};

interface BooksProps {
  subject: string;
}

export enum InternetArchiveSubject {
  FICTION = "Fiction",
  NON_FICTION = "Non-fiction",
  HISTORY = "History",
  SCIENCE = "Science",
  PHILOSOPHY = "Philosophy",
  RELIGION = "Religion",
  BIOGRAPHY = "Biography",
  LITERATURE = "Literature",
  ART = "Art",
  MUSIC = "Music",
  TECHNOLOGY = "Technology",
  MEDICINE = "Medicine",
  LAW = "Law",
  BUSINESS = "Business",
  POLITICS = "Politics",
  EDUCATION = "Education",
  MATHEMATICS = "Mathematics",
  COMPUTER_SCIENCE = "Computer Science",
  SOCIAL_SCIENCES = "Social Sciences",
  PSYCHOLOGY = "Psychology",
  GEOGRAPHY = "Geography",
  COOKING = "Cooking",
  TRAVEL = "Travel",
  POETRY = "Poetry",
  DRAMA = "Drama",
}

const BooksScreen = () => {
  const BooksStack = createNativeStackNavigator();
  const translations = useContext(TranslationsContext)?.translations.home;
  return (
    <BooksStack.Navigator
      initialRouteName="Books"
    >
      <BooksStack.Screen
        name="Books"
        component={BooksWrapper}
        options={{
          headerTitle: translations?.books,
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={true} />
        }}
      />
      <BooksStack.Screen
        name="Book"
        component={BookDetailScreen}
        options={({ route }) => ({
          headerTitle: route.params?.title as string,
          header: (props) => <NavigationHeader {...props} primaryHeaderStyle={false} />
        })}
      />
    </BooksStack.Navigator>
  );
};

const BooksWrapper: React.FC = () => {
  const userData = getStorageUserData();
  const [subject, setSubject] = useState<InternetArchiveSubject>();
  const [shownSubjects, setShownSubjects] = useState<InternetArchiveSubject[]>(
    [],
  );
  const MAX_SUBJECTS = 4;

  // hook to show subject selection
  useEffect(() => {
    if (userData.selectedBookSubject !== undefined) {
      setSubject(userData.selectedBookSubject as InternetArchiveSubject);
    } else {
      const subjectValues = Object.values(InternetArchiveSubject);
      const selectedSubjects: InternetArchiveSubject[] = [];

      for (let i = 0; i < MAX_SUBJECTS; i++) {
        const randomIndex = Math.floor(Math.random() * subjectValues.length);
        selectedSubjects.push(subjectValues[randomIndex]);
        subjectValues.splice(randomIndex, 1)
      }
      setShownSubjects(selectedSubjects);
    }
  }, []);

  return subject ? (
    <Books subject={subject.valueOf()} />
  ) : (
    <BookSubjectSelection
      shownSubjects={shownSubjects}
      setSubject={setSubject}
      userData={userData}
    />
  );
};

const Books: React.FC<BooksProps> = ({ subject }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const openLibraryResponse: useOpenLibraryBooksBySubjectResult = useOpenLibraryBooksBySubject({
    subject,
    sort: "rating desc",
    limit: BOOK_NUMBER,
  });
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const translationsContext = useContext(TranslationsContext);
  const navigation: NativeStackNavigationProp<BookStackParamList> =
    useNavigation();

  /**
   * Aux function to perform download of books returned by Internet Archive response.
   */
  async function downloadBooks(): Promise<void> {
    if (openLibraryResponse.openLibraryBooksBySubject) {
      const bookDownloadPromises: Promise<void>[] = []
      for (const book of openLibraryResponse.openLibraryBooksBySubject) {
        bookDownloadPromises.push(downloadAndUnzipEpub(book))
      }
      try {
        await Promise.all(bookDownloadPromises)
      } catch {
        setErrorMessage(
          translationsContext?.translations.errors.genericNetworkError,
        );
        setLoading(false);
      }
    }
  };

  // Hook to start downloading process with the books given by Internet Archive  
  useEffect(() => {
    if (loading) {
      if (!openLibraryResponse.error) {
        if (openLibraryResponse.openLibraryBooksBySubject.length > 0) {
          downloadBooks()
            .then(() => {
              setLoading(false);
            })
            .catch(() => {
              setErrorMessage(
                translationsContext?.translations.errors.genericNetworkError,
              );
              setLoading(false);
            });
        }
      } else {
        setErrorMessage(
          translationsContext?.translations.errors.genericNetworkError,
        );
        setLoading(false);
      }
    }
  }, [openLibraryResponse]);

  return (
    translationsContext && (
      <>
        {loading && !errorMessage && (
          <LoadingIndicator
            text={translationsContext.translations.books.donwloadingContent}
          />
        )}
        {!loading && (
          <>
            {!errorMessage ? (
              <FlatList
                numColumns={2}
                data={openLibraryResponse.openLibraryBooksBySubject}
                keyExtractor={(book) => book.identifier}
                renderItem={({ item, index }) => (
                  <FlatListCard
                    flatListIndex={index}
                    onPress={() => {
                      navigation.push("Book",
                        {
                          id: item.identifier,
                          title: item.title
                        }
                      );
                    }}
                  >
                    <View style={[
                      GENERAL_STYLES.defaultBorder,
                      GENERAL_STYLES.defaultBorderWidth,
                      GENERAL_STYLES.alignCenter,
                      GENERAL_STYLES.borderRadiusBig,
                      GENERAL_STYLES.twentyPercentWindowHeigthVerticalPadding
                    ]}>
                      <BooksIcon />
                    </View>
                    <View style={[
                      GENERAL_STYLES.flexCol,
                      GENERAL_STYLES.flexGapExtraSmall,
                      GENERAL_STYLES.alignCenter,
                      GENERAL_STYLES.justifyCenter,
                    ]}>
                      <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack, GENERAL_STYLES.textBold]} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack]} numberOfLines={1}>
                        {item.creator ? item.creator : translationsContext.translations.books.noAuthor}
                      </Text>
                    </View>
                  </FlatListCard>
                )}
                contentContainerStyle={[
                  GENERAL_STYLES.baseScreenPadding,
                  GENERAL_STYLES.whiteBackgroundColor,
                  GENERAL_STYLES.flexGrow
                ]}
                removeClippedSubviews={false}
              />
            ) : (
              <ErrorScreen errorText={errorMessage} />
            )}
          </>
        )}
      </>
    )
  );
};

export default BooksScreen;
