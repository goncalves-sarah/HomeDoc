import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

import DoctorList from '../pages/DoctorList'
import PatientProfile from '../pages/Patient/PatientProfile';
import DocProfile from '../pages/Doctor/DocProfile';

const { Navigator, Screen } = createBottomTabNavigator();

function StudyTabs(props) {
  
  const type = props.route.params.info;

  return (
      <Navigator
          tabBarOptions={{
            style: {
              elevation: 0,
              shadowOpacity: 0,
              height: 54,
            },
            tabStyle: {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            },
            iconStyle: {
              flex: 0,
              width: 45,
              height: 60,
            },
            labelStyle: {
              fontFamily: 'Archivo_700Bold',
              fontSize: 13,
              marginLeft: 16,
            },
            inactiveBackgroundColor: '#fafafc',
            activeBackgroundColor: '#ebebf5',
            inactiveTintColor: '#c1bccc',
            activeTintColor: '#32264d',
          }}
        >
            <Screen
              name="DoctorList"
              component={DoctorList}
              options={{
                tabBarLabel: '',
                tabBarIcon: ( { focused }) => {
                  return (
                    <FontAwesome name="stethoscope" size={35} color={focused ? '#007575' : 'black'} />
                  );
                }
              }}
            />
            <Screen
              name="UserProfile"
              component={type == 'paciente' ? PatientProfile : DocProfile}
              initialParams = {{id:props.route.params.id}}
              options={{
                tabBarLabel: '',
                tabBarIcon: ({ focused }) => {
                  return (
                    <FontAwesome5 name="user-edit" size={35} color={focused ? '#007575' : 'black'}  />
                  );
                }
              }}
            />
        </Navigator>
  )
}

export default StudyTabs;
