import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/Main/DashboardScreen';
import NewBidScreen from '../screens/Main/NewBidScreen';
import AdminScreen from '../screens/Main/AdminScreen';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="New Bid" component={NewBidScreen} />
      <Tab.Screen name="Admin" component={AdminScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;
