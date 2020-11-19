import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


import img from '../assets/images/medicos.png';

export default function TopProfile(props) {

    async function handleSelectProfilePicture() {
        
        const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
        
        if(!granted) {
            alert('É necessário permitir o acesso as fotos!');
            return;
        }
        
        const data = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality:1
        });

        if(data.cancelled) {
            return;
        }

        if(!data.uri) {
            return;
        }

        props.selectProfilePic(data);
    }
    
    return (
        <View style = {styles.headerBox}>
            
            <RectButton style = {styles.userContainer} onPress = {handleSelectProfilePicture}>
                <Image source = {props.avatar ? props.avatar : img} style = {[styles.user]} />
            </RectButton>
            <RectButton onPress = {handleSelectProfilePicture} style = {styles.userplus}>
                <AntDesign name="pluscircle" size={24} color="black" />
            </RectButton>
            <View style = {styles.nameBox}>
                <Text style = {styles.name}>{props.name}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerBox: {
        height: Dimensions.get('screen').height/4 - 5 ,
        width: Dimensions.get('screen').width,
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth: 5,
        borderColor: 'white',
        marginBottom: 10,
        zIndex: 1,
    },
    userContainer: {
        justifyContent:'flex-start',
        alignItems:'center',
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'white',
        height: 100,
        width: 100,
        zIndex: 4,
        marginTop: 10
    },
    user: {
        justifyContent:'center',
        alignItems:'center',
        height: 100,
        width: 100,
        zIndex: 1
    },
    userplus: {
        position: 'absolute',
        bottom: 128,
        right: 140,
        zIndex: 5
    },
    nameBox: {
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    }, 
    name: {
        color:'#FFF',
        fontFamily: 'Nunito_700Bold',
        fontSize: 18,
    },
})