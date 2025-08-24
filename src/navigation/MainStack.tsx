import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import MaterialManager from '../screens/Admin/MaterialManager';
import ServiceManager from '../screens/Admin/ServiceManager';

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
        name="MaterialManager"
        component={MaterialManager}
        options={{ title: 'Manage Materials' }}
      />
      <Stack.Screen
        name="ServiceManager"
        component={ServiceManager}
        options={{ title: 'Manage Services' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
