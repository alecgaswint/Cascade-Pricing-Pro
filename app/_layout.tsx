import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AuthNavigator from '../src/navigation/AuthStack';
import MainTabs from '../src/navigation/MainTabs';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const AppLayout = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppLayout;
