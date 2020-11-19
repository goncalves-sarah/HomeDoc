import React from 'react';
import { StyleSheet, Text, View,Image, Dimensions } from 'react-native';
import { useNavigation, NavigationContainer } from '@react-navigation/native';
import HomeDoc from '../../assets/images/HomeDoc.png';
import { RectButton } from 'react-native-gesture-handler';
import { Fontisto } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';

export default function Landing() {
  const { navigate } = useNavigation();

  function handleNavigateToDoctorsLogin() {
    navigate('DoctorLogin');
  }

  function handleNavigateToPatientLogin() {
    navigate('PatientLogin');
  }
  
  return (
    <>
    
    <View style={styles.container}>
            <View style = {{justifyContent:'center',alignItems:'center'}}>
              <Image source={HomeDoc} style={styles.banner} />
            </View>
            <Text style={styles.title}>
              Seja bem-vindo, {'\n'}
              <Text style={styles.titleBold}>Quem é você?</Text>
            </Text>

            <View style={styles.buttonsContainer}>
              <RectButton
                style={[styles.button, styles.buttonPrimary]}
                onPress = {handleNavigateToPatientLogin}
                >
                <Octicons name="person" size={70} color="white" />
                <Text style={styles.buttonText}>Paciente</Text>
              </RectButton>

              <RectButton
                style={[styles.button, styles.buttonSecondary]}
                onPress = {handleNavigateToDoctorsLogin}
                >
                <Fontisto name="doctor" size={70} color="white" />
                <Text style={styles.buttonText}>Médico</Text>
              </RectButton>
            </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#007575',
      justifyContent: 'center',
      padding: 40,
    },
    bannerContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
    },
    banner: {
      width: Dimensions.get('screen').height/2,
      height: Dimensions.get('screen').height/2,
      resizeMode: 'contain',
    },
  
    title: {
      fontFamily: 'Poppins_400Regular',
      color: '#FFF',
      fontSize: 20,
      lineHeight: 30,
      marginTop: 0,
    },
  
    titleBold: {
      fontFamily: 'Poppins_600SemiBold',
    },
  
    buttonsContainer: {
      flexDirection: 'row',
      marginTop: 40,
      justifyContent: 'space-between',
    },
  
    button: {
      height: 150,
      width: '48%',
      backgroundColor: '#333',
      borderRadius: 8,
      padding: 24,
      justifyContent: 'space-between',
      alignItems: 'center'
    },
  
    buttonText: {
      color: '#fff',
      fontFamily: 'Archivo_700Bold',
      fontSize: 20,
      marginTop: 10
    },
  
    buttonPrimary: {
      backgroundColor: '#28ADA6', //#28ADA6
    },
    
    buttonSecondary: {
      backgroundColor: '#003131',
    },
  });
  