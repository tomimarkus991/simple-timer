import React from "react";
import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { useCountdown } from "./useCountdown";
import { getWrapperStyle, timeStyle } from "./utils";
import type { Props } from "./types";

export const Timer = (props: Props) => {
  const { children, duration, strokeLinecap, trailColor, trailStrokeWidth } = props;
  const {
    path,
    pathLength,
    stroke,
    strokeDashoffset,
    remainingTime,
    elapsedTime,
    size,
    strokeWidth,
  } = useCountdown({
    ...props,
    colors: [
      "url(#blueGradient)",
      "url(#yellowGradient)",
      "url(#redGradient)",
      "url(#redGradient)",
    ],
  });

  return (
    <View style={getWrapperStyle(size) as StyleProp<ViewStyle>}>
      <Svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <Defs>
          <LinearGradient id="blueGradient" x1="1" y1="0" x2="0" y2="0">
            <Stop offset="0%" stopColor="#101759" />
            <Stop offset="100%" stopColor="#2a2c7d" />
          </LinearGradient>

          {/* 2. Yellow gradient from #F7B801 to something else yellow (example: #FFD700) */}
          <LinearGradient id="yellowGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#FFD700" />
            <Stop offset="100%" stopColor="#FF9800" />
          </LinearGradient>

          {/* 3. Red gradient from #A30000 to something else red (example: #FF4500) */}
          <LinearGradient id="redGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0%" stopColor="#66023c" />
            <Stop offset="100%" stopColor="#cd1c18" />
          </LinearGradient>
        </Defs>
        <Path
          d={path}
          fill="none"
          stroke={trailColor ?? "#d9d9d9"}
          strokeWidth={trailStrokeWidth ?? strokeWidth}
        />
        <Path
          d={path}
          fill="none"
          stroke={stroke}
          strokeLinecap={strokeLinecap ?? "round"}
          strokeWidth={strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      {typeof children === "function" && (
        <View style={timeStyle as StyleProp<ViewStyle>}>
          {children({ remainingTime, elapsedTime, color: stroke })}
        </View>
      )}
    </View>
  );
};
