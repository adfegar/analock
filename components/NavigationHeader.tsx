import { Pressable, StatusBar, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { GENERAL_STYLES } from "../constants/general.styles";
import { NativeStackNavigationOptions, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ParamListBase, Route } from "@react-navigation/native";
import { colorBlack, colorWhite, colorWhiteBackground } from "../constants/constants";

interface NavigationHeaderProps {
    options: NativeStackNavigationOptions;
    route: Route<string>;
    navigation: NativeStackNavigationProp<ParamListBase>;
    primaryHeaderStyle: boolean
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({ options, route, navigation, primaryHeaderStyle }) => {
    const title =
        options.headerTitle !== undefined
            ? options.headerTitle.toString()
            : options.title !== undefined
                ? options.title
                : route.name
    return (
        <View
            style={[GENERAL_STYLES.whiteBackgroundColor]}
        >
            <StatusBar
                animated={true}
                backgroundColor={primaryHeaderStyle ? colorBlack : colorWhiteBackground}
                barStyle={primaryHeaderStyle ? "light-content" : "dark-content"}
            />
            <View
                style={[
                    GENERAL_STYLES.navigationHeader,
                    GENERAL_STYLES.justifyCenter,
                    GENERAL_STYLES.defaultBorder,
                    GENERAL_STYLES.borderTopDisabled,
                    (primaryHeaderStyle) ? GENERAL_STYLES.grayBackgroundColor : GENERAL_STYLES.whiteBackgroundColor,
                    (primaryHeaderStyle) ? GENERAL_STYLES.defaultBorderWidth : GENERAL_STYLES.mediumBorderWidth
                ]}
            >
                <View style={[GENERAL_STYLES.navigationHeaderSideBalanceSpace, GENERAL_STYLES.alignStart]}>
                    <Pressable
                        hitSlop={10}
                        onPressIn={() => {
                            navigation.goBack()
                        }}
                    >
                        <Svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                            <Path
                                d="M7.75 15.5781L0.171875 8L7.75 0.421875L9.35938 2.01562L4.53906 6.83594H16.25V9.16406H4.53906L9.35938 13.9766L7.75 15.5781Z"
                                fill={primaryHeaderStyle ? colorWhite : colorBlack}
                            />
                        </Svg>
                    </Pressable>
                </View>
                <View style={[GENERAL_STYLES.flexGrow, GENERAL_STYLES.alignCenter, GENERAL_STYLES.justifyCenter]}>
                    <Text
                        numberOfLines={1}
                        style={[
                            GENERAL_STYLES.navigationHeaderText,
                            GENERAL_STYLES.textMedium,
                            (primaryHeaderStyle) ? GENERAL_STYLES.textWhite : GENERAL_STYLES.textBlack,
                        ]}
                    >
                        {title}
                    </Text>
                </View>
                <View style={[GENERAL_STYLES.navigationHeaderSideBalanceSpace]}></View>
            </View>
        </View>
    )
}