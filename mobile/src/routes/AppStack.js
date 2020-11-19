import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Landing from '../pages/Landing';
import DoctorLogin from '../pages/Doctor/DocLogin';
import PatientLogin from '../pages/Patient/PatientLogin';
import DoctorSignUp from '../pages/Doctor/DocSignUp';
import MedicalDetails from '../pages/Doctor/DocSignUp/MedicalDetails';
import PatientSignUp from '../pages/Patient/PatientSignUp';
import FindingDoctors from './MainTabs';
import Auth from '../pages/Auth';

const { Navigator, Screen } = createStackNavigator();

function AppStack(props) {
  return (
    <NavigationContainer>
      <Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Screen name="Auth" component={Auth} />
        <Screen name="Landing" component={Landing} />
        <Screen name="DoctorLogin" component={DoctorLogin} />
        <Screen name="PatientLogin" component={PatientLogin} />
        <Screen name="DoctorSignUp" component={DoctorSignUp} />
        <Screen name="MedicalDetails" component={MedicalDetails} />
        <Screen name="PatientSignUp" component={PatientSignUp} />
        <Screen name="FindingDoctors" {...props} component={FindingDoctors} />
      </Navigator>
    </NavigationContainer>
  );
}

export default AppStack;
