import { ReactNode } from "react";
import { View } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";

interface BaseScreenProps {
  children: ReactNode;
}

export const BaseScreen: React.FC<BaseScreenProps> = ({
  children,
}: BaseScreenProps) => {
  return (
    <>
      <View
        style={[
          GENERAL_STYLES.flexCol,
          GENERAL_STYLES.flexGrow,
          GENERAL_STYLES.whiteBackgroundColor,
          GENERAL_STYLES.baseScreenPadding,
        ]}
      >
        {children}
      </View>
    </>
  );
};
