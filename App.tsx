import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BooksScreen from "./components/Books";
import MySpaceScreen from "./components/Profile";
import GamesScreen from "./components/Games";
import DiaryScreen from "./components/DiaryEntries";
import Home from "./components/Home";
import { TranslationsProvider } from "./contexts/translationsContext";
import { SettingsProvider } from "./contexts/settingsContext";
import { ActivityCompletionProvider } from "./contexts/activityCompletionContext";

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();
function App(): React.JSX.Element {
  return (
    <ActivityCompletionProvider>
      <SettingsProvider>
        <TranslationsProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              initialRouteName="Home"
            >
              <Stack.Screen
                name="Home"
                component={Home}
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
      </SettingsProvider>
    </ActivityCompletionProvider>
  );
}

export default App;
