import React, { Component, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, Dimensions, Keyboard } from 'react-native';
import { TextInput, RectButton, TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';

import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import {cities,specialties,filters} from './data';
import Doctor from '../../components/Doctors';
import api from '../../services/api';
import ConsultDoctor from '../../components/ConsultDoctor';
import InputSpinner from 'react-native-input-spinner';

const initialState = {
    specialty: "",
    name: "",
    city: "",
    showSpecialty: false,
    showCities: false,
    specialtyValue: "Escolha a especialidade",
    citiesValue: "Escolhe sua cidade",
    doctors: [],
    filteredDoctors:[],
    showFilter: false,
    selectedFilters:[],
    showDocProfile: false,
    selectedDoctorData: undefined,
    minValue: "0",
    maxValue: "0",
    refresh:true
}

export default class DocList extends Component {

    state = {
        ...initialState,
        specialties: [...specialties],
        cities: [...cities],
        filters:[...filters]
    }

    componentDidMount = async () => {
        
        const { navigation } = this.props;

        this.focusListener = navigation.addListener("focus", () => {      
            this.getDoctors();
        });
        
    }

    getDoctors = () => {
        api.get('find/doctors')
        .then(res => {
                    const doctors = res.data.doctors;
                    setTimeout(() => {
                        this.setState({doctors,filteredDoctors:doctors})
                    },1000);
                })
        .catch(err => console.log(err));
    }
            
    getFilteredDoctors = async () => {
        Keyboard.dismiss();
        this.setState({refresh:false});
        const {name,specialty,city,minValue,maxValue} = this.state;
        let filtered = this.state.doctors;
        if(this.state.selectedFilters.length > 0) {
            this.state.selectedFilters.map(filter => {
                if(filter == "Nome" && name.length > 0) {
                    filtered =  filtered.filter(doctor => doctor.name.includes(name));
                }
                if(filter == "Especialidade" && specialty.length > 0) {
                    filtered = filtered.filter(doctor => doctor.specialty === specialty);
                }
                if(filter == "Cidade" && city.length > 0) {
                    filtered = filtered.filter(doctor => doctor.city === city);
                }
                if(filter == "Preço" && minValue != "0" && maxValue != "0") {
                    if(maxValue < minValue) Alert.alert("Valor máx deve ser superior ao mín!");
                    else {
                        filtered = filtered
                            .filter(doctor => parseInt(doctor.consult_price) <= parseInt(maxValue)
                        );
                       
                        filtered = filtered
                            .filter(doctor => parseInt(doctor.consult_price) >= parseInt(minValue)
                        );
                        
                    }
                }
            })
            const filteredDoctors = filtered;
            
            this.setState({filteredDoctors},() => {
                this.setState({refresh:!this.state.refresh})
            });
        } else {
            this.setState({filteredDoctors:this.state.doctors},() => {
                this.setState({refresh:!this.state.refresh})
            });
        }
    }
    
    renderSpecialty = ({item}) =>(
        <RectButton onPress = {() => this.selectedSpecialty(item.especialidade)} style = {styles.specialtyBox}>
            <Text style = {styles.specialty}>
                 {item.especialidade}
            </Text>
        </RectButton>
    );

    renderFilter = ({item}) =>(
        <RectButton 
        onPress = {() => this.selectedFilter(item)} 
        style = {this.state.selectedFilters.includes(item) ? 
        [styles.specialtyBox,{borderColor:'#007575',borderWidth:2,opacity:0.6}] : styles.specialtyBox}>
            <Text style = {styles.specialty}>
                 {item}
            </Text>
        </RectButton>
    );

    selectedFilter = (filter) => {
        if(this.state.selectedFilters.includes(filter)) {
            this.setState({selectedFilters:this.state.selectedFilters.filter(f => f != filter)})
        } else {
            this.setState({selectedFilters:[...this.state.selectedFilters,filter]})
        }
    }

    handleDoctorProfile = (id) => {
        this.setState({showDocProfile: true})
        this.setState({selectedDoctorId:id});
    }

    handleCloseProfile = () => {
        this.setState({showDocProfile: false});
    }

    renderDoctor = (item) => {
        return (
            <Doctor handleDoctor = {this.handleDoctorData} doctor = {{...item}} />
        )
    };

    handleDoctorData = (id) => {
        api.get(`doctor/profile/${id}`)
        .then(res => {
            const doctor = res.data.doctor;
            this.setState({selectedDoctorData:doctor,showDocProfile:true});
            console.log(doctor);
        })
        .catch(err => console.log(err));
    }

    selectedSpecialty = (specialty) => {
        if(specialty == this.state.specialty) {
            this.setState({showSpecialty:false,specialty: "",specialtyValue: "Escolha a especialidade"});
        } else {
            this.setState({showSpecialty:false,specialty,specialtyValue: specialty});
        }
    }

    selectedCity = (city) => {
        if(city == this.state.city) {
            this.setState({showCities:false,city:"",citiesValue: "Escolhe sua cidade"});
        } else {
            this.setState({showCities:false,city,citiesValue: city});
        }
    }

    renderCity = ({item}) =>(
        <RectButton onPress = {() => this.selectedCity(item)} style = {styles.specialtyBox}>
            <Text style = {styles.specialty}>
                 {item}
            </Text>
        </RectButton>
    );

    showCityOptions = () => {
        const show = this.state.showCities;
        this.setState({showCities:!show});
    }

    showSpecialtyOptions = () => {
        const show = this.state.showSpecialty;
        this.setState({showSpecialty:!show});
    }

    setName = (name) => {
        this.setState({name});
    }

    changeMinValue = (min) => {
        this.setState({minValue:min,maxValue:min});
    }

    changeMaxValue = (max) => {
        this.setState({maxValue:max});
    }

    render() {

        return (
            <View style={styles.container}>
                <View style = {styles.top}>
                        <View style = {styles.filter}>
                            <RectButton onPress = {() => this.setState({showFilter:!this.state.showFilter})}>
                                <AntDesign name="filter" size={30} color="white" />
                            </RectButton>
                        </View>
                        <Text style = {styles.logo}>HomeDoc</Text>
                </View>
                <View style = {styles.content}>
                    {this.state.showFilter &&
                        <>
                        <View style = {{backgroundColor:'#007575',justifyContent:'center',alignItems:'center',padding:5}}>
                            <Text style = {[styles.title,{marginBottom:0}]}>Encontre seu Médico</Text>
                        </View>
                        <View style = {styles.body}>
                            <View style = {styles.filterBox}>
                                <Text style = {{color:'white',fontSize:16,fontFamily:"Nunito_700Bold"}}>Filtrar por:</Text>
                                <View style = {styles.specialityContainer}>
                                    <FlatList
                                    horizontal = {true} 
                                    showsHorizontalScrollIndicator = {false}
                                    data = {this.state.filters}
                                    keyExtractor = {(item,index) => `${index}`}
                                    renderItem = {this.renderFilter}
                                    />
                                </View>
                            </View>

                            {this.state.selectedFilters.includes("Nome") &&
                            (
                                <View style = {styles.inputBox}>
                                    <MaterialCommunityIcons name="format-letter-case" size={24} color="#007575" style = {{marginLeft:5}}/>
                                    <TextInput 
                                    style = {styles.input} 
                                    placeholder = "Digite o nome do seu médico"
                                    onChangeText = {name => this.setName(name)}
                                    />
                                </View>
                            )}

                            {this.state.selectedFilters.includes("Especialidade") &&
                            (
                                <TouchableWithoutFeedback onPress = {() => this.showSpecialtyOptions()} style = {styles.inputBox}>
                                        <MaterialIcons name="local-hospital" size={24} color="#007575" style = {{marginLeft:5}} />
                                        <View style = {[styles.input,{justifyContent:'center'}]}>
                                            <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                            {this.state.specialtyValue}
                                            </Text>
                                        </View>
                                </TouchableWithoutFeedback>
                            )}

                            {this.state.showSpecialty && this.state.selectedFilters.includes("Especialidade") &&
                            
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

                            {this.state.selectedFilters.includes("Cidade") &&
                            (
                                <TouchableWithoutFeedback onPress = {() => this.showCityOptions()} style = {styles.inputBox}>
                                        <MaterialIcons name="location-city" size={24} color="#007575" style = {{marginLeft:5}} />
                                        <View style = {[styles.input,{justifyContent:'center'}]}>
                                            <Text style = {{color:'rgba(0,0,0,0.3)'}}>
                                            {this.state.citiesValue}
                                            </Text>
                                        </View>
                                </TouchableWithoutFeedback>
                            )}

                            {this.state.showCities && this.state.selectedFilters.includes("Cidade") &&
                            
                            <View style = {styles.specialityContainer}>
                                <FlatList 
                                    horizontal = {true} 
                                    showsHorizontalScrollIndicator = {false}
                                    data = {this.state.cities}
                                    keyExtractor = {(item,index) => `${index}`}
                                    renderItem = {this.renderCity}
                                    />
                            </View>
                            }

                            {this.state.selectedFilters.includes("Preço") &&
                            (
                                <View style = {styles.priceInterval}>
                                    <View style = {{
                                        borderBottomWidth:1,
                                        borderTopWidth:1,
                                        borderColor:'white',
                                        width: 230,
                                        }}>
                                        <Text 
                                        style = {{
                                            fontSize: 16,
                                            color:'white',
                                            fontFamily:'Nunito_700Bold',
                                            textAlign:'center'
                                        }}>Intervalo de Preços</Text>
                                    </View>
                                    <View  style = {styles.price}>
                                        <Text style = {styles.priceText}>De </Text>
                                        <InputSpinner
                                            min={0}
                                            step={1}
                                            rounded = {false}
                                            textColor = "#007575"
                                            background = "white"
                                            color = {"#007575"}
                                            colorMin={"#007575"}
                                            value={this.state.minValue}
                                            onChange={(num) => {
                                                this.changeMinValue(num);
                                            }}
                                        />
                                    </View>

                                    <View  style = {styles.price}>
                                        <Text style = {styles.priceText}>Até</Text>
                                        <InputSpinner
                                            step={1}
                                            rounded = {false}
                                            textColor = "#007575"
                                            background = "white"
                                            color={"#007575"}
                                            value={this.state.maxValue}
                                            onChange={(num) => {
                                                this.changeMaxValue(num);
                                            }}
                                        />

                                    </View>
                                </View>
                            )}

                            <RectButton onPress = {() => this.getFilteredDoctors()} style = {styles.button}>
                                <MaterialIcons name="search" size={24} color="white"/>    
                                <Text style = {styles.buttonText}>Filtrar</Text>
                            </RectButton>
                            
                        </View>
                        </>
                    }

                    {this.state.showDocProfile && 
                        <ConsultDoctor 
                        close = {this.handleCloseProfile} 
                        data = {this.state.selectedDoctorData}
                        />
                    }

                    <View style = {{alignItems: 'center',flex:1}}>
                        <ScrollView 
                        showsVerticalScrollIndicator = {false}>
                            <View style = {{width:340}}>
                                {this.state.refresh && this.state.filteredDoctors.map((doctor) => {
                                    return <Doctor key = {`${doctor.id}`} handleDoctor = {this.handleDoctorData} doctor = {{...doctor}} />
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical:25,
        backgroundColor: "#28ADA6",
    },
    top: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingTop:20
    },
    body: {
        width:'100%',
        alignItems: 'center',
        borderRadius: 20,
    },
    title: {
        color: '#fff',
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 20,
        marginBottom:10,
        textAlign:'center'
    },
    filter: {
        justifyContent:'center',
        alignItems:'flex-start',
        marginVertical:10,
        marginLeft:10
    },
    filterBox:{
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 10
    },
    priceInterval: {
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:10,
        width: Dimensions.get('screen').width/3
    },
    price: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingTop: 10
    },  
    priceText:{
        fontSize: 16,
        color:'white',
        fontFamily: 'Nunito_700Bold',
        marginRight: 10
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 240,
        height: 50,
        backgroundColor: '#007575',
        borderRadius: 10,
        marginTop: 10,
        flexDirection:'row'
    },
    logo: {
        color: '#fff',
        fontFamily: 'KaushanScript_400Regular',
        fontSize: 20,
        fontWeight: '500',
        marginRight: 10
    },
    buttonText: {
        color: '#fff',
        fontFamily: 'Archivo_700Bold',
        marginLeft:2,
        textAlign:'center'
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
        borderColor: '#007575',
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
    },
  });
  