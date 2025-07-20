import { useContext } from "react";
import { Text, View } from "react-native";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";

export const OnlineFeaturesDisclaimer: React.FC = () => {
  const generalTranslations =
    useContext(TranslationsContext)?.translations.general;
  return (
    <View style={[
      GENERAL_STYLES.flexGrow,
      GENERAL_STYLES.alignCenter,
      GENERAL_STYLES.justifyCenter,
      GENERAL_STYLES.whiteBackgroundColor
    ]}>
      <Text style={[
        GENERAL_STYLES.uiText,
        GENERAL_STYLES.textBlack,
        GENERAL_STYLES.textCenter,
        GENERAL_STYLES.textMedium,
        GENERAL_STYLES.tenPercentWindowWidthHorizontalPadding,
      ]}>
        {generalTranslations?.onlineFeaturesDisclaimer}
      </Text>
    </View>
  );
};
