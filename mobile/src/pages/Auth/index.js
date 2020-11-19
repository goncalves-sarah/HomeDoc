import React, { Component } from 'react';
import LoadingScreen from '../../components/LoadingScreen';

import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

export default class Auth extends Component {

    componentDidMount = async () => {
        const userDataJson = await AsyncStorage.getItem('userData');
        let userData = null;

        try {
            userData = JSON.parse(userDataJson);
        } catch(e) {}

        if(userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`;
            this.props.navigation.navigate('FindingDoctors',{info:userData.userType,id:userData.id});
        } else {
            this.props.navigation.navigate('Landing');
        }
    }

    render() {
       
        return (
            <LoadingScreen text = " "/>
        )
        
    }
}