import Entypo from "@expo/vector-icons/Entypo";
import { View } from "react-native";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { P } from "./P";

interface Props {
  remainingTime: number;
}
export const Countdown = ({ remainingTime }: Props) => {
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <View className="flex-row items-center justify-center flex-1 overflow-hidden">
      <Animated.View
        key={`${Math.floor(remainingTime / 60)}`}
        entering={FadeInDown.duration(300)}
        exiting={FadeOutUp.duration(300)}
        layout={LinearTransition.springify()}
      >
        <P className="w-32 text-center text-white text-7xl">
          {pad(Math.floor(remainingTime / 60))}
        </P>
      </Animated.View>
      <Entypo className="-mx-2" name="dots-two-vertical" size={34} color="white" />
      <Animated.View
        key={`${Math.floor(remainingTime / 60)} + ${remainingTime % 60}`}
        entering={FadeInDown.duration(300)}
        exiting={FadeOutUp.duration(300)}
        layout={LinearTransition.springify()}
      >
        <P className="w-32 text-center text-white text-7xl">{pad(remainingTime % 60)}</P>
      </Animated.View>
    </View>
  );
};
