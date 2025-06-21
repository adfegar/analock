import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { G, Line, Svg, Text } from "react-native-svg";
import { ActivityRegistration } from "../services/activityRegistrations.services";
import {
  emptyDateTime,
  getDayOfWeekTranslation,
  getFirstDayOfWeekMonday,
  getFirstDayOfWeekSunday,
} from "../utils/date.utils";
import { AnimatedChartBar } from "./AnimatedChartBar";
import { TranslationsContext } from "../contexts/translationsContext";
import { SettingsContext } from "../contexts/settingsContext";
import { DAY_OF_WEEK_SUNDAY } from "../constants/constants";

interface ChartData {
  label: string;
  value: number;
}

interface WeeklyActivityChartProps {
  userRegistrations: ActivityRegistration[];
}

const Y_AXIS_MAX_SCORE = 5;
const Y_AXIS_TICKS = Array.from({ length: Y_AXIS_MAX_SCORE + 1 }, (_, i) => i);

export const WeeklyActivityChart: React.FC<WeeklyActivityChartProps> = ({
  userRegistrations,
}) => {
  const height = 200;
  const padding = 20;
  const barSpacing = 10;
  const yAxisLabelFontSize = 8;
  const labelFontSize = 10;
  const textAndGridColor = "gray";
  const barColor = "black";
  const [weeklyChartActivityData, setWeeklyChartActivityData] = useState<
    ChartData[]
  >([]);
  const [width, setWidth] = useState<number>(0);
  const translations = useContext(TranslationsContext)?.translations;
  const settings = useContext(SettingsContext)?.settings;
  const numBars = weeklyChartActivityData.length;
  const chartHeight = height - padding * 2;
  const scaleY = chartHeight / Y_AXIS_MAX_SCORE;
  const chartWidth = width - padding * 2;
  const barWidth = (chartWidth - (numBars - 1) * barSpacing) / numBars;

  // Hook to load user's weekly activity
  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfWeek =
      settings?.preferences.firstDayOfWeek === DAY_OF_WEEK_SUNDAY
        ? getFirstDayOfWeekSunday(currentDate)
        : getFirstDayOfWeekMonday(currentDate);
    const firstDayOfWeekDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      firstDayOfWeek,
    );
    const lastDayOfWeekDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      firstDayOfWeekDate.getDate() + 6,
    );

    if (firstDayOfWeek < 0) {
      lastDayOfWeekDate.setMonth(lastDayOfWeekDate.getMonth() - 1);
    }

    const chartData: ChartData[] = [];

    for (let i = firstDayOfWeek; i < firstDayOfWeek + 7; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i,
      );
      emptyDateTime(date);
      const dateUserRegistrations = userRegistrations.filter(
        (userRegistration) =>
          userRegistration.registration.registrationDate === date.valueOf(),
      );
      chartData.push({
        label: getDayOfWeekTranslation(date.getDay(), translations!)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .substring(0, 3),
        value: dateUserRegistrations.length,
      });
    }
    setWeeklyChartActivityData(chartData);
  }, [userRegistrations, settings]);

  return (
    <View
      style={[{ width: "100%", height }]}
      onLayout={(event) => {
        setWidth(event.nativeEvent.layout.width);
      }}
    >
      <Svg width={width} height={height}>
        <G x={20} y={20}>
          {Y_AXIS_TICKS.map((tickValue) => {
            const yPos = chartHeight - tickValue * scaleY;

            return (
              <G key={`y-tick-${tickValue}`}>
                <Line
                  x1={0}
                  y1={yPos}
                  x2={chartWidth}
                  y2={yPos}
                  stroke={textAndGridColor}
                  strokeWidth="0.5"
                />
                <Text
                  x={-8}
                  y={yPos + yAxisLabelFontSize * 0.35}
                  fontSize={yAxisLabelFontSize}
                  fill={textAndGridColor}
                  textAnchor="end"
                >
                  {tickValue}
                </Text>
              </G>
            );
          })}

          {weeklyChartActivityData.map((item, index) => {
            const clampedValue = Math.min(
              Math.max(item.value, 0),
              Y_AXIS_MAX_SCORE,
            );
            const barHeightValue = clampedValue * scaleY;
            const x = index * (barWidth + barSpacing);
            return (
              <G key={`${item.label}-${index}`}>
                <AnimatedChartBar
                  x={x}
                  yBase={chartHeight}
                  width={barWidth}
                  targetHeight={barHeightValue}
                  color={barColor}
                  delay={0}
                  duration={1000}
                  rx={2}
                  ry={2}
                />
                <Text
                  x={x + barWidth / 2}
                  y={chartHeight + labelFontSize + 5}
                  fontSize={labelFontSize}
                  fill={textAndGridColor}
                  fontFamily={"Inter"}
                  textAnchor="middle"
                >
                  {item.label}
                </Text>
              </G>
            );
          })}
        </G>
      </Svg>
    </View>
  );
};
