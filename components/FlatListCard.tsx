import { TouchableOpacity } from "react-native";
import { GENERAL_STYLES } from "../constants/general.styles";
import { ReactNode } from "react";

interface FlatListCardProps {
    flatListIndex: number;
    onPress: () => void;
    children: ReactNode;
}

export const FlatListCard: React.FC<FlatListCardProps> = ({ flatListIndex, onPress, children }) => {
    return (
        <TouchableOpacity
            style={[
                GENERAL_STYLES.flexCol,
                GENERAL_STYLES.justifyCenter,
                GENERAL_STYLES.flexGrow,
                GENERAL_STYLES.flexGap,
                {
                    marginRight: (flatListIndex % 2 === 0) ? 10 : 0,
                    marginLeft: (flatListIndex % 2 !== 0) ? 10 : 0
                }
            ]}
            onPressIn={() => {
                onPress()
            }}
        >
            {children}
        </TouchableOpacity>
    )
}