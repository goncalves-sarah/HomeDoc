import React, { Component } from 'react';
import { StyleSheet, Text, View,Image, Alert, FlatList } from 'react-native';
import { TextInput, RectButton, TouchableWithoutFeedback, ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';

import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import TopBar from '../../../components/TopBar';
import img from '../../../assets/images/avatar-icon.jpg';
import {specialties, cities} from '../../DoctorList/data';
import api from '../../../services/api';
import TermsAndConditions from '../../../components/TermsAndConditions';
import LoadingScreen from '../../../components/LoadingScreen';

const initialState = {
    CRM: "",
    UFCRM: "",
    showSpecialty: false,
    specialty: "",
    specialtyValue: "Escolha a especialidade",
    showCities: false,
    citiesValue: "Escolhe sua cidade",
    city: "",
    about:"",
    consult_price: "",
    consentToTerms: false,
    password: "",
    hidePassword: true,
}

export default class DSignup extends Component {
    state = {
        ...initialState,
        specialties: [...specialties],
        cities: [...cities],
        name: "",
        email: "",
        cellphone: "", 
        birthDate: 'Data de nascimento',
        avatar:null,
        images:[],
        isReady: true
    }

    componentDidMount = () => {
        const {
            name,
            email,
            birthDate,
            cellphone,
        } = this.props.route.params.data;
        this.setState({
            name,
            email,
            birthDate,
            cellphone,
        });
    }

    handleCreateDoctor = async () => {

            const data = new FormData();

            const crm = this.state.CRM + this.state.UFCRM;
    
            data.append('name',this.state.name);
            data.append('email',this.state.email);
            data.append('birthDate',this.state.birthDate);
            data.append('cellphone',this.state.cellphone);
            data.append('password',this.state.password);
            data.append('CRM',crm);
            data.append('specialty',this.state.specialty);
            data.append('city',this.state.city);
            data.append('about',this.state.about);
            data.append('consult_price',this.state.consult_price);

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
                CRM: this.state.CRM,
                email: this.state.email
            };

            let allowed = false;

            await api.post('/doctor',verify)
            .then(res => {
                allowed = true;
            })
            .catch(err => {
                this.setState({ isReady: true });
                Alert.alert(err.response.data.message);
                this.props.navigation.navigate('DoctorLogin');
            });
        

            if(allowed) {
                await api.post('doctor/signup', data)
                    .then(res => {
                        this.setState({ isReady: true });
                        this.setState(initialState);
                        Alert.alert('Sucesso','Cadastro realizado com sucesso!');
                        this.props.navigation.navigate('DoctorLogin');
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
        
        const {granted} = await ImagePicker.requestCameraRollPermissionsAsync();
        
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

    handlePictureInfo = () => {
        Alert.alert("Adicione fotos de seus diplomas e informações pertinentes a sua formação!" +
        "\nEssas fotos não são obrigatórias mas são recomendadas!");
        console.log(this.props.route.params.data);
    }

    renderSpecialty = ({item}) =>(
        <RectButton onPress = {() => this.selectedSpecialty(item.especialidade)} style = {styles.specialtyBox}>
            <Text style = {styles.specialty}>
                {item.especialidade}
            </Text>
        </RectButton>
    );

    selectedSpecialty = (specialty) => {
        this.setState({showSpecialty:false,specialty,specialtyValue:specialty});
    }

    selectedCity = (city) => {
        this.setState({showCities:false,city,citiesValue: city});
    }

    renderCity = ({item}) =>(
        <RectButton onPress = {() => this.selectedCity(item)} style = {styles.specialtyBox}>
            <Text style = {styles.specialty}>
                {item}
            </Text>
        </RectButton>
    );

    handleTermsAndConditions = () => {
        this.setState({consentToTerms:!this.state.consentToTerms});
    }

    handleDeleteImage = (uri) => {
        const images = this.state.images.filter(image => image.uri != uri);
        this.setState({images});
    }

    handleCurrency = (value) => {
        let count = 0;
        let pos = value.indexOf(','); 
        let index = pos + 1;
        while ( pos != -1 && count < 1) {
            pos = value.indexOf( ',', index);
            if(pos != -1) {
                index = pos + 1;
                count++;
            }  
        }

        if(count === 0) {
            this.setState({consult_price:value});
            return;
        } 

        value = value.substring(0,index - 1);
        
        this.setState({consult_price:value});
        
    }

    allFieldsFilled = () => {
        const {CRM,UFCRM,specialty,city, consult_price, password, avatar} = {...this.state};
        return (password.length > 0 && CRM.length > 0 && UFCRM.length == 2 
            && specialty.length > 0 && city.length > 0 && avatar != null
            && consult_price.length > 0);
    }

    handleLoading = () => {
        
        if(!this.allFieldsFilled()) Alert.alert('Todos os campos devem ser preenchidos!!!'); 
        else if(!this.state.consentToTerms) Alert.alert('Você deve consentir com nossos termos de uso!');
        
        else {
            this.setState({isReady:false});
            this.handleCreateDoctor();
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
                <ScrollView>
                    <View style = {styles.content}>
                        <View style = {styles.body}>
                            <RectButton style = {styles.userContainer} onPress = {this.handleSelectProfilePicture}>
                                <Image source = {this.state.avatar ? this.state.avatar : img} style = {[styles.user]} />
                                <View style = {styles.userplus}>
                                    <AntDesign style = {{zIndex: 2}} name="pluscircle" size={24} color="black" />
                                </View>
                            </RectButton>
                            <View style = {{height:50}}></View>
                            <Text style = {[styles.title,{marginTop:15}]}>Informações Médicas</Text>

                            <View style = {styles.inputBox}>
                                <Fontisto name="doctor" size={24} color="#007575" style = {{marginLeft:5}}  />
                                <TextInput 
                                style = {[styles.input,{width:155}]}
                                value = {this.state.CRM} 
                                onChangeText = {(CRM) => this.setState({CRM}) }
                                placeholder = "CRM" 
                                keyboardType = "numeric"
                                />
                                <TextInput 
                                style = {{borderLeftWidth:1,borderLeftColor:'#28ADA6',paddingLeft:5,width:45,height:40}}
                                value = {this.state.UFCRM} 
                                autoCapitalize = "characters"
                                onChangeText = {(UFCRM) => this.setState({UFCRM}) }
                                placeholder = "UF" 
                                />
                            </View>

                            <TouchableWithoutFeedback onPress = {() => {
                            const show = this.state.showSpecialty;
                            this.setState({showSpecialty:!show})
                            }} style = {[styles.inputBox]}>
                                <MaterialIcons name="local-hospital" size={24} color="#007575" style = {{marginLeft:5}} />
                                <View style = {[styles.input,{justifyContent:'center'}]}>
                                    <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                    {this.state.specialtyValue}
                                    </Text>
                                </View>
                            </TouchableWithoutFeedback>

                            {this.state.showSpecialty &&
                            
                                <View style = {styles.specialtyContainer}>
                                    <FlatList
                                    horizontal = {true} 
                                    showsHorizontalScrollIndicator = {false}
                                    data = {this.state.specialties}
                                    keyExtractor = {(item,index) => `${index}`}
                                    renderItem = {this.renderSpecialty}
                                    />
                                </View>
                            }

                            <TouchableWithoutFeedback onPress = {() => {
                                const show = this.state.showCities;
                                this.setState({showCities:!show})
                            }} style = {styles.inputBox}>
                                    <MaterialIcons name="location-city" size={24} color="#007575" style = {{marginLeft:5}} />
                                    <View style = {[styles.input,{justifyContent:'center'}]}>
                                        <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                            {this.state.citiesValue}
                                        </Text>
                                    </View>
                            </TouchableWithoutFeedback>

                            {this.state.showCities &&
                      
                                <View style = {styles.specialtyContainer}>
                                    <FlatList 
                                    horizontal = {true} 
                                    showsHorizontalScrollIndicator = {false}
                                    data = {this.state.cities}
                                    keyExtractor = {(_,index) => `${index}`}
                                    renderItem = {this.renderCity}
                                    />
                                </View>
                            }

                            <View style = {styles.inputBox}>
                                <AntDesign name="profile" size={24}  color="#007575" style = {{marginLeft:5}} />
                                <TextInput 
                                    placeholder = "Fale sobre sua formação e suas experiências para que seu paciente possa conhece-lo/a" 
                                    multiline = {true}
                                    style = {[styles.input,{height:100}]}
                                    value = {this.state.about} 
                                    autoCapitalize = "sentences"
                                    onChangeText = {(about) => this.setState({about}) }
                                />
                            </View>

                            <View style = {styles.inputBox}>
                                <MaterialCommunityIcons name="currency-brl" size={24} color="#007575" style = {{marginLeft:5}} />
                                
                                <TextInput 
                                    placeholder = "Digite o valor da sua consulta" 
                                    style = {styles.input}
                                    value = {this.state.consult_price} 
                                    keyboardType = "numeric"
                                    onChangeText = {(consult_price) =>  this.handleCurrency(consult_price)}
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
    lottie: {
        width: 100,
        height: 100
    },
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
        justifyContent:'flex-start',
        alignItems:'center',
        marginVertical: 50,
    },
    body: {
        width:280,
        paddingBottom: 20,
        backgroundColor: "#28ADA6",
        alignItems: 'center',
        justifyContent: 'flex-start',
        borderRadius: 20,
    },
    picInfo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 8
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
        marginLeft: 8
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
        marginBottom: 10,
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
        marginLeft: 10,
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
    specialtyContainer: {
        height: 50,
    },
    specialtyBox: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        marginHorizontal: 15,
        marginVertical:10,
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor:"white",
        borderRadius: 10,
        borderColor: '#007575',
    },
    specialty: {
        width:100,
        textAlign:'center',
        color: 'black'
    }
  });
  