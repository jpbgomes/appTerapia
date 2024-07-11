import { ScrollView, SafeAreaView, Platform, StyleSheet } from 'react-native';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export function AppLayout({ children }: Props) {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.container}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    paddingTop: 40,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
  },
  container: {
    flexDirection: 'column',
    alignSelf: 'center',
    width: '90%',
    // height: '100%',
    // backgroundColor: 'green',
  },
});