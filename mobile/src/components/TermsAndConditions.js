import React, { useState } from 'react';
import { Alert, Dimensions, Modal, Platform, StyleSheet, Text, View } from 'react-native';
import { Switch, TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function TermsAndConditions(props) {

    const [showTerms, setShowTerms] = useState(false);

    return (
        <>
        <TouchableWithoutFeedback style = {styles.termsButton} onPress = {() => setShowTerms(true)}>
            <Text style = {styles.text}>Ler Termos e Condições</Text>
        </TouchableWithoutFeedback>
    
        <Modal
            visible = {showTerms} 
            transparent = {true}
            animationType = 'fade'
            onRequestClose = {() => setShowTerms(false)}>
                <View style = {styles.box}>
                    <TouchableWithoutFeedback onPress = {() => setShowTerms(false)}> 
                        <View style = {styles.background}></View>
                    </TouchableWithoutFeedback>
                    <View style = {styles.container}>
                        <Text style = {styles.text}>Termos e Condições</Text>
                        <View style = {styles.terms}>
                            <Text style = {{textAlign:'justify',lineHeight: 30,fontFamily:'Nunito_600SemiBold'}}>
                                * O aplicativo terá acesso aos meus dados que estou fornecendo de maneira voluntária.{"\n"}
                                * Seus dados não serão compartilhados com terceiros, sendo somente utilizados para fins 
                                educacionais
                            </Text>
                        </View>
                        <View style = {styles.switchContainer}>
                            <Text style = {[styles.text,{textDecorationLine:'none',marginTop:0,marginRight: 10}]}>
                                Concordo com os termos
                            </Text>
                            <Switch
                                onValueChange = {() => {
                                    props.handleTerms();
                                }}
                                value={props.consent}
                                trackColor={{ true: "#007575" }}
                            />
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress = {() => setShowTerms(false)}> 
                        <View style = {styles.background}></View>
                    </TouchableWithoutFeedback>    
                </View>
        </Modal>
        </>
    )
   
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent:'space-evenly'
    },
    background: {
        height:Platform.OS === 'ios' ? Dimensions.get('screen').height/3 : Dimensions.get('screen').height/3-100,
    },
    container: {
        backgroundColor: '#28ADA6',
        justifyContent:'flex-start',
        alignItems:'center',
        marginHorizontal:20,
        borderRadius:20,
    },
    termsButton: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginBottom:5
    },
    text: {
        color:'#fff',
        fontSize: 16,
        fontFamily: 'Nunito_700Bold',
        textDecorationLine:'underline',
        marginTop: 10
    },
    terms: {
        marginHorizontal: 20,
        backgroundColor:'white',
        borderRadius: 20,
        padding: 20,
        marginVertical: 20
    },
    switchContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginBottom:20
    }
});