import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './home';
import LoginScreen from './login';
import RegisterScreen from './register';
import ForgotScreen from './forgot';
import ConfirmScreen from './confirm';
import TermsScreen from './terms';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { baseUrl } from '@/setup';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="homeRaw"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="homeRaw" component={HomeScreen} />
      <Stack.Screen name="confirm" component={ConfirmScreen} />
    </Stack.Navigator>
  );
}

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

  const [tokenExists, setTokenExists] = useState(false);

  useEffect(() => {
    const checkTokenExistence = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          const response = await axios.get(`${baseUrl}/api/user/check-token`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          console.log(response.data);

          if (response.data.success) {
            setTokenExists(true);
          } else {
            await AsyncStorage.removeItem('authToken');
            setTokenExists(false);
          }
        } else {
          setTokenExists(false);
        }
      } catch (error) {
        console.log("TOKEN REMOVED");
        await AsyncStorage.removeItem('authToken');
        setTokenExists(false);
      }
    };

    const checkEmailVerification = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          const response = await axios.get(`${baseUrl}/api/user/check-email`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            await AsyncStorage.setItem('emailVerified', JSON.stringify(true));
          } else {
            await AsyncStorage.setItem('emailVerified', JSON.stringify(false));
          }
        }
      } catch (error) {
        await AsyncStorage.setItem('emailVerified', JSON.stringify(false));
      }
    };

    const intervalTokenExistence = setInterval(checkTokenExistence, 2500);
    const intervalEmailVerification = setInterval(checkEmailVerification, 5000);

    checkTokenExistence();
    checkEmailVerification();

    return () => {
      clearInterval(intervalTokenExistence);
      clearInterval(intervalEmailVerification);
    };
  }, []);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {!tokenExists && (
        <>
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
        </>
      )}

    </Tab.Navigator>
  );
}
