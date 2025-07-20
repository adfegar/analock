import { Text, View } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { GENERAL_STYLES } from "../constants/general.styles";

interface ErrorScreenProps {
  errorText?: string;
}
export const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorText }) => {
  return (
    <BaseScreen>
      <View
        style={[
          GENERAL_STYLES.flexCol,
          GENERAL_STYLES.flexGrow,
          GENERAL_STYLES.alignCenter,
        ]}
      >
        <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack, GENERAL_STYLES.textTitle]}>
          {errorText}
        </Text>
      </View>
    </BaseScreen>
  );
};
