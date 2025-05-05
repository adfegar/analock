import { Text, TouchableOpacity, View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { SETTINGS_STYLES } from "../constants/settings.styles";

interface ButtonGroupProps {
  label?: string;
  buttons: SettingsRadioButton[];
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
}
export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  label,
  buttons,
  selectedIndex,
  setSelectedIndex,
}) => {
  return (
    <View style={[GENERAL_STYLES.flexCol, { gap: 5 }]}>
      {label && (
        <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textBold]}>
          {label}
        </Text>
      )}
      <View
        style={[
          GENERAL_STYLES.flexRow,
          GENERAL_STYLES.alignCenter,
          SETTINGS_STYLES.settingsWrapper,
          { justifyContent: "center" },
        ]}
      >
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={[
              {
                backgroundColor: selectedIndex !== index ? "#e9e9e9" : "black",
                padding: 10,
                borderTopLeftRadius: index !== 0 ? 0 : 9,
                borderBottomLeftRadius: index !== 0 ? 0 : 9,
                borderTopRightRadius: index !== buttons.length - 1 ? 0 : 9,
                borderBottomRightRadius: index !== buttons.length - 1 ? 0 : 9,
                flex: 1,
              },
            ]}
            onPressIn={() => {
              setSelectedIndex(index);
            }}
          >
            <Text
              style={[
                GENERAL_STYLES.uiText,
                GENERAL_STYLES.textCenter,
                { color: selectedIndex !== index ? "black" : "white" },
              ]}
            >
              {button.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
