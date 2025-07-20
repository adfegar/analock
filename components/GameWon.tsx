import { Text, View } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { useContext } from "react";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";

export const GameWon: React.FC = () => {
  const gamesTranslations = useContext(TranslationsContext)?.translations.games;
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
        GENERAL_STYLES.textTitleBig,
        GENERAL_STYLES.textCenter,
        GENERAL_STYLES.tenPercentWindowWidthHorizontalPadding
      ]}>
        {gamesTranslations?.won}
      </Text>
    </View>
  );
};
