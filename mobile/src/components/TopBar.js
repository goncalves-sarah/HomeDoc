import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

export default function TopBar(props) {

    const navigation = useNavigation();

    function handleNavigateHomeScreen() {
        navigation.navigate('Landing');
    }

    return (
        <View style = {styles.top}>
            <RectButton style = {{marginLeft: 10}}  onPress = {() => navigation.goBack()}>
                <Ionicons name="ios-arrow-round-back" size={40} color="white" style = {{backgroundColor: '#007575'}} />
            </RectButton>
            <TouchableWithoutFeedback style = {{marginRight: 10}} onPress = {handleNavigateHomeScreen}>
                <Text style = {styles.buttonText}>HomeDoc</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonText: {
        color: '#fff',
        fontFamily: 'KaushanScript_400Regular',
        fontSize: 16
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
})