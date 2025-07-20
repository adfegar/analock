import { HOME_STYLES } from "../constants/home.styles";
import { View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { ProgressIcon } from "./icons/ProgressIcon";
import { Clock } from "./Clock";
import { ActivityKind } from "../contexts/activityCompletionContext";

interface InfoBarProps {
  activityCompletionMap: Map<ActivityKind, boolean>
}

export const InfoBar: React.FC<InfoBarProps> =
  ({
    activityCompletionMap
  }) => {

    return (
      <View style={[HOME_STYLES.statusBar, GENERAL_STYLES.grayBackgroundColor]}>
        <Clock />
        <View style={HOME_STYLES.statusBarprogressContainer}>
          <ProgressIcon
            activityCompletionMap={activityCompletionMap}
          />
        </View>
      </View>
    );
  };
