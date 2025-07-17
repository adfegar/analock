import { HOME_STYLES } from "../constants/home.styles";
import { View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { ProgressIcon } from "./icons/ProgressIcon";
import { Clock } from "./Clock";

export const InfoBar: React.FC = () => {

  return (
    <View style={[HOME_STYLES.statusBar, GENERAL_STYLES.grayBackgroundColor]}>
      <Clock />
      <View style={HOME_STYLES.statusBarprogressContainer}>
        <ProgressIcon />
      </View>
    </View>
  );
};
