import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
import { baseUrl } from '@/setup';
import axios from 'axios';

export default function Register() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [locale, setLocale] = useState('pt');
  const translations = locale === 'en' ? enTranslations : ptTranslations;

  const [visible, setVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleRegister = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const userData = {
        name: name,
        phone: phone,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
        locale: locale,
      };

      const response = await axios.post(`${baseUrl}/api/register`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      navigation.navigate('login');
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
        <TouchableOpacity style={styles.backView} onPress={() => navigation.navigate('home')}>
          <TabBarIcon name='chevron-back-outline' style={styles.backIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backView} onPress={toggleOverlay}>
          <TabBarIcon name='language' style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <SmallLogo size={100} style={styles.logoIcon} />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{translations.register}</Text>
        <Text style={styles.sectionSubtitle}>{translations.register_prompt}</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.name}</Text>
        <TextInput
          style={styles.inputField}
          placeholder={translations.enter_name}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.phone}</Text>
        <TextInput
          style={styles.inputField}
          placeholder={translations.enter_phone}
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.email}</Text>
        <TextInput
          style={styles.inputField}
          placeholder={translations.enter_email}
          value={email}
          onChangeText={setEmail}
        />
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
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <TabBarIcon name={passwordVisible ? 'eye-off' : 'eye'} style={styles.visibilityIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.password}</Text>
        <View style={styles.passwordInput}>
          <TextInput
            style={styles.inputFieldPassword}
            placeholder={translations.enter_password}
            secureTextEntry={!confirmPasswordVisible}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.visibilityToggle}
            onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          >
            <TabBarIcon name={confirmPasswordVisible ? 'eye-off' : 'eye'} style={styles.visibilityIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.termsLink} onPress={() => navigation.navigate('terms')}>
        <Text style={styles.termsText}>{translations.terms_link}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.registerButtonText}>{translations.register_button}</Text>
        )}
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      <TouchableOpacity style={styles.haveAccountButton} onPress={() => navigation.navigate('login')}>
        <Text style={styles.haveAccountText}>{translations.have_account}</Text>
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

  termsLink: {
    marginTop: 10,
    alignItems: 'center',
  },
  termsText: {
    color: Colors.blue.normal,
    fontSize: 16,
    textAlign: 'center',
  },

  registerButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
  },
  registerButtonText: {
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

  haveAccountButton: {
    marginTop: 30,
    alignItems: 'center',
  },
  haveAccountText: {
    color: Colors.gray.normal,
    fontSize: 16,
  },

  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
