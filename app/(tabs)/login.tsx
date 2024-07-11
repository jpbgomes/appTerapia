import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { AppLayout } from '@/layouts/app';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { SmallLogo } from '@/components/SmallLogo';

export default function TabTwoScreen() {
  return (
    <AppLayout>
      <View style={styles.backView}>
        <TabBarIcon name='chevron-back-outline' style={styles.backIcon} />
      </View>

      <SmallLogo size={100} style={styles.logoIcon} />

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Login</Text>
        <Text style={styles.sectionSubtitle}>Faça login para continuar a usar a aplicação</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput style={styles.inputField} placeholder='Introduz o email'></TextInput>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordInput}>
          <TextInput style={styles.inputFieldPassword} placeholder='Introduz a password' />
          <TouchableOpacity style={styles.visibilityToggle}>
            <TabBarIcon name='eye' style={styles.visibilityIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.passwordRecoveryLink}>
        <Text style={styles.passwordRecoveryText}>Recuperar Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  backView: {
    width: 50,
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: Colors.gray.light,
    borderWidth: 2,
  },
  backIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoIcon: {
    backgroundColor: Colors.blue.light,
    alignSelf: 'center',
    borderRadius: 1000,
  },

  sectionContainer: {
    marginVertical: 40,
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
    gap: 5,

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
    fontSize: 16,
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
  },

  loginButton: {
    backgroundColor: Colors.blue.normal,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
