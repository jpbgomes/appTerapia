import { Image, ImageStyle, StyleProp } from "react-native";
import React from "react";

type Props = {
  size?: number | string;
  style?: StyleProp<ImageStyle>;
};

export function SmallLogo({ size = '20%', style }: Props) {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={[{ width: size, height: size }, style]}
    />
  );
}
