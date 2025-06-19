import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome5";
import MaskedView from "@react-native-masked-view/masked-view";
import clsx from "clsx";
import { useAudioPlayer } from "expo-audio";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TimerPicker } from "react-native-timer-picker";
import { P } from "../../src/components/P";
import { Timer } from "../../src/components/timer/Timer";

const audioSource = require("../../assets/sounds/ending4s.mp3");

export default function TabOneScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [userSetDuration, setUserSetDuration] = useState(300);
  const [timerRemainingTime, setTimerRemainingTime] = useState(0);
  const [dynamicColors, setDynamicColors] = useState<[number, number, number, number]>([
    0, 0, 0, 0,
  ]);
  const player = useAudioPlayer(audioSource);

  const pickerFeedback = useCallback(() => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      console.warn("Picker feedback failed");
    }
  }, []);

  const { width } = Dimensions.get("window");
  const pad = (n: number) => n.toString().padStart(2, "0");

  console.log("duratinon", duration);

  // 300 sek  70% lilla 20% kollane 8% punane
  //          210 sek   60          24

  useEffect(() => {
    const mainColor = userSetDuration * 0.7;
    const secondColor = userSetDuration * 0.2;
    const lastColor = userSetDuration * 0.08;

    setDynamicColors([mainColor, secondColor, lastColor, 0]);
  }, [userSetDuration]);

  useEffect(() => {
    if (timerRemainingTime === 4) {
      player.play();
    }
  }, [timerRemainingTime]);

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
        <View className="items-center justify-center flex-1">
          <Timer
            isPlaying={isPlaying}
            duration={userSetDuration}
            colors={["#2A2B88", "#F7B801", "#A30000", "#A30000"]}
            colorsTime={dynamicColors}
            size={width - 20}
            strokeWidth={30}
            trailColor="#151D64"
            strokeLinecap="butt"
          >
            {({ remainingTime }) => {
              setTimerRemainingTime(remainingTime);
              console.log("remainingTime", remainingTime);

              const minutes = Math.floor(remainingTime / 60);
              const seconds = remainingTime % 60;

              console.log(minutes, ":", seconds);

              if (isPlaying) {
                return (
                  <View className="flex-row items-center justify-center flex-1 overflow-hidden">
                    <Animated.View
                      key={minutes}
                      entering={FadeInDown.duration(300)}
                      exiting={FadeOutUp.duration(300)}
                      layout={LinearTransition.springify()}
                    >
                      <Text className="w-32 text-center text-white text-7xl">{pad(minutes)}</Text>
                    </Animated.View>
                    <Entypo className="-mx-2" name="dots-two-vertical" size={34} color="white" />
                    <Animated.View
                      key={`${minutes} + ${seconds}`}
                      entering={FadeInDown.duration(300)}
                      exiting={FadeOutUp.duration(300)}
                      layout={LinearTransition.springify()}
                    >
                      <Text className="w-32 text-center text-white text-7xl">{pad(seconds)}</Text>
                    </Animated.View>
                  </View>
                );
              }

              return (
                <Animated.View
                  key="timepicker"
                  entering={FadeInDown.duration(300)}
                  exiting={FadeOutUp.duration(300)}
                  layout={LinearTransition.springify()}
                >
                  <TimerPicker
                    onDurationChange={({ minutes, seconds }) => {
                      // console.log(minutes, " : ", seconds);
                      setDuration(minutes * 60 + seconds);
                    }}
                    hideHours
                    secondInterval={5}
                    decelerationRate={0}
                    minuteLabel={<P className="pl-2 text-2xl font-bold text-center">m</P>}
                    secondLabel={<P className="text-2xl font-bold text-center">s</P>}
                    maximumMinutes={10}
                    maximumSeconds={55}
                    initialValue={{ seconds: timerRemainingTime || 300 }}
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
              );
            }}
          </Timer>
          <Pressable
            className={clsx(
              "mt-12",
              "py-8 px-4 rounded-lg w-24",
              "inline-flex items-center justify-center",
              "border-b-[6px]",
              "transition-all duration-300",
              "active:translate-y-[0.2rem] active:duration-75 active:border-[#2A2B88]",
              "bg-[#2A2B88] text-[#f3f2f0] border-[#151D64]"
            )}
            onPress={() => {
              setUserSetDuration(duration);
              // if (isPlaying) {
              //   setTimerRemainingTime()
              // }
              setIsPlaying(_isPlaying => !_isPlaying);
            }}
          >
            <P className="text-xl">
              {isPlaying ? (
                <FontAwesome name="pause" size={24} color="white" />
              ) : (
                <FontAwesome name="play" size={24} color="white" />
              )}
            </P>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
