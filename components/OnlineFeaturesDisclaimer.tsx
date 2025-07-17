import { useContext } from "react";
import { Text } from "react-native";
import { TranslationsContext } from "../contexts/translationsContext";
import { BaseScreen } from "./BaseScreen";
import { GENERAL_STYLES } from "../constants/general.styles";

export const OnlineFeaturesDisclaimer: React.FC = () => {
  const generalTranslations =
    useContext(TranslationsContext)?.translations.general;
  return (
    <BaseScreen>
      <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBlack]}>
        {generalTranslations?.onlineFeaturesDisclaimer}
      </Text>
    </BaseScreen>
  );
};
