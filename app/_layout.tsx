import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './home';
import LoginScreen from './login';
import RegisterScreen from './register';
import ForgotScreen from './forgot';
import TermsScreen from './terms';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function LoginStack() {
  return (
    <Stack.Navigator
      initialRouteName="loginRaw"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="loginRaw" component={LoginScreen} />
      <Stack.Screen name="forgot" component={ForgotScreen} />
    </Stack.Navigator>
  );
}

function RegisterStack() {
  return (
    <Stack.Navigator
      initialRouteName="registerRaw"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="registerRaw" component={RegisterScreen} />
      <Stack.Screen name="terms" component={TermsScreen} />
    </Stack.Navigator>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="login"
        component={LoginStack}
        options={{
          tabBarLabel: 'Login',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="log-in-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="register"
        component={RegisterStack}
        options={{
          tabBarLabel: 'Register',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="person-add-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
