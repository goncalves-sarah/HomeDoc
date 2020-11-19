import React, { Component } from 'react';
import { Dimensions, Modal, StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

import EditPatient from '../pages/Patient/PatientProfile/EditPatient';
import EditDoctor from '../pages/Doctor/DocProfile/EditDoctor';
import DeleteAccount from './DeleteAccount';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const initialState = {
    editing: false,
    exiting: false,
    deleting: false,
    showEditingScreen: false,
    showConfirmDelete: false,
    user:undefined,
    userType: undefined
}

export default class Menu extends Component {

    state = {
        ...initialState,
    }

    componentDidMount = () => {
        this.setState({user: this.props.user,userType:this.props.userType});
    }

    handleEditProfile = () => {
        this.setState({editing:true});
        this.setState({showEditingScreen:true});
    }

    handleCloseEditProfile = () => {
        this.props.handleData();
        this.setState({showEditingScreen:false});
    }

    handleExit = () => {
        this.setState({exiting:true});
        delete axios.defaults.headers.common['Authorization'];
        AsyncStorage.removeItem('userData');
        this.setState({exiting:false});
        this.props.navigation.navigate('Landing');
    }
    
    handleDeleteAccount = () => {
        this.setState({deleting:true});
        this.setState({showConfirmDelete:true});
    }

    handleCancelDelete = () => {
        this.setState({showConfirmDelete:false});
    }

    handleShowEditScreen() {
        if(this.state.userType === 'P'){
            return <EditPatient close = {this.handleCloseEditProfile}/>
        } else {
            return <EditDoctor close = {this.handleCloseEditProfile}/>
        }
    }

    render() {

        return (
            <View  style={styles.content}>
                <TouchableHighlight 
                    onPressIn = {this.handleEditProfile}
                    onPressOut = {() => this.setState({editing:false})}
                    underlayColor = "#28ADA6"
                    style = {styles.buttonBox}
                >
                    <Text  style = {this.state.editing ?
                        [styles.buttonText, {color:'white'}] 
                        : styles.buttonText}>Editar</Text>
                </TouchableHighlight>
                        
                {this.state.showEditingScreen && 
                    this.handleShowEditScreen()
                }
    
                <TouchableHighlight 
                    onPress = {this.handleExit}
                    underlayColor = "#28ADA6"
                    style = {styles.buttonBox}
                >
                    <Text  style = {this.state.exiting ?
                        [styles.buttonText, {color:'white'}] 
                        : styles.buttonText}>Sair</Text>
                </TouchableHighlight>
    
                <TouchableHighlight 
                    onPressIn = {this.handleDeleteAccount}
                    onPressOut = {() => this.setState({deleting:false})}
                    underlayColor = "#28ADA6"
                    style = {styles.buttonBox}
                >
                    <Text  style = {this.state.deleting ?
                        [styles.buttonText, {color:'white'}] 
                        : styles.buttonText}>Deletar Conta</Text>
                </TouchableHighlight>

                {this.state.showConfirmDelete && (
                    <DeleteAccount
                        isNotReady = {this.props.isNotReady} 
                        userType = {this.state.userType}
                        isReady = {this.props.isReady} 
                        close = {this.handleCancelDelete} 
                    />
                )}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 2,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white'
    },
    buttonBox: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        
        height: 50,
        width: Dimensions.get('screen').width - 50,
        marginVertical: 30,
        
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#28ADA6',
    },
    buttonText: {
        color:'#007575',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 18,
    }
  });
  