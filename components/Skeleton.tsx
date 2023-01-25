import { Animated, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRef } from "react";

interface SkeletonProps {
  width: number;
  height: number;
  borderRadius: 0;
  backGround: string;
  opacityMin: number;
  opacityMax: number;
  speedUp: number;
  speedDown: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius, backGround, opacityMax, opacityMin, speedDown, speedUp }) => {
  const s = (a, b) => a != null ? a : b
  
  const opy = useRef(new Animated.Value(s(opacityMin, .3)));

  

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opy.current, {
          toValue: s(opacityMax, 1),
          useNativeDriver: true,
          duration: s(speedUp, 700),
        }),
        Animated.timing(opy.current, {
          toValue: s(opacityMin, 0.3),
          useNativeDriver: true,
          duration: s(speedDown, 800),
        }),
      ], ),
      {
        iterations: 500
      }
    ).start();
  }, [opy]);

  return (
    <Animated.View
      style={{
        opacity: opy.current,
        width: width,
        height: height,
        borderRadius: borderRadius,
        backgroundColor: s(backGround, "#404040"),
      }}
    />
  );
};

export default Skeleton;
