import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
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

export default function Home() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [locale, setLocale] = useState('pt');
  const translations = locale === 'en' ? enTranslations : ptTranslations;

  const [visible, setVisible] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [tokenExists, setTokenExists] = useState(false);
  const [tokenValue, setTokenValue] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [scategories, setSCategories] = useState([]);
  const [therapists, setTherapists] = useState([]);

  const [selectedService, setSelectedService] = useState(null);
  const [showTherapists, setShowTherapists] = useState(false);

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
        setTokenValue(token || '');

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

  useEffect(() => {
    if (tokenExists && emailVerified) {
      getGeneralData();
    }
  }, [tokenExists, emailVerified]);

  const getGeneralData = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        const response = await axios.get(`${baseUrl}/api/getData`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setSCategories(response.data.serviceCategories);
        setTherapists(response.data.therapists);
      }
    } catch (error: any) {
      if (error.response) {
        console.log('Response data:', error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setTokenValue('');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleEmailVerificationAlert = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const userData = {
        locale: locale,
      };

      const response = await axios.post(`${baseUrl}/api/verifyEmail`, userData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenValue}`,
        },
      });

      setErrorMessage('');
      setSuccessMessage(response.data.message);

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

  const handleServiceSelection = (service: any) => {
    setSelectedService(service);
    setShowTherapists(true);
  };

  const goBackToServices = () => {
    setSelectedService(null);
    setShowTherapists(false);
  };

  const handleTherapistSelection = (therapist: any) => {
    navigation.navigate('confirm', {
      selectedService: selectedService,
      selectedTherapist: therapist,
    });
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
        {tokenExists ? (
          <>
            {showTherapists ? (
              <TouchableOpacity style={styles.backView} onPress={goBackToServices}>
                <TabBarIcon name='arrow-back' style={styles.backIcon} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.backView} onPress={handleLogout}>
                <TabBarIcon name='cloud-download-outline' style={styles.backIcon} />
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.backView} onPress={toggleOverlay}>
              <TabBarIcon name='language' style={styles.backIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.backView} onPress={toggleOverlay}>
            <TabBarIcon name='language' style={styles.backIcon} />
          </TouchableOpacity>
        )}
      </View>

      <SmallLogo size={100} style={styles.logoIcon} />

      <View style={styles.homeContainer}>
        {tokenExists ? (
          !emailVerified ? (
            <>
              <TouchableOpacity style={styles.homeButton} onPress={handleEmailVerificationAlert}>
                <Text style={styles.homeText}>{translations.verifyEmail}</Text>
              </TouchableOpacity>

              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
            </>
          ) : (
            <>
              {showTherapists ? (
                <View style={styles.therapistsContainer}>
                  {therapists.length > 0 ? (
                    therapists.map((therapist) => (
                      <TouchableOpacity
                        key={therapist.id}
                        style={styles.therapistItem}
                        onPress={() => handleTherapistSelection(therapist)}
                      >
                        <View style={styles.therapistFirstItem}>
                          <Image
                            source={{ uri: therapist.user.image_path ? `${baseUrl}/${therapist.user.image_path}` : `${baseUrl}/assets/unknown.jpg` }}
                            style={styles.categoryImage}
                          />
                          <View style={styles.therapistSubItem}>
                            <Text style={styles.therapistName}>{therapist.user.name}</Text>
                            <Text style={styles.therapistYears}>{therapist.years_of_experience} {translations.yearsOfExperience}</Text>
                            <Text style={styles.therapistDescription}>{therapist.description}</Text>
                          </View>
                        </View>

                        <View style={styles.therapistSecondItem}>
                          <TouchableOpacity style={styles.therapistSelectButton} onPress={() => handleTherapistSelection(therapist)}>
                            <Text style={styles.therapistButtonText}>{translations.selectTherapist}</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>

                    ))
                  ) : (
                    <Text style={styles.emptyMessage}>{translations.noTherapists}</Text>
                  )}
                </View>
              ) : (
                <ScrollView style={styles.scrollContainer}>
                  {scategories.length > 0 ? (
                    scategories.map((category) => (
                      <View key={category.id} style={styles.categoryContainer}>
                        <View style={styles.subcategoryContainer}>
                          <Image
                            source={{ uri: category.image_path ? `${baseUrl}/${category.image_path}` : `${baseUrl}/assets/unknown.jpg` }}
                            style={styles.categoryImage}
                          />
                          <Text style={styles.categoryName}>
                            {translations[category.name]}
                          </Text>
                        </View>

                        <View style={styles.serviceContainer}>
                          {category.services && category.services.length > 0 ? (
                            category.services.map((service: any) => (
                              <TouchableOpacity
                                key={service.id}
                                style={styles.serviceItem}
                                onPress={() => handleServiceSelection(service)}
                              >
                                <Text style={styles.serviceName}>
                                  {translations[service.name] || service.name}
                                </Text>
                                <Text style={styles.serviceDescription}>
                                  {translations[service.description] || service.description}
                                </Text>

                                <View style={styles.serviceDetails}>
                                  <View style={styles.servicePriceDuration}>
                                    <Text style={styles.servicePrice}>
                                      {translations[service.price] || service.price}€
                                    </Text>

                                    <Text style={styles.serviceDuration}>
                                      {translations[service.duration] || service.duration} min
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ))
                          ) : (
                            <Text style={styles.noServices}>{translations.noServices}</Text>
                          )}
                        </View>
                      </View>
                    ))
                  ) : (
                    <Text style={styles.emptyMessage}>{translations.noCategories}</Text>
                  )}
                </ScrollView>
              )}
            </>
          )
        ) : (
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('login')}>
            <Text style={styles.homeText}>{translations.login_button}</Text>
          </TouchableOpacity>
        )}
      </View>
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
  logoIcon: {
    backgroundColor: Colors.blue.light,
    alignSelf: 'center',
    borderRadius: 1000,
    marginTop: 20,
  },
  homeContainer: {},
  homeButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 15,
  },
  homeText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emailVerificationContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  emailVerificationButton: {
    backgroundColor: Colors.blue.normal,
    padding: 15,
    borderRadius: 25,
  },
  emailVerificationText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  successMessage: {
    color: Colors.green.normal,
    textAlign: 'center',
    marginTop: 10,
  },
  scrollContainer: {
    marginTop: 20,
  },
  categoryContainer: {
    marginVertical: 30,
    padding: 10,
    flexDirection: 'column',
    borderRadius: 25,
    backgroundColor: Colors.gray.light,
  },
  subcategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: 'gray',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceContainer: {
    flexDirection: 'column',
    gap: 20,
  },
  serviceItem: {
    backgroundColor: Colors.blue.medium,
    padding: 10,
    borderRadius: 15,
  },
  serviceName: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  serviceDescription: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  servicePriceDuration: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 5,
  },
  servicePrice: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 15,
  },
  serviceDuration: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationIcon: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
  noServices: {
    fontSize: 14,
    color: Colors.gray.medium,
  },
  emptyMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.gray.medium,
  },
  therapistsContainer: {
    // padding: 10,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: Colors.blue.normal,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },

  therapistItem: {
    flexDirection: 'column',
    gap: 15,
    backgroundColor: Colors.gray.light,
    padding: 10,
    borderRadius: 15,
    marginTop: 30,
  },
  therapistFirstItem: {
    flexDirection: 'row',
    gap: 10,
  },

  therapistSecondItem: {
  },
  therapistSelectButton: {
    backgroundColor: Colors.blue.normal,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapistButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  therapistSubItem: {
    flexDirection: 'column',
    justifyContent: 'center',

  },
  therapistName: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  therapistYears: {

  },
  therapistDescription: {
    fontSize: 12,
  },
});
