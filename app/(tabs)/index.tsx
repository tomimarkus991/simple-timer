import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaskedView from "@react-native-masked-view/masked-view";
import clsx from "clsx";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Pressable, StyleProp, Text, View, ViewStyle } from "react-native";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TimerPicker } from "react-native-timer-picker";
import { P } from "../../src/components/P";
import { Timer } from "../../src/components/timer/Timer";
import { useCountdown } from "../../src/components/timer/useCountdown";
import Svg, { Path } from "react-native-svg";
import { getWrapperStyle, timeStyle } from "../../src/components/timer/utils";

const audioSource = require("../../assets/sounds/ending4s.mp3");

export default function TabOneScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [userSetDuration, setUserSetDuration] = useState(0);
  const [dynamicColors, setDynamicColors] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);

  const [restartKey, setRestartKey] = useState(Math.random());
  const player = useAudioPlayer(audioSource);

  const pickerFeedback = useCallback(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      console.warn("Picker feedback failed");
    }
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  // 300 sek  70% lilla 20% kollane 8% punane
  //          210 sek   60          24

  useEffect(() => {
    const mainColor = userSetDuration * 0.7;
    const secondColor = userSetDuration * 0.2;
    const lastColor = userSetDuration * 0.08;

    setDynamicColors([mainColor, secondColor, lastColor, 0]);
  }, [userSetDuration]);

  const renderTime = ({ remainingTime }: any) => {
    if (remainingTime === 4) {
      player.play();
    }

    return (
      <View style={timeStyle as StyleProp<ViewStyle>}>
        {isPlaying ? (
          <View className="flex-row items-center justify-center flex-1 overflow-hidden">
            <Animated.View
              key={`${Math.floor(remainingTime / 60)}`}
              entering={FadeInDown.duration(300)}
              exiting={FadeOutUp.duration(300)}
              layout={LinearTransition.springify()}
            >
              <Text className="w-32 text-center text-white text-7xl">
                {pad(Math.floor(remainingTime / 60))}
              </Text>
            </Animated.View>
            <Entypo className="-mx-2" name="dots-two-vertical" size={34} color="white" />
            <Animated.View
              key={`${Math.floor(remainingTime / 60)} + ${remainingTime % 60}`}
              entering={FadeInDown.duration(300)}
              exiting={FadeOutUp.duration(300)}
              layout={LinearTransition.springify()}
            >
              <Text className="w-32 text-center text-white text-7xl">
                {pad(remainingTime % 60)}
              </Text>
            </Animated.View>
          </View>
        ) : (
          <Animated.View
            key="timepicker"
            entering={FadeInDown.duration(300)}
            exiting={FadeOutUp.duration(300)}
            layout={LinearTransition.springify()}
          >
            <TimerPicker
              onDurationChange={({ minutes, seconds }) => {
                setTimerDuration(minutes * 60 + seconds);
              }}
              hideHours
              secondInterval={10}
              decelerationRate={0}
              initialValue={{ minutes: 3 }}
              minuteLabel={<P className="pl-2 text-2xl font-bold text-center">m</P>}
              secondLabel={<P className="text-2xl font-bold text-center">s</P>}
              maximumMinutes={10}
              maximumSeconds={50}
              pickerFeedback={pickerFeedback}
              LinearGradient={LinearGradient}
              MaskedView={MaskedView}
              styles={{
                theme: "dark",
                backgroundColor: "transparent", // transparent fade-out
                pickerItem: {
                  fontSize: 42,
                },
                pickerContainer: {
                  marginRight: 6,
                },
                pickerItemContainer: {
                  width: 110,
                },
                pickerLabelContainer: {
                  right: -4,
                  top: 30,
                  bottom: 6,
                  width: 40,
                  alignItems: "center",
                },
              }}
            />
          </Animated.View>
        )}
      </View>
    );
  };

  const { width } = Dimensions.get("screen");

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="items-center justify-center flex-1">
          <Timer
            key={restartKey}
            isPlaying
            duration={userSetDuration}
            colors={["#2A2B88", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={dynamicColors}
            size={width - 20}
            strokeWidth={30}
            trailColor={"#151D64"}
            strokeLinecap={"butt"}
            isSmoothColorTransition={false}
          >
            {renderTime}
          </Timer>

          <Pressable
            className={clsx(
              "mt-12",
              "py-8 px-6 h-32 rounded-lg w-28",
              "inline-flex items-center justify-center",
              "border-b-[6px]",
              "transition-all duration-300",
              "active:translate-y-[0.2rem] active:duration-75 active:border-[#2A2B88]",
              "bg-[#2A2B88] text-[#f3f2f0] border-[#151D64]",
              "disabled:opacity-60"
            )}
            disabled={timerDuration ? false : true}
            onPress={() => {
              if (!isPlaying) {
                setUserSetDuration(timerDuration);
              } else {
                setUserSetDuration(0);
              }

              setIsPlaying(_isPlaying => !_isPlaying);
              setRestartKey(Math.random());
            }}
          >
            {isPlaying ? (
              <MaterialCommunityIcons name="reload" size={42} color="white" />
            ) : (
              <FontAwesome name="play" size={24} color="white" />
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
