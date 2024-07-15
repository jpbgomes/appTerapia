import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AppLayout } from '@/layouts/app';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SmallLogo } from '@/components/SmallLogo';
import { Overlay } from '@rneui/themed';

import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

import enTranslations from '../locales/en.json';
import ptTranslations from '../locales/pt.json';

export default function Register() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [locale, setLocale] = useState('pt');
  const translations = locale === 'en' ? enTranslations : ptTranslations;

  const [visible, setVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);


  const toggleOverlay = () => {
    setVisible(!visible);
  };

  const handleLanguageChange = (selectedLocale: string) => {
    setLocale(selectedLocale);
    toggleOverlay();
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
        <TextInput style={styles.inputField} placeholder={translations.enter_name} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.phone}</Text>
        <TextInput style={styles.inputField} placeholder={translations.enter_phone} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.email}</Text>
        <TextInput style={styles.inputField} placeholder={translations.enter_email} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{translations.password}</Text>
        <View style={styles.passwordInput}>
          <TextInput
            style={styles.inputFieldPassword}
            placeholder={translations.enter_password}
            secureTextEntry={!passwordVisible}
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

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerButtonText}>{translations.register_button}</Text>
      </TouchableOpacity>

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
});
