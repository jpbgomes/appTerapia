import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AppLayout } from '@/layouts/app';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SmallLogo } from '@/components/SmallLogo';
import { Overlay } from '@rneui/themed';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

import enTranslations from '../locales/en.json';
import ptTranslations from '../locales/pt.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [locale, setLocale] = useState('pt');
  const translations = locale === 'en' ? enTranslations : ptTranslations;

  const [visible, setVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [tokenExists, setTokenExists] = useState(false);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleLanguageChange = (selectedLocale: string) => {
    setLocale(selectedLocale);
    toggleOverlay();
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        setTokenExists(!!token);

        const emailVerifiedValue = await AsyncStorage.getItem('emailVerified');
        setEmailVerified(emailVerifiedValue === 'true');
      } catch (error) {
        console.error('Error fetching auth status:', error);
      }
    };

    checkAuthStatus();

    const interval = setInterval(checkAuthStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEmailVerificationAlert = () => {
    Alert.alert("A");
  };

  return (
    <AppLayout>
      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={styles.overlayMainContainer}>
        <View style={styles.overlayContainer}>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('en')}>
            <Text style={styles.languageText}>English</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('pt')}>
            <Text style={styles.languageText}>Português</Text>
          </TouchableOpacity>
        </View>
      </Overlay>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backView} onPress={handleLogout}>
          <TabBarIcon name='cloud-download-outline' style={styles.backIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backView} onPress={toggleOverlay}>
          <TabBarIcon name='language' style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      {tokenExists ? (
        !emailVerified ? (
          <View style={styles.emailVerificationContainer}>
            <TouchableOpacity style={styles.emailVerificationButton} onPress={handleEmailVerificationAlert}>
              <Text style={styles.emailVerificationText}>Verify Email</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity>
            <Text>É VERIFICADO</Text>
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity>
          <Text>DAR LOGIN</Text>
        </TouchableOpacity>
      )}


    </AppLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  backView: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: Colors.gray.light,
    borderWidth: 2,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.gray.medium,
  },

  logoIcon: {
    backgroundColor: Colors.blue.light,
    alignSelf: 'center',
    borderRadius: 1000,
    marginTop: 20,
  },

  sectionContainer: {
    marginVertical: 40,
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionSubtitle: {
    marginTop: 10,
    fontSize: 15,
    color: Colors.gray.medium,
    textAlign: 'center',
  },

  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputLabel: {
    fontSize: 18,
    marginBottom: 5,
  },
  inputField: {
    height: 50,
    fontSize: 16,
    borderColor: Colors.gray.light,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 25,
    width: '100%',
    backgroundColor: Colors.gray.light,
  },

  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    fontSize: 16,
    borderColor: Colors.gray.light,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 25,
    width: '100%',
    backgroundColor: Colors.gray.light,
  },
  inputFieldPassword: {
    flex: 1,
    height: 40,
    borderColor: Colors.gray.light,
    borderWidth: 1,
    borderRadius: 5,
  },
  visibilityToggle: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    paddingHorizontal: 5,
  },
  visibilityIcon: {
    fontSize: 24,
    color: Colors.gray.medium,
  },

  passwordRecoveryLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  passwordRecoveryText: {
    color: Colors.blue.normal,
    fontSize: 16,
    textAlign: 'center',
  },

  termsButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
  },
  termsButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  overlayMainContainer: {
    padding: 20,
    borderRadius: 15,
    width: '85%',
    maxHeight: '70%',
  },
  overlayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageOption: {
    paddingVertical: 10,
  },
  languageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.blue.normal,
  },

  createAccountButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
  },
  createAccountText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
