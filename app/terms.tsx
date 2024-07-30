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
import esTranslations from '../locales/es.json';
import frTranslations from '../locales/fr.json';
import itTranslations from '../locales/it.json';
import deTranslations from '../locales/de.json';

export default function Terms() {
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
        <Text style={styles.sectionTitle}>{translations.terms}</Text>
        <Text style={styles.sectionSubtitle}>{translations.terms_prompt}</Text>
      </View>

      <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.goBack()}>
        <Text style={styles.createAccountText}>{translations.return}</Text>
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