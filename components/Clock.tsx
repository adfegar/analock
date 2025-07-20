import { useEffect, useState } from "react";
import { Text } from "react-native-gesture-handler";
import { GENERAL_STYLES } from "../constants/general.styles";
import { View } from "react-native";

export const Clock: React.FC = () => {
    const [time, setTime] = useState<Date>(new Date());
    // hook to update clock
    useEffect(() => {
        const clockInterval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(clockInterval)
    }, []);

    return (
        <View>
            <Text style={[GENERAL_STYLES.uiText, GENERAL_STYLES.textWhite, GENERAL_STYLES.textBig, GENERAL_STYLES.textBold]}>
                {`${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}:${time.getSeconds().toString().padStart(2, "0")}`}
            </Text>
        </View>
    )
}