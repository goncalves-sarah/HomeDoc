import React, { useContext } from 'react';
import { Alert, Modal, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import api from '../services/api';
import idContext from '../services/context';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default function DeleteAccount(props) {
    
    const user = useContext(idContext);
    const navigation = useNavigation();

    function deleteAccount() {
        props.isReady();
        if(props.userType === 'P') {
            const { id } = user.patient;

            api.delete(`delete/patient/${id}`)
            .then(res => {
                navigation.navigate('Landing');
                setTimeout(() => {
                    Alert.alert(res.data.message);
                },500);
            })
            .catch(err => {
                Alert.alert("Não foi possível deletar seu cadastro! Tente novamente!");
            })
    
        } else if(props.userType === 'D') {
            const { id } = user.doctor;
            
            api.delete(`delete/doctor/${id}`)
            .then(res => {
                delete axios.defaults.headers.common['Authorization'];
                AsyncStorage.removeItem('userData');
                props.close();
                navigation.navigate('Landing');
                setTimeout(() => {
                    Alert.alert(res.data.message);
                },500);
            })
            .catch(err => {
                Alert.alert("Não foi possível deletar seu cadastro! Tente novamente!");
            })
        }
        
        props.isNotReady();
    }


    return (
        <Modal
            visible = {true} 
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {props.close}>
            
                <View style = {styles.box}>
                    <TouchableWithoutFeedback onPress = {props.close}> 
                        <View style = {styles.background}></View>
                    </TouchableWithoutFeedback>
                    <View style = {styles.container}>
                        <View style = {styles.top}>
                            <Text style = {styles.text}>Deletar Conta</Text>
                        </View>
                        <View style = {styles.terms}>
                            <Text style = {{textAlign:'justify',lineHeight: 30,fontFamily:'Nunito_600SemiBold'}}>
                                Ao deletar sua conta todos os seus dados serão apagados, sem possibilidade de recuperação.{"\n"}
                                Deseja deletar sua conta?
                            </Text>
                        </View>
                        <View style = {styles.buttonContainer}>
                            <TouchableOpacity style = {[styles.button,{backgroundColor:'#AFAEAE'}]} onPress = {props.close}>
                                <Text style = {styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress = {deleteAccount} style = {styles.button}>
                                <Text style = {styles.buttonText}>Deletar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress = {props.close}> 
                        <View style = {styles.background}></View>
                    </TouchableWithoutFeedback>    
                </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent:'space-evenly'
    },
    background: {
        height: 200,
    },
    container: {
        backgroundColor: 'white',
        justifyContent:'flex-start',
        alignItems:'center',
        marginHorizontal:20,
        borderRadius:20
    },
    top: {
        borderColor: 'white',
        borderBottomWidth:5,
        backgroundColor:'#F70000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom: 5
    },
    buttonContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginBottom:20,
        width:'100%',
    },
    button: {
        backgroundColor:'#F70000',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 10
    },
    buttonText: {
        color:'#fff',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    text: {
        color:'#fff',
        fontSize: 18,
        fontFamily: 'Nunito_700Bold',
        marginTop: 10,
    },
    terms: {
        padding: 20,
        marginVertical: 20,
        borderColor: '#F70000',
        borderBottomWidth:1,
        borderTopWidth: 1,
    },
});