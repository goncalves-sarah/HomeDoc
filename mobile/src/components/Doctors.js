import React, { Component } from 'react';
import { View, Text,StyleSheet, Image, Linking } from 'react-native';
import { RectButton, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import img from '../assets/images/medicos.png'

import { Fontisto } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default class Doc extends Component {

    state = {
        id: this.props.doctor.id,
        name: this.props.doctor.name,
        cellphone:this.props.doctor.cellphone,
        crm: this.props.doctor.CRM,
        specialty: this.props.doctor.specialty,
        about: this.props.doctor.about,
        consult_price: this.props.doctor.consult_price,
        profilePic: this.props.doctor.images[0]
    }

    sendMessage = () => {
        const message = `Olá Dr. ${this.state.name}, gostaria de agendar uma consulta!`;
        const num = "55" + this.state.cellphone;
        
        const url = `whatsapp://send?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(url)
            .then(supported => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    return Linking.openURL(
                        `https://api.whatsapp.com/send?phone=${encodeURIComponent(num)}&text=${encodeURIComponent(message)}`
                    );
                 }
        })
    }

    render() {
        return (
                <View style={styles.container}>
                    <View style = {styles.header}>
                        <Image style = {styles.image} source = {this.state.profilePic ? {uri:`${this.state.profilePic.url}`} : img}/>
                        <View style = {{alignItems:'flex-start', width:'100%',justifyContent:'flex-start',position:'relative'}}>
                            <RectButton onPress = {() => this.props.handleDoctor(this.state.id)} style = {styles.info}>
                                <Feather name="info" size={24} color="#007575" />
                            </RectButton>
                            <View style = {{width:'58%'}}>
                                <Text style = {styles.title}>Dr. {this.state.name}</Text>
                                <Text style = {styles.specialty}>{this.state.specialty}</Text>
                            </View>
                        </View>
                    </View>
                    <View style = {styles.body}>
                        <ScrollView showsVerticalScrollIndicator = {false}>
                            <Text style = {styles.description}> 
                                {this.state.about || "Sem Descrição"}
                            </Text>
                        </ScrollView>
                    </View>
                    <RectButton onPress = {() => {
                        this.sendMessage();
                    }}>
                        <View style = {styles.footer}>
                            <Text style = {{fontFamily: 'Poppins_400Regular',color:'white'}}>Agende sua consulta!</Text>
                            <Fontisto name="whatsapp" size={50} color="white" />
                        </View>
                    </RectButton>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '96%',
        marginVertical:10,
        borderRadius:10,
        marginLeft:'2%',
        backgroundColor:'#007575',
        justifyContent:'center',
    },
    header: {
        marginBottom: 5,
        borderTopStartRadius:10,
        borderTopEndRadius: 10,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor: 'white',
        borderBottomColor: '#28ADA6',
        borderBottomWidth: 5,
    },
    info: {
        marginLeft: 165,
        marginTop: -20,
    },
    body: {
        marginBottom:5,
        width: '95%',
        marginHorizontal: '2.5%',
        justifyContent:'flex-start',
        alignItems:'flex-start',
        borderRadius: 10,
        height: 100,
        borderBottomStartRadius:10,
        borderBottomEndRadius: 10,
        padding:10,
        backgroundColor: 'white'
    },
    image: {
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 50,
        backgroundColor: 'white',
        height: 100,
        width: 100,
        margin: 15,
        borderWidth: 2,
        borderColor: '#007575'
    },
    title: {
        color: 'black',
        fontFamily: 'Nunito_700Bold',
        fontSize: 16,
        marginBottom:10,
        marginRight: 10,
        textAlign: 'left',
    },
    specialty: {
        color: 'black',
        fontFamily: 'Nunito_700Bold',
        fontSize: 15,
        textAlign:'left'
    },
    footer: {
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 3,
        borderTopColor: '#28ADA6',
    },
    description: {
        textAlign:'justify',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14,
    }
})