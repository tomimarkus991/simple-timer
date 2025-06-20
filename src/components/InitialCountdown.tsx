import { useEffect, useState } from "react";
import Animated, { FadeInDown, FadeOutUp, LinearTransition } from "react-native-reanimated";
import { P } from "./P";

interface Props {
  onCountdownFinish: () => void;
}

export const InitialCountdown = ({ onCountdownFinish }: Props) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count >= 0) {
      const timer = setTimeout(() => {
        setCount(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      onCountdownFinish();
    }
  }, [count]);

  const text = count < 0 ? null : count === 0 ? "GO!" : count.toString();

  return (
    <Animated.View
      key={text}
      entering={FadeInDown.duration(300)}
      exiting={FadeOutUp.duration(300)}
      layout={LinearTransition.springify()}
    >
      {text && <P className="font-bold text-center text-8xl">{text}</P>}
    </Animated.View>
  );
};
