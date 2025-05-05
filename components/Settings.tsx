import { Text } from "react-native";
import { BaseScreen } from "./BaseScreen";
import { GENERAL_STYLES } from "../constants/general.styles";
import { ButtonGroup } from "./ButtonGroup";
import { useContext, useEffect, useState } from "react";
import {
  DAY_OF_WEEK_MONDAY,
  DAY_OF_WEEK_SUNDAY,
  FONT_FAMILY_OPEN_DYSLEXIC,
  FONT_FAMILY_SERIF,
  FONT_SIZE_BIG,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_SMALL,
  LANGUAGE_ENGLISH,
  LANGUAGE_SPANISH,
} from "../constants/constants";
import { getSettings } from "../services/storage.services";
import { useSaveOnExit } from "../hooks/useSaveOnExit";
import { TranslationsContext } from "../contexts/translationsContext";
import { Language, getTranslations } from "../services/translation.services";
import { CustomSwitch } from "./CustomSwitch";
import { View } from "react-native";

function Settings() {
  const translationsContext = useContext(TranslationsContext);
  const settingsTranslations = translationsContext?.translations.settings;
  const languageRadioGroup: SettingsRadioButton[] = [
    {
      text: settingsTranslations?.laguageEng,
      value: LANGUAGE_ENGLISH,
    },
    {
      text: settingsTranslations?.languageSpa,
      value: LANGUAGE_SPANISH,
    },
  ];
  const fontSizeRadioGroup: SettingsRadioButton[] = [
    {
      text: settingsTranslations?.textSizeSmall,
      value: FONT_SIZE_SMALL,
    },
    {
      text: settingsTranslations?.textSizeMedium,
      value: FONT_SIZE_MEDIUM,
    },
    {
      text: settingsTranslations?.textSizeBig,
      value: FONT_SIZE_BIG,
    },
  ];
  const fontFamilyRadioGroup: SettingsRadioButton[] = [
    {
      text: settingsTranslations?.textFontSerif,
      value: FONT_FAMILY_SERIF,
    },
    {
      text: settingsTranslations?.textFontOpenDyslexic,
      value: FONT_FAMILY_OPEN_DYSLEXIC,
    },
  ];
  const firstDayOfWeekRadioGroup: SettingsRadioButton[] = [
    {
      text: translationsContext!.translations.general.daysOfWeek.sunday,
      value: DAY_OF_WEEK_SUNDAY,
    },
    {
      text: translationsContext!.translations.general.daysOfWeek.monday,
      value: DAY_OF_WEEK_MONDAY,
    },
  ];
  const userSettings = getSettings();
  const [areOnlineFeaturesEnabled, setAreOnlineFeaturesEnabled] =
    useState<boolean>(userSettings.general.enableOnlineFeatures);
  const [selectedLanguage, setSelectedLanguage] = useState<number>(
    languageRadioGroup.findIndex(
      (language) => language.value === userSettings.general.language,
    ),
  );
  const [selectedFontSize, setSelectedFontSize] = useState<number>(
    fontSizeRadioGroup.findIndex(
      (fontSize) => fontSize.value === userSettings.bookReader.fontSize,
    ),
  );
  const [selectedFontFamily, setSelectedFontFamily] = useState<number>(
    fontFamilyRadioGroup.findIndex(
      (fontFamily) => fontFamily.value === userSettings.bookReader.fontFamily,
    ),
  );
  const [selectedFirstDayOfWeek, setSelectedFirstDayOfWeek] = useState<number>(
    firstDayOfWeekRadioGroup.findIndex(
      (dayOfWeek) =>
        dayOfWeek.value === userSettings.preferences.firstDayOfWeek,
    ),
  );
  useSaveOnExit({
    general: {
      enableOnlineFeatures: areOnlineFeaturesEnabled,
      language: languageRadioGroup[selectedLanguage].value as string,
    },
    bookReader: {
      fontSize: fontSizeRadioGroup[selectedFontSize].value as number,
      fontFamily: fontFamilyRadioGroup[selectedFontFamily].value as string,
    },
    preferences: {
      firstDayOfWeek: firstDayOfWeekRadioGroup[selectedFirstDayOfWeek]
        .value as string,
    },
  });

  useEffect(() => {
    translationsContext?.setTranslations(
      getTranslations(
        languageRadioGroup[selectedLanguage].value as string as Language,
      ),
    );
  }, [selectedLanguage]);

  return (
    <BaseScreen>
      <View style={[{ marginBottom: 30 }]}>
        <Text
          style={[GENERAL_STYLES.uiText, { fontSize: 25, marginBottom: 10 }]}
        >
          {settingsTranslations?.general}
        </Text>
        <View style={[GENERAL_STYLES.flexCol, GENERAL_STYLES.flexGap]}>
          <CustomSwitch
            label={settingsTranslations?.onlineFeatures}
            isEnabled={areOnlineFeaturesEnabled}
            setIsEnabled={setAreOnlineFeaturesEnabled}
          />
          <ButtonGroup
            label={settingsTranslations?.language}
            buttons={languageRadioGroup}
            selectedIndex={selectedLanguage}
            setSelectedIndex={setSelectedLanguage}
          />
        </View>
      </View>
      <View style={[{ marginBottom: 30 }]}>
        <Text
          style={[GENERAL_STYLES.uiText, { fontSize: 25, marginBottom: 10 }]}
        >
          {settingsTranslations?.bookReader}
        </Text>
        <View style={[GENERAL_STYLES.flexCol, GENERAL_STYLES.flexGap]}>
          <ButtonGroup
            label={settingsTranslations?.textSize}
            buttons={fontSizeRadioGroup}
            selectedIndex={selectedFontSize}
            setSelectedIndex={setSelectedFontSize}
          />
          <ButtonGroup
            label={settingsTranslations?.textFont}
            buttons={fontFamilyRadioGroup}
            selectedIndex={selectedFontFamily}
            setSelectedIndex={setSelectedFontFamily}
          />
        </View>
      </View>
      <View>
        <Text
          style={[GENERAL_STYLES.uiText, { fontSize: 25, marginBottom: 10 }]}
        >
          {settingsTranslations?.preferences}
        </Text>
        <View style={[GENERAL_STYLES.flexCol, GENERAL_STYLES.flexGap]}>
          <ButtonGroup
            label={settingsTranslations?.firstDayOfWeek}
            buttons={firstDayOfWeekRadioGroup}
            selectedIndex={selectedFirstDayOfWeek}
            setSelectedIndex={setSelectedFirstDayOfWeek}
          />
        </View>
      </View>
    </BaseScreen>
  );
}

export default Settings;
