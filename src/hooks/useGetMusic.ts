import { useAssets } from "expo-asset";
import { useAudioPlayer } from "expo-audio";
import { useMemo } from "react";

export function useGetMusic(location: number) {
  const [assets] = useAssets([location]);

  const uri = useMemo(() => {
    if (assets?.[0]?.localUri) {
      return assets[0].localUri;
    }
    return null;
  }, [assets]);

  const player = useAudioPlayer(uri ? { uri } : null);

  return player;
}
