import React from "react";
import { StyleSheet } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
// import { createBottomTabNavigator, BottomTabBar } from 'react-navigation-tabs';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from "../screens/Home";
import Clients from "../screens/Clients";

const TabBarComponent = props => <BottomTabBar {...props} />;

const AppNavigation = createMaterialBottomTabNavigator(
  {
    Clients: { 
      screen: Clients, 
      navigationOptions: ({ navigation }) => ({
        title: `Clientes`,
        tabBarIcon: <Ionicons size={28} color="#FFF" name="ios-people" />,

      }),
    },
    Home: { 
      screen: Home, 
      navigationOptions: ({ navigation }) => ({
        title: `Reportes`,
        tabBarIcon: <Ionicons size={28} color="#FFF" name="ios-stats" />,

      }),

    },

  },
  {
    shifting: true,

  }
  // {
  //   tabBarComponent: props => (
  //     <TabBarComponent {...props} style={{ borderTopColor: '#605F60' }} />
  //   ),
  // }
);
// const AppNavigation = createStackNavigator(
//   {
//     Home: { 
//       screen: Home, 
//       navigationOptions: ({ navigation }) => ({
//         title: `Chechen Automotriz`,
//       }),
//     },
//     Clients: { 
//       screen: Clients, 
//       navigationOptions: ({ navigation }) => ({
//         title: `Clientes - Chechen Automotriz`,
//       }),
//     }
//   },
//   {
//     initialRouteName: "Home"
//   }
// );

export default AppNavigation;
