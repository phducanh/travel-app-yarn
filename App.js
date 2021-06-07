import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { useFonts } from "@use-expo/font";
import { View } from 'react-native';
import firebase from '@react-native-firebase/app';
import '@firebase/firestore';

import StackNavigator from './src/navigations/navigator';

const customFonts = {
  'Roboto-Bold': require('./assets/fonts/Roboto-Bold.ttf'),
  'Roboto-Black': require('./assets/fonts/Roboto-Black.ttf'),
  'Roboto-Regular': require('./assets/fonts/Roboto-Regular.ttf'),
};

const firebaseConfig = {
  apiKey: "AIzaSyAAQB-3eTkdorDEB0SJvMxsBnd1Ed2OM-A",
  authDomain: "travel-app-d755f.firebaseapp.com",
  projectId: "travel-app-d755f",
  storageBucket: "travel-app-d755f.appspot.com",
  messagingSenderId: "379310522450",
  appId: "1:379310522450:web:bac9b80c7560df16a09f8b"
};


export default function App() {
  const [isLoaded] = useFonts(customFonts);

  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }

  if (!isLoaded) {
    return (
      <View></View>
    )
  }

  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
