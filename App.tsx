import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BooksScreen from "./components/Books";
import MySpaceScreen from "./components/Profile";
import GamesScreen from "./components/Games";
import DiaryScreen from "./components/DiaryEntries";
import Home, { RootStackParamList } from "./components/Home";
import { TranslationsProvider } from "./contexts/translationsContext";
import { SettingsProvider } from "./contexts/settingsContext";
import { ActivityCompletionProvider } from "./contexts/activityCompletionContext";
import { ActivityRegistrationsProvider } from "./contexts/activityRegistrationsContext";
import Login from "./components/Login";
import { UserDataProvider } from "./contexts/userDataContext";

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator<RootStackParamList>();
function App(): React.JSX.Element {
  return (
    <SettingsProvider>
      <UserDataProvider>
        <ActivityCompletionProvider>
          <ActivityRegistrationsProvider>
            <TranslationsProvider>
              <NavigationContainer ref={navigationRef}>
                <Stack.Navigator initialRouteName="Home">
                  <Stack.Screen
                    name="Home"
                    component={Home}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="BooksScreen"
                    component={BooksScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="GamesScreen"
                    component={GamesScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="DiaryScreen"
                    component={DiaryScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="MySpaceScreen"
                    component={MySpaceScreen}
                    options={{ headerShown: false }}
                  />
                </Stack.Navigator>
              </NavigationContainer>
            </TranslationsProvider>
          </ActivityRegistrationsProvider>
        </ActivityCompletionProvider>
      </UserDataProvider>
    </SettingsProvider>
  );
}

export default App;
