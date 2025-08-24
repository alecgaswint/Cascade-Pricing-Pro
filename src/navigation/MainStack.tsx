import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import MaterialsScreen from '../screens/Main/MaterialsScreen';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Materials"
        component={MaterialsScreen}
        options={{ title: 'Manage Materials' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
