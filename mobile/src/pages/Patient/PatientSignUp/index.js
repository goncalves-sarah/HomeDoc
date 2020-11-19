import React, { Component } from 'react';
import { StyleSheet, Text, View,Image, Modal, Alert, Platform  } from 'react-native';
import { TextInput, RectButton, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

import api from '../../../services/api';

import { Entypo } from '@expo/vector-icons'; 
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import img from '../../../assets/images/avatar-icon.jpg';
import TopBar from '../../../components/TopBar';
import TermsAndConditions from '../../../components/TermsAndConditions';
import LoadingScreen from '../../../components/LoadingScreen';

const initialState = {
    name: "",
    email: "",
    password: "",
    date: new Date(),
    birthDate: 'Data de nascimento',
    showDatePicker: false,
    showAndroidDataPicker: false,
    CPF: "",
    hidePassword: true,
    consentToTerms: false
}

export default class DSignup extends Component {
    state = {
        ...initialState,
        images: [],
        avatar:null,
        isReady: true
    }

    handleCreatePatient = async () => {

        const data = new FormData();

        let birthDate = this.state.birthDate.split('/');
        birthDate = birthDate[2] + "/" + birthDate[1] + "/" + birthDate[0];

        data.append('name',this.state.name);
        data.append('email',this.state.email);
        data.append('password',this.state.password);
        data.append('birthDate',birthDate);
        data.append('CPF',this.state.CPF);

        
        this.state.images.forEach(image => {
            const name = image.uri.split('/').pop();
            data.append('images', {
                uri: image.uri,
                name,
                type: image.type
            });
        });

        const name = this.state.avatar.uri.split('/').pop();
        data.append('isAvatar',name);

        data.append('images', {
            uri: this.state.avatar.uri,
            name,
            type: this.state.avatar.type,
        });

        const verify = {
            CPF: this.state.CPF,
            email: this.state.email
        };

        let allowed = false;

        await api.post('/patient',verify)
            .then(res => {
                allowed = true;
            })
            .catch(err => {
                this.setState({ isReady: true });
                Alert.alert(err.response.data.message);
                this.props.navigation.goBack();
            });
        

        if(allowed) {
            await api.post('patient/signup', data)
                .then(res => {
                    this.setState({ isReady: true });
                    this.setState(initialState);
                    Alert.alert('Sucesso','Cadastro realizado com sucesso!');
                    this.props.navigation.navigate('PatientLogin');
                })
                .catch(err => {
                    console.log(err);
                })  
        }
        
    }

    handleSelectImages = async () => {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

        if(status !== 'granted') {
            alert('Precisamos de acesso ás suas fotos');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images
        });

        if(result.cancelled) {
            return;
        }

        this.setState({images:[...this.state.images,result]});
    }

    handleSelectProfilePicture = async () => {
        
        const { granted } = await ImagePicker.requestCameraRollPermissionsAsync();
        
        if(!granted) {
            alert('É necessário permitir o acesso as fotos!');
            return;
        }
        
        const data = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality:1
        });

        if(data.cancelled) {
            return;
        }

        if(!data.uri) {
            return;
        }

        this.setState({avatar:data});
    }

    handleTermsAndConditions = () => {
        this.setState({consentToTerms:!this.state.consentToTerms});
    }

    allFieldsFilled = () => {
        const {name,email,password,birthDate,CPF, avatar} = {...this.state};
        return (name.length > 0 && email.length > 0 && password.length > 0 
        && CPF.length == 11 && !isNaN(birthDate[0]) && avatar != null);
    }

    isOldEnough = () => {
        const userBirthDate = this.state.birthDate.split('/');
        const birthDay = +userBirthDate[0];
        const birthMonth = +userBirthDate[1];
        const birthYear = +userBirthDate[2];

        const today = new Date();
        const presentYear = today.getFullYear();
        const presentMonth = today.getMonth() + 1;
        const presentDay = today.getDate();

        let age = presentYear - birthYear;

        if(presentMonth < birthMonth || presentMonth == presentMonth
            && presentDay < birthDay) {
                age--;
        }

        return age >= 16 ? true : false;
    }   

    handlePictureInfo = () => {
        Alert.alert("Adicione fotos de seu histórico médico e informações que gostaria que seu médico saiba!" +
        "\nEssas fotos não são obrigatórias!");
    }

    handleDeleteImage = (uri) => {
        const images = this.state.images.filter(image => image.uri != uri);
        this.setState({images});
    }

    handleLoading = () => {
        
        if(!this.allFieldsFilled()) Alert.alert('Todos os campos devem ser preenchidos!!!'); 
        else if(!this.isOldEnough()) Alert.alert('Você deve ser maior de 16 anos!');
        else if(!this.state.consentToTerms) Alert.alert('Você deve consentir com nossos termos de uso!');
        
        else {
            this.setState({isReady:false});
            this.handleCreatePatient();
        }
    }

    render() {

        if(!this.state.isReady) {
            return (
                <LoadingScreen />
            ) 
        }

        return(
            <View style={styles.container}>
                <TopBar />
                <ScrollView showsVerticalScrollIndicator = {false} >
                    <View style = {styles.content}>
                        <View style = {styles.body}>
                            <RectButton style = {styles.userContainer} onPress = {this.handleSelectProfilePicture}>
                                <Image source = {this.state.avatar ? this.state.avatar : img} style = {[styles.user]} />
                                <View style = {styles.userplus}>
                                    <AntDesign style = {{zIndex: 2}} name="pluscircle" size={24} color="black" />
                                </View>
                            </RectButton>
                            <View style = {{height:15}}></View>
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
                                <AntDesign name="idcard" size={24} color="#007575" style = {{marginLeft:5}}  />
                                <TextInput 
                                style = {[styles.input]}
                                value = {this.state.CPF} 
                                onChangeText = {(CPF) => this.setState({CPF}) }
                                placeholder = "CPF" 
                                keyboardType = "numeric"
                                />
                            </View>

                            <View style = {styles.inputBox}>
                                <Entypo name="key" size={24} color="#007575" style = {{marginLeft:5}}/>
                                <TextInput 
                                style = {[styles.input,{width:170}]} 
                                value = {this.state.password} 
                                secureTextEntry = {this.state.hidePassword}
                                autoCapitalize = "none"
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

                            <TouchableWithoutFeedback onPress = {this.handlePictureInfo} style = {styles.picInfo}>
                                <Text style={styles.label}>Fotos</Text>
                                <Feather name="info" size={24} color="white" />
                            </TouchableWithoutFeedback>

                            
                            {this.state.images.length > 0 && (
                                <View style = {{height: 70}}>
                                    <ScrollView
                                        horizontal
                                    >
                                        <View style = {styles.uploadedImagesContainer}>
                                        
                                            {this.state.images.map(image => {
                                                return (
                                                    <View 
                                                    key = {image.uri} 
                                                    style = {{
                                                        flexDirection:'row',
                                                        position:'relative',
                                                        marginRight:0,
                                                        width: 64,
                                                        marginRight: 8
                                                    }}>
                                                        <Image 
                                                        source = {{uri: image.uri}}
                                                        style = {styles.uploadedImage}
                                                        />
                                                        <RectButton
                                                        onPress = {() => this.handleDeleteImage(image.uri)}
                                                        style = {{
                                                            marginLeft: -18,
                                                            marginTop: -2,
                                                        }}
                                                        >
                                                            <MaterialIcons 
                                                            name="cancel" 
                                                            size={20} 
                                                            color="red"
                                                            />
                                                        </RectButton>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    </ScrollView>
                                </View>
                            )}

                            <TouchableOpacity style={styles.imagesInput} onPress={this.handleSelectImages}>
                                    <Feather name="plus" size={24} color="#15B6D6" />
                            </TouchableOpacity>

                            <TermsAndConditions handleTerms = {this.handleTermsAndConditions} consent = {this.state.consentToTerms} />

                            <RectButton onPress = {this.handleLoading} style = {styles.button}>
                                <Text style = {styles.buttonText}>Cadastrar</Text>
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
    buttonText: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 16
    },
    content: {
        flex: 1,
        justifyContent:'flex-start',
        alignItems:'center',
        marginVertical: 50,
    },
    picInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 8,
        fontFamily:'Nunito_700Bold'
    },  
    label: {
        color: '#fff',
        marginRight: 8,
        fontWeight: 'bold',
    },
    uploadedImagesContainer: {
        flexDirection: 'row',
    },
    uploadedImage: {
        width: 64,
        height: 64,
        borderRadius: 20,
        marginBottom: 30,
    },
    imagesInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: '#96D2F0',
        borderWidth: 1.4,
        borderRadius: 20,
        height: 64,
        width: 240,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    body: {
        width:280,
        paddingBottom: 20,
        backgroundColor: "#28ADA6",
        alignItems: 'center',
        justifyContent: 'flex-start',
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
    },
    userContainer: {
        width: 70,
        height: 90,
        position: 'absolute',
        top: -45,
        justifyContent:'center',
        alignItems:'center',
    },
    userplus: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },  
    title: {
        color: '#fff',
        fontSize: 20,
        marginVertical:10,
        fontFamily: 'Nunito_700Bold'
    },
    birthDate: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 15,
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
    onPressButton: {
        backgroundColor: 'white',
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
  