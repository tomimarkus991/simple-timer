import FontAwesome from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaskedView from "@react-native-masked-view/masked-view";
import clsx from "clsx";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Pressable, StyleProp, View, ViewStyle } from "react-native";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TimerPicker } from "react-native-timer-picker";
import { Countdown } from "../../src/components/Countdown";
import { InitialCountdown } from "../../src/components/InitialCountdown";
import { P } from "../../src/components/P";
import { Timer } from "../../src/components/timer/Timer";
import { timeStyle } from "../../src/components/timer/utils";
import Toast from "react-native-toast-message";

const ending = require("../../assets/sounds/ending4s.mp3");
const start = require("../../assets/sounds/start.mp3");

export default function TabOneScreen() {
  const { width } = Dimensions.get("screen");

  const [isPlaying, setIsPlaying] = useState(false);
  const [timerDuration, setTimerDuration] = useState(0);
  const [userSetDuration, setUserSetDuration] = useState(0);
  const [isCountdownEnabled, setIsCountdownEnabled] = useState(false);
  const [startInitialCountdown, setStartInitialCountdown] = useState(false);
  const [isLoopingEnabled, setIsLoopingEnabled] = useState(false);
  const [dynamicColors, setDynamicColors] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);

  const lastUserSetDurationMinutesRef = useRef(0);
  const lastUserSetDurationSecondsRef = useRef(0);

  const [restartKey, setRestartKey] = useState(Math.random());
  const endingPlayer = useAudioPlayer(ending);
  const startPlayer = useAudioPlayer(start);

  const pickerFeedback = useCallback(() => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch {
      console.warn("Picker feedback failed");
    }
  }, []);

  useEffect(() => {
    const mainColor = userSetDuration * 0.7;
    const secondColor = userSetDuration * 0.2;
    const lastColor = userSetDuration * 0.08;

    setDynamicColors([mainColor, secondColor, lastColor, 0]);
  }, [userSetDuration]);

  const renderTime = ({ remainingTime }: any) => {
    console.log(remainingTime);

    if (remainingTime === 4) {
      endingPlayer.seekTo(0);
      endingPlayer.play();
    }

    return (
      <View style={timeStyle as StyleProp<ViewStyle>}>
        {isCountdownEnabled && startInitialCountdown ? (
          <InitialCountdown
            onCountdownFinish={() => {
              setStartInitialCountdown(false);
              setIsPlaying(true);
            }}
          />
        ) : isPlaying ? (
          <Countdown remainingTime={remainingTime} />
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
              initialValue={{
                minutes:
                  lastUserSetDurationSecondsRef.current === 0
                    ? 3
                    : lastUserSetDurationMinutesRef.current,
                seconds: lastUserSetDurationSecondsRef.current || 0,
              }}
              minuteLabel={<P className="pl-2 text-2xl font-bold text-center">m</P>}
              secondLabel={<P className="text-2xl font-bold text-center">s</P>}
              maximumMinutes={10}
              maximumSeconds={50}
              pickerFeedback={pickerFeedback}
              LinearGradient={LinearGradient}
              MaskedView={MaskedView}
              styles={{
                theme: "dark",
                backgroundColor: "transparent",
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

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="flex-row items-end justify-between mt-5 mx-7">
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

              Toast.show({
                type: "success",
                text1: `Looping ${isLoopingEnabled ? "Disabled" : "Enabled"}`,
                position: "top",
                topOffset: 80,
                visibilityTime: 1000,
              });

              setIsLoopingEnabled(_prev => !_prev);
            }}
          >
            {isLoopingEnabled ? (
              <MaterialCommunityIcons name="repeat" size={42} color="white" />
            ) : (
              <MaterialCommunityIcons name="repeat-off" size={42} color="white" />
            )}
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

              Toast.show({
                type: "success",
                text1: `Countdown ${isCountdownEnabled ? "Disabled" : "Enabled"}`,
                position: "top",
                topOffset: 80,
                visibilityTime: 1000,
              });
              setIsCountdownEnabled(_prev => !_prev);
            }}
          >
            {isCountdownEnabled ? (
              <MaterialCommunityIcons name="timer" size={42} color="white" />
            ) : (
              <MaterialCommunityIcons name="timer-off" size={42} color="white" />
            )}
          </Pressable>
        </View>

        <View className="items-center justify-center flex-1 -mt-5">
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
            updateInterval={1}
            onComplete={() => {
              if (isLoopingEnabled) {
                setRestartKey(Math.random());
                return { shouldRepeat: true };
              } else {
                setRestartKey(Math.random());
                setUserSetDuration(0);
                setIsPlaying(false);
              }
            }}
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

              if (!isPlaying) {
                const minutes = Math.floor(timerDuration / 60);
                const seconds = timerDuration % 60;

                console.log(timerDuration, minutes, ":", seconds);

                lastUserSetDurationMinutesRef.current = minutes;
                lastUserSetDurationSecondsRef.current = seconds;

                if (isCountdownEnabled) {
                  setStartInitialCountdown(true);
                  setTimeout(() => {
                    setUserSetDuration(timerDuration);

                    setIsPlaying(true);
                  }, 4000);
                  setTimeout(() => {
                    startPlayer.seekTo(0);
                    startPlayer.play();
                  }, 3300);
                } else {
                  setUserSetDuration(timerDuration);
                  setIsPlaying(true);
                }
              } else {
                setUserSetDuration(0);
                setIsPlaying(false);
                setRestartKey(Math.random());
              }
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
