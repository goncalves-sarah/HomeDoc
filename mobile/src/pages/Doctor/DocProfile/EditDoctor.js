import { LinearGradient } from 'expo-linear-gradient';
import React, { Component } from 'react';
import { Alert, Dimensions, Modal, StyleSheet, Text, View, Image, FlatList, ActivityIndicator } from 'react-native';
import { RectButton, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';

import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';

import TopProfile from '../../../components/TopProfile';

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

import {specialties, cities} from '../../DoctorList/data';
import idContext from '../../../services/context';
import api from '../../../services/api';

const initialState = {
    doctor: null,
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    willChangePassword: false,
    date: new Date(),
    birthDate: 'Data de nascimento',
    showDatePicker: false,
    CPF: "",
    DDD: "",
    UFCRM: "",
    CRM: "",
    cellphone: "",
    showSpecialty: false,
    specialty: "",
    showCities: false,
    city: "",
    about:"",
    consult_price: "",
    hideOldPassword: true,
    hideNewPassword: true,
    images: [],
    newImages: [],
    avatar: null,
    id: undefined,
    isUploading: false
}

export default class EditDoctor extends Component {

    static contextType = idContext;

    state = {
        ...initialState,
        specialties: specialties,
        cities: cities,
    }

    componentDidMount = () => {

        const {
            id,
            name,
            email,
            birthDate,
            CRM,
            about,
            city,
            specialty,
            consult_price,
            cellphone,
            images,
        } = this.context.doctor;

        const DDD = cellphone.substring(0,2);
        const cell = cellphone.substring(2,cellphone.length);

        const UFCRM = CRM.substring(CRM.length - 2);
        const crm = CRM.substring(0,CRM.length - 2);
        
        const profileImage = images.filter(img => img.isAvatar);
        const img = images.filter(img => !img.isAvatar);
        const year = birthDate.split('-')[0];
        const month = birthDate.split('-')[1];
        const day = birthDate.split('-')[2].split('T')[0];

        this.setState({
            id,
            name,
            email,
            UFCRM,
            city,
            specialty,
            DDD,
            cellphone: cell,
            consult_price,
            about,
            CRM: crm,
            birthDate: day + "/" + month + "/" + year,
            images:img,
            avatar:profileImage
        })
    }

    renderSpecialty = ({item}) =>(
        <RectButton onPress = {() => this.selectedSpecialty(item.especialidade)} style = {styles.specialtyBox}>
            <Text style = {styles.specialty}>
                {item.especialidade}
            </Text>
        </RectButton>
    );

    selectedSpecialty = (specialty) => {
        this.setState({showSpecialty:false,specialty});
    }

    selectedCity = (city) => {
        this.setState({showCities:false,city});
    }

    renderCity = ({item}) =>(
        <RectButton onPress = {() => this.selectedCity(item)} style = {styles.specialtyBox}>
            <Text style = {styles.specialty}>
                {item}
            </Text>
        </RectButton>
    );

    handleProfilePicture = (img) => {
        this.setState({avatar:img});
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
        
        this.setState({images:[...this.state.images,result],newImages:[...this.state.newImages,result]});
    }

    getDatePicker = () => {
        this.setState({showDatePicker: true});
    }

    allFieldsFilled = () => {
        
        const {name,email,birthDate,cellphone,DDD,CRM,UFCRM,specialty,city,consult_price, avatar} = {...this.state};
        return (CRM.length > 0 && UFCRM.length == 2 
            && specialty.length > 0 && city.length > 0 && avatar != null
            && consult_price.length > 0 && name.length > 0 && email.length > 0 
            && cellphone.length > 0 && DDD.length == 2 && !isNaN(birthDate[0]));
    }
    
    alterData = async () => {

        
        if(!this.allFieldsFilled()) Alert.alert('Todos os campos devem estar preenchidos!!!');
        else if(this.state.newImages.length > 1 || (this.state.newImages.length > 0 && this.state.avatar.uri)) {
            Alert.alert("Só pode ser alterada ou adicionada uma foto por vez!")
        } 
        else {
            this.setState({isUploading:true});
            
            const data = new FormData();

            const crm = this.state.CRM + this.state.UFCRM;
            const cellphone = this.state.DDD + this.state.cellphone;
            let birthDate = this.state.birthDate.split('/');
            birthDate = birthDate[2] + "/" + birthDate[1] + "/" + birthDate[0];
    
            data.append('name',this.state.name);
            data.append('email',this.state.email);
            data.append('birthDate',birthDate);
            data.append('cellphone',cellphone);
            data.append('CRM',crm);
            data.append('specialty',this.state.specialty);
            data.append('city',this.state.city);
            data.append('about',this.state.about);
            data.append('consult_price',this.state.consult_price);

            this.state.newImages.map(image => {
                const name = image.uri.split('/').pop();
                data.append('images', {
                    uri: image.uri,
                    name,
                    type: image.type
                });
            });
            
            if(this.state.avatar.uri) {
                const name = this.state.avatar.uri.split('/').pop();
                data.append('isAvatar',name);

                data.append('images', {
                    uri: this.state.avatar.uri,
                    name,
                    type: this.state.avatar.type,
                });
            } else {
                data.append('isAvatar',"");
            }
            console.log(data);
            api.put(`doctor/update/${this.state.id}`, data)
            .then(res => {
                Alert.alert("Dados salvos com sucesso!");
                this.setState({isUploading:false});
            })
            .catch(err => {
                Alert.alert("Houve um problema! Tente Novamente");
                this.setState({isUploading:false});
            })
        } 
    }

    handlePictureInfo = () => {
        Alert.alert("Adicione fotos de seu histórico médico e informações que gostaria que seu médico saiba!" +
        "\nEssas fotos não são obrigatórias!");
    }

    handleDeleteImage = (image) => {
       
        if(image.uri) {
            const images = this.state.images.filter(img => img.uri != image.uri);
            const newImages = this.state.newImages.filter(img => img.uri != image.uri);
            this.setState({images,newImages});
        } else {
            const images = this.state.images.filter(img => img.id != image.id);
            const newImages = this.state.newImages.filter(img => img.id != image.id);
            api.delete(`delete/pictures/${image.id}`)
            .then(res => {
                this.setState({images,newImages});
            })
            .catch(err => {
                Alert.alert("Não foi possível excluir sua foto! Tente Novamente!");
                console.log(err);
            });
        }
    }

    handleChangePassword = () => {
        this.setState({willChangePassword: !this.state.willChangePassword});
    }

    handleRequestChangePassword = () => {
        if(this.state.oldPassword.length > 0 && this.state.newPassword.length > 0) {
            if(this.state.oldPassword === this.state.newPassword) {
                Alert.alert("A sua nova senha deverá ser diferente da atual!");
            } else {
                const newPassword = this.state.newPassword;
                const oldPassword = this.state.oldPassword;
                const id = this.state.id;

                this.setState({isUploading:true});
                api.put('doctor/update/password',{
                    newPassword,oldPassword,id
                })
                .then(res => {
                    Alert.alert("Senha alterada com sucesso");
                    this.setState({isUploading:false});
                })
                .catch(err => {
                    if(err.response.status ==  400) {
                        Alert.alert("Houve um erro! Tente Novamente");
                    } else if(err.response.status == 401) {
                        Alert.alert("Senha incorreta! Digite novamente sua senha atual!");
                    }
                    this.setState({isUploading:false});
                })
            }
        } else {
            Alert.alert("Você deve inserir duas senhas, a atual e a nova");
        }
    }

    render(){
        return (
            <Modal
            visible = {true}
            transparent
            animationType = "slide"
            >
                <LinearGradient
                    colors={['#28ADA6', '#007575','#28ADA6', '#007575']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >

                    <View style = {{flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
                        <TouchableWithoutFeedback 
                        onPress = {() => this.props.close()} 
                        style = {{marginLeft: 10,marginTop: 17,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Ionicons name="ios-arrow-round-back" size={40} color="white"/>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback 
                        onPress = {() => {
                            Alert.alert(
                                "Para que seus dados sejam realmente alterados, você deverá salvar as alterações!");
                        }} 
                        style = {{marginRight: 10,marginTop: 17,justifyContent:'flex-start',alignItems:'flex-start'}}>
                            <Feather name="info" size={25} color="white" />
                        </TouchableWithoutFeedback>
                    </View>
                    
                    <TopProfile 
                        name = {this.state.name} 
                        avatar = {this.state.avatar} 
                        selectProfilePic = {this.handleProfilePicture}
                    />

                        <ScrollView showsVerticalScrollIndicator = {false} >
                            <View style = {styles.content}>

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>NOME COMPLETO</Text>
                                    </View>
                                    
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

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>DATA DE NASCIMENTO</Text>
                                    </View>

                                    <TouchableWithoutFeedback onPress = {this.getDatePicker} style = {styles.inputBox}>
                                        <AntDesign name="calendar" size={24} color="#007575" style = {{marginLeft:5}} />
                                        <View style = {[styles.input,{justifyContent:'center'}]}>
                                            <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                                {this.state.birthDate}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <Modal
                                    visible = {this.state.showDatePicker} 
                                    transparent = {true}
                                    animationType = 'fade'
                                    onRequestClose = {() => this.setState({showDatePicker:false})}>
                                        
                                        <TouchableWithoutFeedback onPress = {() => this.setState({showDatePicker:false,
                                        birthDate: moment(this.state.date).format('D [/] MMMM [/] YYYY')})}> 
                                            <View style = {styles.background}></View>
                                        </TouchableWithoutFeedback>
                                        <View style = {{backgroundColor: '#28ADA6',}}>
                                            <DateTimePicker 
                                                value = {this.state.date}
                                                onChange = {(_,date) => this.setState({date})}
                                                mode = 'date'
                                                textColor = 'white'
                                                maximumDate={new Date()} 
                                            />
                                        <TouchableWithoutFeedback onPress = {() => this.setState({showDatePicker:false,
                                        birthDate: moment(this.state.date).format('D [/] M [/] YYYY')})}> 
                                            <View style = {styles.background}></View>
                                        </TouchableWithoutFeedback>
                                        </View>
                                        
                                    </Modal>

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>EMAIL</Text>
                                    </View>

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

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>CRM</Text>
                                    </View>

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

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>WHATSAPP</Text>
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

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>ESPECIALIDADE</Text>
                                    </View>

                                    <TouchableWithoutFeedback onPress = {() => {
                                    const show = this.state.showSpecialty;
                                    this.setState({showSpecialty:!show})
                                    }} style = {[styles.inputBox]}>
                                        <MaterialIcons name="local-hospital" size={24} color="#007575" style = {{marginLeft:5}} />
                                        <View style = {[styles.input,{justifyContent:'center'}]}>
                                            <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                            {this.state.specialty}
                                            </Text>
                                        </View>
                                    </TouchableWithoutFeedback>

                                    {this.state.showSpecialty &&
                                    
                                        <View style = {styles.specialityContainer}>
                                            <FlatList
                                            horizontal = {true} 
                                            showsHorizontalScrollIndicator = {false}
                                            data = {this.state.specialties}
                                            keyExtractor = {(item,index) => `${index}`}
                                            renderItem = {this.renderSpecialty}
                                            />
                                        </View>
                                    }

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>CIDADE</Text>
                                    </View>

                                    <TouchableWithoutFeedback onPress = {() => {
                                        const show = this.state.showCities;
                                        this.setState({showCities:!show})
                                    }} style = {styles.inputBox}>
                                            <MaterialIcons name="location-city" size={24} color="#007575" style = {{marginLeft:5}} />
                                            <View style = {[styles.input,{justifyContent:'center'}]}>
                                                <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                                    {this.state.city}
                                                </Text>
                                            </View>
                                    </TouchableWithoutFeedback>

                                    {this.state.showCities &&
                            
                                        <View style = {styles.specialityContainer}>
                                            <FlatList 
                                            horizontal = {true} 
                                            showsHorizontalScrollIndicator = {false}
                                            data = {this.state.cities}
                                            keyExtractor = {(_,index) => `${index}`}
                                            renderItem = {this.renderCity}
                                            />
                                        </View>
                                    }

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>EXPERIÊNCIAS</Text>
                                    </View>

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

                                    <View style = {styles.picInfo}>
                                        <Text style={styles.label}>VALOR CONSULTA</Text>
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

                                    <TouchableWithoutFeedback onPress = {this.handlePictureInfo} style = {styles.picInfo}>
                                        <Text style={styles.label}>Fotos</Text>
                                        <Feather name="info" size={24} color="#007575" />
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
                                                            key = {image.url ? image.url : image.uri} 
                                                            style = {{
                                                                flexDirection:'row',
                                                                position:'relative',
                                                                width: 64,
                                                                marginRight: 8
                                                            }}>
                                                                <Image
                                                                source = {image}
                                                                style = {styles.uploadedImage}
                                                                />
                                                                <RectButton
                                                                onPress = {() => this.handleDeleteImage(image)}
                                                                style = {{
                                                                    marginLeft: -12,
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

                                    {this.state.willChangePassword && 
                                    (
                                        <Modal
                                        visible = {true} 
                                        transparent = {true}
                                        animationType = 'fade'
                                        >
                                            <View style = {styles.box}>
                                                <TouchableWithoutFeedback onPress = {this.handleChangePassword}> 
                                                    <View style = {styles.backgroundModal}></View>
                                                </TouchableWithoutFeedback>
                                                <View style = {styles.containerModal}>
                                                    <View style = {styles.top}>
                                                        <Text style = {styles.text}>Alterar Senha</Text>
                                                    </View>
                                                    <Text style = {styles.textInfo}>Senha Antiga</Text>
                                                    <View style = {styles.inputBox}>
                                                        <Entypo name="key" size={24} color="#007575" style = {{marginLeft:5}}/>
                                                        <TextInput 
                                                        style = {[styles.input,{width:170,color:'black'}]} 
                                                        value = {this.state.oldPassword} 
                                                        secureTextEntry = {this.state.hideOldPassword}
                                                        autoCapitalize = "none"
                                                        onChangeText = {(oldPassword) => this.setState({oldPassword}) }
                                                        placeholder = "Digite sua senha"/>
                                                        <TouchableWithoutFeedback 
                                                        onPress = {() => this.setState({hideOldPassword:!this.state.hideOldPassword}) }
                                                        >
                                                            {this.state.hideOldPassword ? (
                                                                <FontAwesome name="eye" size={20} color="#007575" style = {{marginRight:10}}/>
                                                            ):(
                                                                <FontAwesome name="eye-slash" size={20} color="#007575" style = {{marginRight:10}}/>
                                                            )}
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    <Text style = {styles.textInfo}>Nova Senha</Text>
                                                    <View style = {styles.inputBox}>
                                                        <Entypo name="key" size={24} color="#007575" style = {{marginLeft:5}}/>
                                                        <TextInput 
                                                        style = {[styles.input,{width:170,color:'black'}]} 
                                                        value = {this.state.newPassword} 
                                                        secureTextEntry = {this.state.hideNewPassword}
                                                        autoCapitalize = "none"
                                                        onChangeText = {(newPassword) => this.setState({newPassword}) }
                                                        placeholder = "Digite sua senha"/>
                                                        <TouchableWithoutFeedback 
                                                        onPress = {() => this.setState({hideNewPassword:!this.state.hideNewPassword}) }
                                                        >
                                                            {this.state.hideNewPassword ? (
                                                                <FontAwesome name="eye" size={20} color="#007575" style = {{marginRight:10}}/>
                                                            ):(
                                                                <FontAwesome name="eye-slash" size={20} color="#007575" style = {{marginRight:10}}/>
                                                            )}
                                                        </TouchableWithoutFeedback>
                                                    </View>
                                                    <View style = {styles.buttonContainerModal}>
                                                    {this.state.isUploading ? 
                                                    (
                                                        <ActivityIndicator size = "large" color = "#F70000"/>
                                                    ) : 
                                                    (
                                                        <>
                                                        <TouchableOpacity style = {[styles.buttonModal,{backgroundColor:'#AFAEAE'}]} onPress = {this.handleChangePassword}>
                                                            <Text style = {styles.buttonTextModal}>Cancelar</Text>
                                                        </TouchableOpacity>

                                                        <TouchableOpacity onPress = {this.handleRequestChangePassword} style = {styles.buttonModal}>
                                                            <Text style = {styles.buttonTextModal}>Alterar</Text>
                                                        </TouchableOpacity>
                                                        </>
                                                    )}
                                                    </View>
                                                </View>
                                                <TouchableWithoutFeedback onPress = {this.handleChangePassword}> 
                                                    <View style = {styles.backgroundModal}></View>
                                                </TouchableWithoutFeedback>    
                                            </View>
                                        </Modal>
                                    )}

                                    {this.state.isUploading ? 
                                    (
                                        <View style = {styles.button}>
                                            <ActivityIndicator size = "small" color = "white"/>
                                        </View>
                                    ) : 
                                    (
                                        <>
                                        <TouchableWithoutFeedback style = {styles.button} onPress = {this.handleChangePassword}>
                                            <Text style = {styles.buttonText}>Alterar Senha</Text>
                                        </TouchableWithoutFeedback>

                                        <RectButton  onPress = {this.alterData} style = {styles.button}>
                                            <Text style = {styles.buttonText}>Salvar Alterações</Text>
                                        </RectButton>
                                        </>
                                    )}      
                                </View>
                        </ScrollView>
                </LinearGradient>
            </Modal>
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
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Nunito_700Bold',
        fontSize: 16
    },
    content: {
        justifyContent:'flex-start',
        alignItems:'center',
        backgroundColor:"white",
        paddingVertical: 15
    },
    picInfo: {
        width: Dimensions.get('screen').width/2 + 50,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginVertical: 8,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 10,
        borderColor: '#007575'
    },  
    label: {
        color: '#007575',
        fontSize: 16,
        marginRight: 8,
        fontFamily:'Nunito_700Bold'
    },
    uploadedImagesContainer: {
        flexDirection: 'row',
    },
    uploadedImage: {
        width: 64,
        height: 64,
        borderRadius: 20,
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
        marginTop: 5
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
    },
    box: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent:'space-evenly'
    },
    backgroundModal: {
        height: 200,
    },
    containerModal: {
        backgroundColor: 'white',
        justifyContent:'flex-start',
        alignItems:'center',
        marginHorizontal:20,
        borderRadius:20
    },
    top: {
        borderColor: 'white',
        borderBottomWidth:5,
        backgroundColor:'#F70000',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom: 5
    },
    text: {
        color:'#fff',
        fontSize: 18,
        fontFamily: 'Nunito_700Bold',
        marginTop: 10,
    },
    buttonContainerModal: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginVertical:20,
        width:'100%',
    },
    buttonModal: {
        backgroundColor:'#F70000',
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderRadius: 10
    },
    buttonTextModal: {
        color:'#fff',
        fontSize: 14,
        fontFamily: 'Nunito_700Bold',
    },
    textInfo: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 14,
        paddingTop: 5
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
  