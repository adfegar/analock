import { TouchableOpacity } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { HOME_STYLES } from "../constants/home.styles";
import { View } from "react-native";
import { Text } from "react-native";

interface CardComponentProps {
  label: string;
  Icon?: React.FC;
  onPress: () => void;
  paddingRight?: number;
  paddingLeft?: number;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  label,
  Icon,
  onPress,
  paddingRight,
  paddingLeft,
}) => {
  return (
    <TouchableOpacity
      onPressIn={onPress}
      style={[
        GENERAL_STYLES.flexGrow,
        {
          paddingRight: paddingRight,
          paddingLeft: paddingLeft,
        },
      ]}
    >
      <View style={[HOME_STYLES.contentCard, GENERAL_STYLES.defaultBorder, GENERAL_STYLES.defaultBorderWidth, GENERAL_STYLES.flexRow]}>
        {Icon && <Icon />}
        <Text
          style={[
            GENERAL_STYLES.uiText,
            GENERAL_STYLES.textBlack,
            GENERAL_STYLES.textCenter,
            HOME_STYLES.contentCardText,
            { flexWrap: "wrap" },
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
