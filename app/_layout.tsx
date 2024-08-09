import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './home';
import LoginScreen from './login';
import RegisterScreen from './register';
import ForgotScreen from './forgot';
import ConfirmScreen from './confirm';
import TermsScreen from './terms';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { baseUrl, appVersion } from '@/setup';

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

const RETRY_DELAY = 2000; // 2 seconds delay

async function checkTokenExistence(retryCount = 0) {
  try {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      const response = await axios.get(`${baseUrl}/api/user/check-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return true;
      } else {
        await AsyncStorage.removeItem('authToken');
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    await AsyncStorage.removeItem('authToken');
    if (retryCount < 5) { // Retry up to 5 times
      await new Promise(res => setTimeout(res, RETRY_DELAY));
      return checkTokenExistence(retryCount + 1);
    } else {
      return false;
    }
  }
}

async function checkEmailVerification(retryCount = 0) {
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
    if (retryCount < 5) { // Retry up to 5 times
      await new Promise(res => setTimeout(res, RETRY_DELAY));
      return checkEmailVerification(retryCount + 1);
    }
  }
}

async function checkAppVersion(retryCount = 0) {
  try {
    const response = await axios.get(`${baseUrl}/api/version`);
    if (response.data.version === appVersion) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (retryCount < 5) { // Retry up to 5 times
      await new Promise(res => setTimeout(res, RETRY_DELAY));
      return checkAppVersion(retryCount + 1);
    } else {
      return false;
    }
  }
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [tokenExists, setTokenExists] = useState(false);
  const [versionValid, setVersionValid] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    const initialize = async () => {
      const tokenValid = await checkTokenExistence();
      setTokenExists(tokenValid);

      await checkEmailVerification(); // Email verification can be async but doesn't affect UI

      const appVersionValid = await checkAppVersion();
      if (appVersionValid) {
        setVersionValid(true);
        setLoadingMessage('');
      } else {
        setVersionValid(false);
        setLoadingMessage('Please update the app.');
      }
    };

    initialize();
  }, []);

  if (!loaded || versionValid === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{loadingMessage}</Text>
      </View>
    );
  }

  if (!versionValid) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{loadingMessage}</Text>
      </View>
    );
  }

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
