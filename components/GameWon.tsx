import { Text } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { useContext } from "react";
import { TranslationsContext } from "../contexts/translationsContext";
import { GENERAL_STYLES } from "../constants/general.styles";

export const GameWon: React.FC = () => {
  const gamesTranslations = useContext(TranslationsContext)?.translations.games;
  return (
    <BaseScreen>
      <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack, GENERAL_STYLES.textTitleBig]}>
        {gamesTranslations?.won}
      </Text>
    </BaseScreen>
  );
};
