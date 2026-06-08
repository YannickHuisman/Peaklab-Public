import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';

export function HelloWave() {
  const rotation = useSharedValue(0);
  const color = useThemeColor({}, 'text');

  rotation.value = withRepeat(
    withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
    4 // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <IconSymbol name="hand.wave.fill" size={28} color={color} />
    </Animated.View>
  );
}
