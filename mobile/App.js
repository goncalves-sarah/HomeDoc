import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppLoading } from 'expo';

import { useFonts, Archivo_400Regular, Archivo_700Bold } from '@expo-google-fonts/archivo';
import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold } from '@expo-google-fonts/nunito';
import { Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { KaushanScript_400Regular } from '@expo-google-fonts/kaushan-script';

import AppStack from './src/routes/AppStack';

export default function App() {
  let [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_700Bold,
    Poppins_400Regular,
    Poppins_600SemiBold,
    KaushanScript_400Regular,
    Nunito_600SemiBold, 
    Nunito_700Bold, 
    Nunito_800ExtraBold
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <AppStack />
        <StatusBar style="light" />
      </>
    );
  }
}
