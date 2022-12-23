import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes';

import AuthProvider from './src/contexts/auth';

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar backgroundColor="#36393F" barStyle="light-content" transLucent={false} />
        <Routes />
      </NavigationContainer>
    </AuthProvider>

  )
}