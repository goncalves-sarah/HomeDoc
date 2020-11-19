import React, { Component } from 'react';
import { StyleSheet, Text, View,Image, Alert } from 'react-native';

import { TextInput, RectButton, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Entypo } from '@expo/vector-icons'; 

import { FontAwesome } from '@expo/vector-icons';
import img from '../../../assets/images/medicos.png';

import TopBar from '../../../components/TopBar';
import api from '../../../services/api';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default class DLogin extends Component {

    state = {
        email: "",
        password: "",
        hidePassword: true
    }  
        
    handleNavigateDocSignUp = () =>  {
        this.props.navigation.navigate('DoctorSignUp');
    }

    handleNavigateMainScreen = (data) => {
        AsyncStorage.setItem('userData',JSON.stringify(data));
        axios.defaults.headers.common['Authorization'] = `bearer ${data.token}`;
        console.log(data);
        this.props.navigation.navigate('FindingDoctors',{info:'médico',id:data.id});
    }

    handleSignin = () => {

        const data = { 
            email: this.state.email,
            password: this.state.password,
        };

       api.post('doctor/signin',data)
            .then((res) => {
                this.handleNavigateMainScreen(res.data);
            })
            .catch(err => { 
                if(err.response.status == 400) {
                    Alert.alert('Usuário não Cadastrado');
                } else if(err.response.status == 401) {
                    Alert.alert('Senha Incorreta');
                }
            });
    }

    render(){
        return (
            <View style={styles.container}>
                <TopBar />
                <View style = {styles.content}>
                    <View style = {styles.body}>
                        <Image source = {img} style = {styles.user} />
                        <Text style = {styles.title}>LOGIN</Text>
                        <View style = {styles.inputBox}>
                            <Entypo name="email" size={24} color="#007575" style = {{marginLeft:5}} />
                            <TextInput
                            style = {styles.input} 
                            value = {this.state.email} 
                            onChangeText = {(email) => this.setState({email}) }
                            autoCapitalize = "none"
                            placeholder = "Digite seu email" 
                            keyboardType = "email-address" />
                        </View>
                        <View style = {styles.inputBox}>
                            <Entypo name="key" size={24} color="#007575" style = {{marginLeft:5}}/>
                            <TextInput 
                            secureTextEntry = {this.state.hidePassword}
                            autoCapitalize = "none"
                            style = {[styles.input,{width:170}]} 
                            value = {this.state.password}
                            onChangeText = {(password) => this.setState({password}) }
                            placeholder = "Digite sua senha"/>
                            <TouchableWithoutFeedback 
                            onPress = {() => this.setState({hidePassword:!this.state.hidePassword}) }
                            >
                                {this.state.hidePassword ? (
                                    <FontAwesome name="eye" size={20} color="#007575" style = {{marginRight:10}}/>
                                ):(
                                    <FontAwesome name="eye-slash" size={20} color="#007575" style = {{marginRight:10}}/>
                                )}
                            </TouchableWithoutFeedback>
                        </View>
                        <RectButton style = {styles.button} onPress = {() => this.handleSignin()}>
                            <Text style = {styles.buttonText}>Login</Text>
                        </RectButton>
                        <TouchableWithoutFeedback style = {{marginTop: 15,marginBottom: 5}} onPress = { () => this.handleNavigateDocSignUp()}>
                            <Text style = {styles.buttonText}>Não tem uma conta? Cadastre-se</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#007575',
        paddingVertical:25
    },
    content: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        marginVertical: 50,
    },
    body: {
        width:280,
        height: 330,
        backgroundColor: "#28ADA6",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        paddingTop: 15,
    },
    user: {
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
        backgroundColor: 'white',
        height: 70,
        width: 70,
        position: 'absolute',
        top: -35
    },
    title: {
        color: '#fff',
        fontFamily: 'Archivo_700Bold',
        fontSize: 20,
        marginVertical:10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 240,
        height: 50,
        backgroundColor: '#007575',
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Archivo_700Bold',
    },
    input: {
        width: 200,
        height:50,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginLeft: 10
    },
    inputBox: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginHorizontal: 15,
        marginVertical:10,
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#007575'
    }
  });
  