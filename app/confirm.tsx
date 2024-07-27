import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AppLayout } from '@/layouts/app';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SmallLogo } from '@/components/SmallLogo';
import { Overlay } from '@rneui/themed';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';

import enTranslations from '../locales/en.json';
import ptTranslations from '../locales/pt.json';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Define locale configurations
const localeConfigs = {
  en: {
    monthNames: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today'
  },
  pt: {
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
  }
};

export default function Confirm({ route }: any) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { selectedService, selectedTherapist } = route.params;

  console.log(selectedService, selectedTherapist);

  const [locale, setLocale] = useState('pt');
  const [monthNames, setMonthNames] = useState(localeConfigs[locale]);

  // Set locale config for the calendar
  useEffect(() => {
    LocaleConfig.locales['en'] = localeConfigs.en;
    LocaleConfig.locales['pt'] = localeConfigs.pt;
    LocaleConfig.defaultLocale = locale;
  }, [locale]);

  const [visible, setVisible] = useState(false);
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

  const handleLanguageChange = (selectedLocale: any) => {
    setLocale(selectedLocale);
    toggleOverlay();
  };

  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = (day: any) => {
    const date = new Date(day.timestamp);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
      Alert.alert("Unavailable", "Scheduling is only available from Monday to Friday.");
      return;
    }

    if (dayOfWeek === 6) {
      Alert.alert(
        "Special Attention",
        "To schedule on a Friday, please call the owner manually to confirm."
      );
      return;
    }

    setSelectedDate(day.dateString);
  };

  const markedDates = {
    ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: Colors.blue.normal } } : {}),
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
        <TouchableOpacity style={styles.backView} onPress={() => navigation.goBack()}>
          <TabBarIcon name='chevron-back-outline' style={styles.backIcon} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.backView} onPress={toggleOverlay}>
          <TabBarIcon name='language' style={styles.backIcon} />
        </TouchableOpacity>
      </View>

      <SmallLogo size={100} style={styles.logoIcon} />

      <Calendar
        current={'2024-07-01'}
        minDate={new Date().toISOString().split('T')[0]}
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        hideArrows={false}
        hideExtraDays={true}
        disableMonthChange={false}
        firstDay={1}
        markedDates={markedDates}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: Colors.gray.medium,
          selectedDayBackgroundColor: Colors.blue.normal,
          selectedDayTextColor: '#ffffff',
          todayTextColor: Colors.blue.normal,
          dayTextColor: Colors.gray.medium,
          textDisabledColor: '#d9e1e8',
          arrowColor: Colors.gray.medium,
          monthTextColor: Colors.gray.medium,
          indicatorColor: 'blue',
          textDayFontFamily: 'monospace',
          textMonthFontFamily: 'monospace',
          textDayHeaderFontFamily: 'monospace',
          textMonthFontWeight: 'bold',
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
        style={styles.calendar}
      />
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
  calendar: {
    marginTop: 50,
  },
});
