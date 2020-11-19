import React, { Component } from 'react';
import { StyleSheet, Text, View,Image, Modal, Alert, Platform, Dimensions } from 'react-native';
import { TextInput, RectButton, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import TopBar from '../../../components/TopBar';

import { Entypo } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
 
import { FontAwesome } from '@expo/vector-icons';

import img from '../../../assets/images/avatar-icon.jpg';

const initialState = {
    name: "",
    email: "",
    date: new Date(),
    cellphone: "",
    DDD: "",
    birthDate: 'Data de nascimento',
    showDatePicker: false,
    showAndroidDataPicker: false
}

export default class DSignup extends Component {
    state = {
        ...initialState,
    }

    allFieldsFilled = () => {
        const { name,email,birthDate,cellphone,DDD } = {...this.state};
        return (name.length > 0 && email.length > 0 
        && cellphone.length > 0 && DDD.length == 2 && !isNaN(birthDate[0]));
    }

    handleMedicalDetailsPage = () => {

        if(!this.allFieldsFilled()) Alert.alert('Todos os campos devem ser preenchidos!!!'); 
        else {
            const cellphone = this.state.DDD + this.state.cellphone;
            let birthDate = this.state.birthDate.split('/');
            birthDate = birthDate[2] + "/" + birthDate[1] + "/" + birthDate[0];
            
            const data = {
                name: this.state.name,
                email: this.state.email,
                birthDate,
                cellphone,
            }
    
            this.props.navigation.navigate('MedicalDetails',{data});
        }
    }

    render() {
        return(
            <View style={styles.container}>
                <TopBar />
                <ScrollView showsVerticalScrollIndicator = {false}>
                    <View style = {styles.content}>
                        <View style = {styles.body}>
                            <Image source = {img} style = {[styles.user]} />
                            <Text style = {[styles.title,{marginTop:15}]}>Cadastre-se</Text>
                            <View style = {styles.inputBox}>
                                <MaterialIcons name="person" size={24} color="#007575" style = {{marginLeft:5}} />
                                <TextInput 
                                    placeholder = "Digite seu nome completo" 
                                    style = {styles.input}
                                    value = {this.state.name} 
                                    autoCapitalize = "words"
                                    onChangeText = {(name) => this.setState({name}) }
                                />
                            </View>
                            <TouchableWithoutFeedback onPress = {() => {
                                this.setState({showDatePicker: true,showAndroidDataPicker:true});
                            }} style = {styles.inputBox}>
                                <AntDesign name="calendar" size={24} color="#007575" style = {{marginLeft:5}} />
                                <View style = {[styles.input,{justifyContent:'center'}]}>
                                    <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                        {this.state.birthDate}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>

                            {Platform.OS === 'ios' && (
                                <Modal
                                visible = {this.state.showDatePicker} 
                                transparent = {true}
                                animationType = 'fade'
                                onRequestClose = {() => this.setState({showDatePicker:false})}>
                                    
                                    <TouchableWithoutFeedback onPress = {() => this.setState({showDatePicker:false})}> 
                                        <View style = {styles.background}></View>
                                    </TouchableWithoutFeedback>
                                    <View style = {{backgroundColor: '#28ADA6',}}>
                                    
                                    <DateTimePicker 
                                        value = {this.state.date}
                                        onChange = {(_,date) => this.setState({date,birthDate: moment(date).format('D[/]M[/]YYYY')})}
                                        mode = 'date'
                                        textColor = 'white'
                                        maximumDate={new Date()} 
                                    />
                                    
                                    </View>
                                    <TouchableWithoutFeedback onPress = {() => this.setState({showDatePicker:false})}> 
                                        <View style = {styles.background}></View>
                                    </TouchableWithoutFeedback>
                                    
                                </Modal>
                            )}

                            {Platform.OS === 'android' && this.state.showAndroidDataPicker && (
                                <DateTimePicker 
                                    value = {this.state.date}
                                    onChange = {(_,date) => {
                                        this.setState({date,birthDate: moment(date).format('D[/]M[/]YYYY'),showAndroidDataPicker:false});
                                    }}
                                    mode = 'date'
                                    textColor = 'white'
                                    maximumDate={new Date()} 
                                />
                            )}
                            
                            <View style = {styles.inputBox}>
                                <Entypo name="email" size={24} color="#007575" style = {{marginLeft:5}} />
                                <TextInput 
                                style = {styles.input}
                                value = {this.state.email} 
                                onChangeText = {(email) => this.setState({email}) }
                                placeholder = "Digite seu email" 
                                autoCapitalize = "none"
                                keyboardType = "email-address"/>
                            </View>

                            <View style = {styles.inputBox}>
                                <FontAwesome name="whatsapp" size={24} color="#007575" style = {{marginLeft:5}} />
                                <TextInput 
                                    style = {{borderRightWidth:1,borderRightColor:'#28ADA6',paddingLeft:5,width:45,height:40}}
                                    value = {this.state.DDD} 
                                    onChangeText = {(DDD) => this.setState({DDD}) }
                                    placeholder = "DDD" 
                                    keyboardType = "number-pad"
                                />
                                <TextInput  
                                    style = {[styles.input,{width:150}]}
                                    value = {this.state.cellphone} 
                                    onChangeText = {(cellphone) => this.setState({cellphone}) }
                                    placeholder = "Whatsapp"
                                    keyboardType = "number-pad"/>
                            </View>

                            <RectButton onPress = {this.handleMedicalDetailsPage} style = {styles.button}>
                                <Text style = {styles.buttonText}>Prosseguir</Text>
                            </RectButton>
                        </View>
                    </View>
                </ScrollView>
            </View>
        ) 
    }
}

const styles = StyleSheet.create({
    background: {
        height: 250,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    container: {
        flex: 1,
        backgroundColor: '#007575',
        paddingVertical:25
    },
    content: {
        flex: 1,
        height: 620,
        justifyContent:'flex-start',
        alignItems:'center',
        marginVertical: 40,
    },
    body: {
        width:280,
        height: 460,
        backgroundColor: "#28ADA6",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },
    user: {
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
        backgroundColor: 'white',
        height: 70,
        width: 70,
        marginTop: -70
    },
    title: {
        color: '#fff',
        fontFamily: 'Archivo_700Bold',
        fontSize: 20,
        marginVertical:10,
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
    },
    specialityContainer: {
        height: 50,
    },
    specialtyBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginHorizontal: 15,
        marginVertical:10,
        alignItems: 'center',
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#007575',
    },
    specialty: {
        width:100,
        textAlign:'center'
    }
  });
  