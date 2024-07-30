import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppLayout } from '@/layouts/app';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SmallLogo } from '@/components/SmallLogo';
import { Overlay } from '@rneui/themed';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

// Import translations
import enTranslations from '../locales/en.json';
import ptTranslations from '../locales/pt.json';
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';
import itTranslations from '../locales/it.json';
import deTranslations from '../locales/de.json';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { baseUrl } from '@/setup';

export default function Login() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [locale, setLocale] = useState('pt');
  const translations = {
    en: enTranslations,
    pt: ptTranslations,
    es: esTranslations,
    fr: frTranslations,
    it: itTranslations,
    de: deTranslations,
  }[locale];

  const [visible, setVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const authToken = await AsyncStorage.getItem('authToken');

      if (authToken) {
        setToken(authToken);
        navigation.navigate('home');
      }
    };

    const tokenCheckInterval = setInterval(checkToken, 1000);

    return () => clearInterval(tokenCheckInterval);
  }, []);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleLanguageChange = (selectedLocale: string) => {
    setLocale(selectedLocale);
    toggleOverlay();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const userData = {
        email: email,
        password: password,
        locale: locale,
      };

      const response = await axios.post(`${baseUrl}/api/login`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      await AsyncStorage.setItem('authToken', response.data.token);
      setToken(response.data.token);
      checkEmailVerification();

      navigation.navigate('home');
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        const errorMessage = data.errorMessage;

        if (status === 422 && errorMessage) {
          setErrorMessage(errorMessage);
        } else {
          setErrorMessage(translations.generic_error);
        }
      } else {
        setErrorMessage(translations.network_error);
      }
    } finally {
      setLoading(false);
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
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('es')}>
            <Text style={styles.languageText}>Español</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('fr')}>
            <Text style={styles.languageText}>Français</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('it')}>
            <Text style={styles.languageText}>Italiano</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.languageOption} onPress={() => handleLanguageChange('de')}>
            <Text style={styles.languageText}>Deutsch</Text>
          </TouchableOpacity>
        </View>
      </Overlay>

      <View style={styles.header}>
        <TouchableOpacity style={styles.backView} onPress={() => navigation.navigate('home')}>
          <TabBarIcon name='chevron-back-outline' style={styles.backIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backView} onPress={toggleOverlay}>
          <TabBarIcon name='language' style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <SmallLogo size={100} style={styles.logoIcon} />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{translations.login}</Text>
        <Text style={styles.sectionSubtitle}>{translations.login_prompt}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.email}</Text>
        <TextInput style={styles.inputField} placeholder={translations.enter_email} value={email} onChangeText={setEmail} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.password}</Text>
        <View style={styles.passwordInput}>
          <TextInput
            style={styles.inputFieldPassword}
            placeholder={translations.enter_password}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.visibilityToggle} onPress={togglePasswordVisibility}>
            <TabBarIcon name={passwordVisible ? 'eye-off' : 'eye'} style={styles.visibilityIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.passwordRecoveryLink} onPress={() => navigation.navigate('forgot')}>
        <Text style={styles.passwordRecoveryText}>{translations.recover_password}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.loginButtonText}>{translations.login_button}</Text>
        )}
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('register')}>
        <Text style={styles.createAccountText}>{translations.create_account}</Text>
      </TouchableOpacity>
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
  },
  sectionSubtitle: {
    fontSize: 15,
    color: Colors.gray.medium,
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

  loginButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
  },
  loginButtonText: {
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

  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },

  createAccountButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  createAccountText: {
    color: Colors.gray.normal,
    fontSize: 16,
  },
});
