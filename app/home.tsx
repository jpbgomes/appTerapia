import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, FlatList, ScrollView } from 'react-native';
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
import { Image } from 'react-native';


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
      getServicesData();
    }
  }, [tokenExists, emailVerified]);

  const getServicesData = async () => {
    console.log("CALLED");
    if (loading) return;

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('authToken');

      if (token) {
        const response = await axios.get(`${baseUrl}/api/getServices`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setSCategories(response.data.serviceCategories);
        // console.log(response.data.serviceCategories);
        // response.data.serviceCategories.forEach(category => {
        //   console.log(`Category: ${category.name}`); // Assuming `name` is a property of ServiceCategory
        //   console.log('Services:');
        //   category.services.forEach(service => {
        //     console.log(`- ${service.name}`); // Assuming `name` is a property of Service
        //   });
        // });
      }
    } catch (error) {
      console.log('Error fetching services data:', error);
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
            <TouchableOpacity style={styles.backView} onPress={handleLogout}>
              <TabBarIcon name='cloud-download-outline' style={styles.backIcon} />
            </TouchableOpacity>

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

      <View style={styles.homeContainer}>
        {tokenExists ? (
          !emailVerified ? (
            <>
              <TouchableOpacity style={styles.homeButton} onPress={handleEmailVerificationAlert}>
                <Text style={styles.homeText}>Verify Email</Text>
              </TouchableOpacity>

              {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
              {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.homeButton} onPress={getServicesData}>
                <Text style={styles.homeText}>MOSTRAR SERVIÇOS</Text>
              </TouchableOpacity>

              <ScrollView style={styles.scrollContainer}>
                {scategories.length > 0 ? (
                  scategories.map((category) => (
                    <View key={category.id} style={styles.categoryContainer}>
                      <View style={styles.subcategoryContainer}>
                        <Image source={{ uri: `${baseUrl}/${category.image_path}` }} style={styles.categoryImage} />
                        <Text style={styles.categoryName}>{translations[category.name]}</Text>
                      </View>

                      <View style={styles.serviceContainer}>
                        {category.services && category.services.length > 0 ? (
                          category.services.map((service) => (
                            <View key={service.id} style={styles.serviceItem}>
                              <Text style={styles.serviceName}>{translations[service.name]}</Text>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.noServices}>No services available.</Text>
                        )}
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyMessage}>No service categories available.</Text>
                )}
              </ScrollView>
            </>
          )
        ) : (
          <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('login')}>
            <Text style={styles.homeText}>DAR LOGIN</Text>
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
  homeContainer: {

  },
  homeButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 20,
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
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },

  // CATEGORIAS

  scrollContainer: {
    marginTop: 20,
  },
  categoryContainer: {
    marginVertical: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray.light,
    flexDirection: 'column',
  },
  subcategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: 'gray'
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceItem: {
    paddingVertical: 5,
  },
  serviceName: {
    fontSize: 16,
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
});