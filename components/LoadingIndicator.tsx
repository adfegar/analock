import { Image, Text, View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";

interface LoadingIndicatorProps {
  text?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ text }) => {
  return (
    <View style={
      [GENERAL_STYLES.flexCol,
      GENERAL_STYLES.alignCenter,
      GENERAL_STYLES.justifyCenter,
      GENERAL_STYLES.flexGapSmall,
      GENERAL_STYLES.flexGrow
      ]}>
      <Image
        style={{ width: 60, height: 60 }}
        source={require("../assets/loading.gif")}
      />
      {text && (
        <Text
          style={[
            GENERAL_STYLES.uiText,
            GENERAL_STYLES.textBlack,
            GENERAL_STYLES.textCenter,
            GENERAL_STYLES.tenPercentWindowWidthHorizontalPadding
          ]}
        >
          {text}
        </Text>
      )}
    </View>
  );
};
