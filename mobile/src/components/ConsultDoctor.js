import React, { useState } from 'react';
import { StyleSheet, Text, View,Image, Modal, Dimensions, Platform } from 'react-native';
import { RectButton, ScrollView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';

import { Fontisto } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import Carousel from 'react-native-snap-carousel';

export default function ConsultDoctor(props) {
        
        const [currentIndex, setCurrentIndex] = useState(0);
        const [showImage, setShowImage] = useState(false);
        const images = props.data.images.filter(image => !image.isAvatar);
        const profileImage = props.data.images.filter(image => image.isAvatar);

        function _renderItem({item, index}){
            let style = [styles.uploadedImage];
            if(currentIndex != index) {
                style = [...style,{opacity:0.7}]
            }
            return (
                <TouchableWithoutFeedback 
                style = {styles.uploadedImageBox}
                onPress = {() => {
                    setShowImage(true);
                    setCurrentIndex(index);
                }}
                >
                    <Image 
                    key = {item.url} 
                    source = {item}
                    resizeMode = "cover"
                    style = {style}
                    />
                </TouchableWithoutFeedback>
            );
        }
    
        return (
            <Modal
            animationType = "slide"
            visible = {true}
            transparent = {true}
            onRequestClose = {() => props.close()}
            >
                
               <LinearGradient
                    colors={['#28ADA6', '#007575','#28ADA6', '#007575']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    
                    <TouchableOpacity onPress = {() => props.close()} 
                    style = {{
                        marginLeft: 10,
                        justifyContent:'flex-start',
                        alignItems:'flex-start',
                        marginBottom: Platform.OS === 'android' ? 40 : 0
                        }}>
                        <Ionicons name="ios-arrow-round-back" size={40} color="white"/>
                    </TouchableOpacity>
                    <View style = {styles.headerBox}>
                        <RectButton onPress = {() => {
                            setShowImage(true);
                            props.data.images.map((img,index) => {
                                if(img.isAvatar) {
                                    setCurrentIndex(index);
                                }
                            })
                        }} style = {styles.userContainer}>
                            <Image source = {profileImage} style = {[styles.user]} />
                        </RectButton>
                        <View style = {styles.nameBox}>
                            <Text style = {styles.name}>{props.data.name}</Text>
                        </View>
                        <View style = {styles.infoBox}>
                            <Entypo name="location" size={18} color="white" />
                            <Text style = {styles.info}>{props.data.city}</Text>
                            <Fontisto style = {{paddingLeft: 5}} name="doctor" size={18} color="white" />
                            <Text style = {styles.info}>{props.data.specialty}</Text>
                        </View>
                        <View style = {styles.crmBox}>
                            <Text style = {styles.crm}>CRM: {props.data.CRM}</Text>
                        </View>
                    </View>
                    <View  style={styles.content}>
                            <ScrollView showsVerticalScrollIndicator = {false} >
                                <View style = {{flex:1}}>
                                    <View style = {styles.contentBox}>  
                                        <Text style = {props.data.about.length > 0 ? styles.text : [styles.text,{textAlign:'center'}]}>
                                            {props.data.about.length > 0 ? props.data.about : "Sem maiores informações"}
                                        </Text>
                                    </View>
                                    <View style = {styles.price}>
                                        <Text 
                                        style = {{
                                            fontSize:20,
                                            color:"white",
                                            fontFamily:'Nunito_700Bold',
                                        }}>PAGAMENTO</Text>
                                    </View>
                                    <View style = {styles.contentBox}>  
                                        <Text style = {styles.text}>
                                            Valor da Consulta: R${props.data.consult_price}{"\n"}
                                            Formas de Pagamento: A ser combinado via whatsapp.
                                        </Text>
                                    </View>
                                    {props.data.images.length > 1 &&
                                        <>
                                        <View style = {styles.price}>
                                        <Text 
                                        style = {{
                                            fontSize:20,
                                            color:"white",
                                            fontFamily:'Nunito_700Bold',
                                        }}>EXTRAS</Text>
                                        </View>
                                        <View style = {{flex:1,marginTop:5,justifyContent:'flex-start',alignItems:'center'}}>
                                            <Carousel
                                            layout={'stack'}
                                            layoutCardOffset={25}
                                            data={images}
                                            renderItem={_renderItem}
                                            sliderWidth= {Dimensions.get('screen').width - 40}
                                            itemWidth= {Dimensions.get('screen').width}
                                            onSnapToItem = { index => setCurrentIndex(index)}
                                            />
                                        </View>
                                        </>
                                    }

                                </View>
                            </ScrollView>
                    </View>
                </LinearGradient>

                {setShowImage &&
                (
                    <Modal 
                    animationType = "slide"
                    visible = {showImage}
                    >
                        <TouchableWithoutFeedback 
                        style = {{height:135,backgroundColor:'black'}}
                        onPress = {() => setShowImage(false)}
                        />
                        <View style = {{height:'60%'}}>
                            <Image 
                            source = {images[currentIndex] == undefined ? profileImage : images[currentIndex]}
                            style = {styles.displayedImage}
                            resizeMode = "contain"
                            />
                        </View>
                        <TouchableWithoutFeedback 
                        style = {{height:135,backgroundColor:'black'}}
                        onPress = {() => setShowImage(false)}
                        />
                    </Modal>
                )}
            </Modal>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#28ADA6',
        paddingTop:Platform.OS === 'ios' ? 25 : 0,
    },
    headerBox: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        borderBottomWidth: 5,
        borderColor: 'white',
        marginBottom: 10,
        zIndex: 1,
    },
    content: {
        flex: 2,
        justifyContent:'flex-start',
        alignItems:'center',
    },
    body: {
        width:'100%',
        height: '100%',
        backgroundColor: "white",
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
    },
    user: {
        justifyContent:'center',
        alignItems:'center',
        height: 100,
        width: 100,
        zIndex: 1
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
        zIndex: 4
    },
    userplus: {
        position: 'absolute',
        bottom: 140,
        right: 135,
        zIndex: 5
    },
    crmBox: {
        marginBottom: Platform.OS === 'ios' ? 30 : 60
    },
    crm: {
        color:'#FFF',
        fontFamily: 'Nunito_600SemiBold',
        fontSize: 14
    },
    price: {
        marginVertical: 15,
        paddingVertical:5,
        justifyContent:"center",
        alignItems:'center',
        borderColor:'white',
        borderTopWidth:1,
        borderBottomWidth:1
    },
    nameBox: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name: {
        color:'#FFF',
        fontFamily: 'Nunito_700Bold',
        fontSize: 16
    },
    infoBox: {
        marginBottom: 10,
        marginTop:15,
        width: '100%',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center'
    }, 
    info: {
        color:'#FFF',
        fontFamily: 'Nunito_600SemiBold',
        paddingHorizontal: 5,
        fontSize: 14
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
        marginHorizontal: 15,
    },
    onPressButton: {
        backgroundColor: 'white',
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Archivo_700Bold',
    },
    text: {
        textAlign:'justify',
        lineHeight: 25
    },
    contentBox: {
        width:Dimensions.get('screen').width,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical:20,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    uploadedImagesContainer: {
        flexDirection: 'row',
        padding:5
    },
    uploadedImageBox: {
        width: 270,
        height: 270,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius: 20,
        marginBottom: 10,
    },  
    uploadedImage: {
        width: 270,
        height: 270,
        borderRadius: 20,
        borderWidth: 2,
        borderColor:'white',
    },
    displayedImage: {
        height:'100%',
        width:'100%'
    },
    line: {
        borderBottomWidth: 5,
        height: 15,
        borderColor: 'white',
    },
    inputBox: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#007575'
    },
    background: {
        height: 250,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
  });
  