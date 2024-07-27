/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  gray: {
    light: '#edf1f7',
    normal: 'rgb(85, 85, 85)',
    medium: 'rgba(100, 100, 100, 1.0)',
  },
  blue: {
    light: '#f1f6ff',
    normal: '#0265ff',
    medium: 'rgba(0, 82, 255, 0.75)',
  },
  green: {
    normal: 'rgb(22 163 74)',
  }
};
