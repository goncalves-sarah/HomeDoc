import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function LoadingScreen(props) {
    return(
        <View 
                style = {{
                    width:'100%',
                    height:'100%',
                    justifyContent:'center',
                    alignItems:'center',
                    backgroundColor:'black'
                    }}>
                    <ActivityIndicator size = "large" color = "#007575"/>
                <Text style = {{marginTop: 15, color:'white'}}>{props.text ? props.text : "Cadastrando..."}</Text>
        </View>
    );
}
