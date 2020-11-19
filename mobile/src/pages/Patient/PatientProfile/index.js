import React, { Component } from 'react';
import { Image, Modal, StyleSheet, Text, View} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import Menu from '../../../components/Menu';
import img from '../../../assets/images/medicos.png';
import api from '../../../services/api';
import idContext from '../../../services/context';
import LoadingScreen from '../../../components/LoadingScreen';

const initialState = {
    avatar:null,
    patient: null,
    name: "",
    id: undefined,
    isReady: true
}

export default class Profile extends Component {

    state = {
        ...initialState,
    }

    componentDidMount = async () => {

        const { navigation } = this.props;
        
        this.setState({id:this.props.route.params.id}, () => {
            this.handleUserData();
            this.focusListener = navigation.addListener("focus", () => {      
                this.handleUserData();
            });
        });
    }

    handleUserData = () => {
        api.get(`patient/profile/${this.state.id}`)
            .then(res => {
                this.setState({patient:res.data.patient},() => {
                    
                    const profilePic = this.state.patient.images.filter(img => img.isAvatar);
                   
                    this.setState({avatar:profilePic,name:this.state.patient.name,id:this.state.patient.id});
                })
            })
            .catch(err => console.log(err))
    }

    handleLoadingScreen = () => {
        this.setState({isReady: false});
    }

    handleCloseLoadingScreen = () => {
        this.setState({isReady: true});
    }

    render() {

        return (
            <LinearGradient
                colors={['#28ADA6', '#007575','#28ADA6', '#007575']}
                style={styles.container}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {!this.state.isReady && 
                (
                    <Modal visible transparent = {false}>
                        <LoadingScreen text = "Deletando..."/>
                    </Modal>
                )}
                <View style = {styles.headerBox}>
                    <View style = {styles.userContainer}>
                        <Image source = {this.state.avatar ? this.state.avatar : img} style = {[styles.user]} />
                    </View>
                    <View style = {styles.nameBox}>
                        <Text style = {styles.name}>{this.state.name}</Text>
                    </View>
                </View>
                <idContext.Provider value = {{patient:this.state.patient}}>
                    <Menu 
                        isNotReady = {this.handleCloseLoadingScreen} 
                        isReady = {this.handleLoadingScreen} 
                        user = {this.state.patient}
                        handleData = {this.handleUserData} 
                        userType = 'P'
                        {...this.props}
                    />
                </idContext.Provider>
                
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#28ADA6',
        paddingTop:25,
    },
    headerBox: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth: 5,
        borderColor: 'white',
        marginBottom: 10,
    },
    userContainer: {
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
        backgroundColor: 'white',
        height: 100,
        width: 100,
        marginTop: 10,
    },
    user: {
        justifyContent:'center',
        alignItems:'center',
        height: 100,
        width: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'white',
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
  });
  