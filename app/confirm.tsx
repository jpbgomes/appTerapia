import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, TextInput, Switch } from 'react-native';
import { AppLayout } from '@/layouts/app';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SmallLogo } from '@/components/SmallLogo';
import { Overlay } from '@rneui/themed';
import { Calendar, LocaleConfig } from 'react-native-calendars';
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
  },
  es: {
    monthNames: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
    today: 'Hoy'
  },
  fr: {
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    today: 'Aujourd\'hui'
  },
  it: {
    monthNames: [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ],
    monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
    dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
    dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
    today: 'Oggi'
  },
  de: {
    monthNames: [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    dayNamesShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    today: 'Heute'
  }
};

export default function Confirm({ route }: any) {
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
  const [monthNames, setMonthNames] = useState(localeConfigs[locale]);

  const { selectedService, selectedTherapist } = route.params;

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState('');

  const [selectedDate, setSelectedDate] = useState('');
  const [showQuestionOverlay, setShowQuestionOverlay] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [recentSurgery, setRecentSurgery] = useState(false);
  const [takesMedication, setTakesMedication] = useState(false);
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    LocaleConfig.locales['en'] = localeConfigs.en;
    LocaleConfig.locales['pt'] = localeConfigs.pt;
    LocaleConfig.locales['es'] = localeConfigs.es;
    LocaleConfig.locales['fr'] = localeConfigs.fr;
    LocaleConfig.locales['it'] = localeConfigs.it;
    LocaleConfig.locales['de'] = localeConfigs.de;
    LocaleConfig.defaultLocale = locale;
  }, [locale]);

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

  const toggleQuestionOverlay = () => {
    setShowQuestionOverlay(!showQuestionOverlay);
  };

  const handleLanguageChange = (selectedLocale: any) => {
    setLocale(selectedLocale);
    toggleOverlay();
  };

  const onDayPress = (day: any) => {
    const date = new Date(day.timestamp);
    const dayOfWeek = date.getDay();

    if (dayOfWeek === 0) {
      Alert.alert(translations.unavailable, translations.scheduling_unavailable);
      return;
    }

    if (dayOfWeek === 6) {
      Alert.alert(
        translations.special_attention_title,
        translations.special_attention
      );
      return;
    }

    setSelectedDate(day.dateString);
    handleDay(day.dateString);
  };

  const handleDay = async (date: string) => {
    if (loading) return;

    try {
      setLoading(true);

      const requestData = {
        date: date,
        therapist: selectedTherapist,
        service: selectedService,
        locale: locale,
      };

      const response = await axios.post(`${baseUrl}/api/checkDay`, requestData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setErrorMessage('');
      setAvailableSlots(response.data.availableSlots);
    } catch (error: any) {
      if (error.response) {
        setAvailableSlots([]);
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

  const handleSlotPress = (slot: any) => {
    setSelectedSlot(slot);
    toggleQuestionOverlay();
  };

  const bookSlot = async () => {
    if (loading) return;

    if (!recentSurgery || !takesMedication || !customNote) {
      Alert.alert(translations.validation_error, translations.answer_all);
      return;
    }

    toggleQuestionOverlay();

    try {
      setLoading(true);

      const requestData = {
        locale: locale,
        slot: selectedSlot,
        date: selectedDate,
        time: selectedSlot?.start,
        therapist: selectedTherapist.id,
        service: selectedService.id,
        service_price: selectedService.price,
        any_recent_surgery: recentSurgery,
        use_medication: takesMedication,
        note: customNote,
      };

      const response = await axios.post(`${baseUrl}/api/bookSlot`, requestData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      setSelectedDate('');
      setSelectedSlot(null);
      setErrorMessage('');
      setRecentSurgery(false);
      setTakesMedication(false);
      setCustomNote('');

      Alert.alert(translations.success, translations.booked_success);
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

  const markedDates = {
    ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: Colors.blue.normal } } : {}),
  };

  return (
    <AppLayout>
      {/* Language Overlay */}
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

      {/* Questions Overlay */}
      <Overlay isVisible={showQuestionOverlay} onBackdropPress={toggleQuestionOverlay} overlayStyle={styles.overlayMainContainer}>
        <View style={styles.overlayContainer}>
          <Text style={styles.overlayLabel}>{translations.recent_surgery}</Text>
          <Switch
            value={recentSurgery}
            onValueChange={(value) => setRecentSurgery(value)}
          />
          <Text style={styles.overlayLabel}>{translations.medication}</Text>
          <Switch
            value={takesMedication}
            onValueChange={(value) => setTakesMedication(value)}
          />
          <Text style={styles.overlayLabel}>{translations.custom_note}</Text>
          <TextInput
            style={[styles.textInput, { height: 100 }]}
            multiline
            value={customNote}
            onChangeText={(text) => setCustomNote(text)}
          />
          <TouchableOpacity style={styles.submitButton} onPress={bookSlot}>
            <Text style={styles.submitButtonText}>{translations.confirm_booking}</Text>
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
        // current={'2024-07-01'}
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

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.blue.normal} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {availableSlots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={styles.slotButton}
              onPress={() => handleSlotPress(slot)}
            >
              <Text style={styles.slotText}>{`${slot.start} - ${slot.end}`}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 30,
  },
  scrollView: {
    marginTop: 50,
    paddingHorizontal: 20,
  },
  slotButton: {
    backgroundColor: Colors.blue.normal,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  slotText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  inputContainer: {
    marginBottom: 20,
  },
  overlayLabel: {
    fontSize: 16,
    marginVertical: 5,
  },
  textInput: {
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
  submitButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
    width: '100%',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
