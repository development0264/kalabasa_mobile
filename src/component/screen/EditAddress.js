
import React, { Component } from 'react';
import { Image, View, Dimensions, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Content, Toast } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faSave } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import ToggleSwitch from 'toggle-switch-react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Autocomplete from "react-native-autocomplete-input"

import Navbar from '../Navbar';


export default class EditAddress extends Component {

    constructor(props) {
        super(props);
        //alert(JSON.stringify(this.props.address.viewaddress))
        var country = this.props.home.country;
        var country = country.hasValue() ? country.getValue() : [];

        var obj = this.props.address.viewaddress != null ? country.filter(i => i.id == this.props.address.viewaddress.country_id) : null;
        this.state = {
            isOnDefaultToggleSwitch: this.props.address.viewaddress != null ? this.props.address.viewaddress.status : false,
            viewaddress: this.props.address.viewaddress != null ? this.props.address.viewaddress : {},
            userDetail: this.props.login.login_details != null && this.props.login.login_details.hasValue() ? this.props.login.login_details.getValue() : null,
            query: obj != null && obj.length > 0 ? obj.name : null,
            country: country,
            islistopen: false
        };
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            //query: nextProps.address.viewaddress != null ? this.state.country.filter(i=>i.id == this.props.address.viewaddress.country_id)[0].name : null,
            viewaddress: nextProps.address.viewaddress != null ? nextProps.address.viewaddress : {},
            isOnDefaultToggleSwitch: nextProps.address.viewaddress != null ? nextProps.address.viewaddress.is_default : 0
        });
    }


    saveaddress = async () => {
        var addressLoadStatus = this.props.address.address;
        var address = addressLoadStatus ? addressLoadStatus.hasValue() ? addressLoadStatus.getValue() : [] : [];

        if (this.state.viewaddress && (this.state.viewaddress.phone == null || this.state.viewaddress.phone == "")) {
            Toast.show({ text: 'Phone number must be required', type: 'danger' })
            return
        }
        if (this.state.viewaddress && this.state.viewaddress.id != null) {
            this.state.viewaddress.status = 1;
            if (this.state.isOnDefaultToggleSwitch == true) {
                var obj = address.filter(i => i.is_default == true)
                if (obj.length > 0 && obj[0].id != this.state.viewaddress.id) {
                    Alert.alert(
                        "Confirmation",
                        "Do you want to make this address default?",
                        [
                            {
                                text: "No",
                                onPress: async () => {
                                    this.state.viewaddress.is_default = 0;
                                    await this.props.saveaddress(this.state.viewaddress)
                                    this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                                    await this.props.navigation.navigate('Address')
                                },
                            },
                            {
                                text: "Yes", onPress: async () => {
                                    this.state.viewaddress.is_default = 1;
                                    await this.props.updateaddress(this.state.viewaddress)
                                    this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                                    await this.props.navigation.navigate('Address')

                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else {
                    this.state.viewaddress.is_default = 1;
                    await this.props.updateaddress(this.state.viewaddress)
                    this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                    await this.props.navigation.navigate('Address')
                }
            } else {
                this.state.viewaddress.is_default = 0;
                await this.props.updateaddress(this.state.viewaddress)
                this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                await this.props.navigation.navigate('Address')
            }
        }
        else {
            this.state.viewaddress.status = 1;
            this.state.viewaddress.customer_id = this.state.userDetail.id;
            if (this.state.isOnDefaultToggleSwitch == true) {
                var obj = address.filter(i => i.is_default == true)
                if (obj.length > 0) {
                    Alert.alert(
                        "Confirmation",
                        "Do you want to make this address default?",
                        [
                            {
                                text: "No",
                                onPress: async () => {
                                    this.state.viewaddress.is_default = 0;
                                    await this.props.saveaddress(this.state.viewaddress)
                                    this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                                    await this.props.navigation.navigate('Address')
                                },
                                style: "cancel"
                            },
                            {
                                text: "Yes", onPress: async () => {
                                    this.state.viewaddress.is_default = 1;
                                    await this.props.saveaddress(this.state.viewaddress)
                                    this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                                    await this.props.navigation.navigate('Address')
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else {
                    this.state.viewaddress.is_default = 1;
                    await this.props.saveaddress(this.state.viewaddress)
                    this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                    await this.props.navigation.navigate('Address')

                }
            } else {
                await this.props.saveaddress(this.state.viewaddress)
                this.setState({ viewaddress: null, isOnDefaultToggleSwitch: false })
                await this.props.navigation.navigate('Address')

            }

        }

    }

    deleteaddress = async () => {

        await this.props.deleteaddress(this.state.viewaddress.id)
        this.props.navigation.navigate('Address')
    }

    findFilm(query) {
        //alert(JSON.stringify(query))
        //method called everytime when we change the value of the input
        if (query === '' || query === null) {
            //if the query is null then return blank
            return [];
        }

        const { country } = this.state;
        console.log("new query==>", query);

        //making a case insensitive regular expression to get similar value from the film json
        const regex = query != undefined ? new RegExp(`${query.trim()}`, 'i') : 'IRELAND';
        //return the filtered film array according the query from the input
        return country.filter(film => film.name.search(regex) >= 0);
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var { query, country, islistopen } = this.state;
        query = (this.props.address.viewaddress != null ? this.state.country.filter(i => i.id == this.props.address.viewaddress.country_id)[0].name : query)

        const films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        //alert(JSON.stringify(query))
        var left = (
            <Left style={{ flex: 1, alignSelf: 'center', }}>
                <Button onPress={() => this.props.navigation.navigate('Address')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center', }}>
                <TouchableOpacity style={{ alignItems: 'center', width: 40, height: 40 }} onPress={() => this.saveaddress()} transparent>
                    <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} />
                </TouchableOpacity>
            </Right>
        );

        return (
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>
                <Navbar left={left} right={right} title="Address Edit" fontSize={30} marginLeft={28} />
                <ScrollView contentContainerStyle={{ flexGrow: 2 }}>
                    <View style={{ flex: 1 }}>
                        <Content>
                            <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                <View style={{ flex: 0 }}>
                                    <Item style={{ width: '90%', marginTop: width * 0.03, borderBottomColor: 'black' }}>
                                        <Input placeholder="Name"
                                            disabled
                                            placeholderTextColor='black'
                                            value={this.state.userDetail.name}

                                        />
                                    </Item>

                                    <Item style={{ width: '90%', marginTop: width * 0.01, marginBottom: 30, borderBottomColor: 'black' }}>
                                        <Input placeholder="Mobile No." required
                                            value={this.state.viewaddress != null ? this.state.viewaddress.phone : null}
                                            onChangeText={text => {
                                                var someProperty = { ...this.state.viewaddress }
                                                someProperty.phone = text;
                                                this.setState({ viewaddress: someProperty })
                                            }}
                                            placeholderTextColor='black' />
                                    </Item>

                                    <Item style={{ width: '90%', marginTop: width * 0.03, borderBottomColor: 'black' }}>
                                        <Input placeholder="Flat No."
                                            value={this.state.viewaddress != null ? this.state.viewaddress.address_1 : null}
                                            onChangeText={text => {
                                                var someProperty = { ...this.state.viewaddress }
                                                someProperty.address_1 = text;
                                                this.setState({ viewaddress: someProperty })
                                            }}
                                            placeholderTextColor='black' />
                                    </Item>

                                    <Item style={{ width: '90%', marginTop: width * 0.01, borderBottomColor: 'black' }}>
                                        <Input placeholder="Street"
                                            value={this.state.viewaddress != null ? this.state.viewaddress.address_2 : null}
                                            onChangeText={text => {
                                                var someProperty = { ...this.state.viewaddress }
                                                someProperty.address_2 = text;
                                                this.setState({ viewaddress: someProperty })
                                            }}
                                            placeholderTextColor='black' />
                                    </Item>

                                    <Item style={{ width: '90%', marginTop: width * 0.01, borderBottomColor: 'black' }}>
                                        <Input placeholder="City"
                                            value={this.state.viewaddress != null ? this.state.viewaddress.city : null}
                                            onChangeText={text => {
                                                var someProperty = { ...this.state.viewaddress }
                                                someProperty.city = text;
                                                this.setState({ viewaddress: someProperty })
                                            }}
                                            placeholderTextColor='black' />
                                    </Item>

                                    <Item style={{ width: '90%', marginTop: width * 0.01, borderBottomColor: 'black', position: 'relative', zIndex: 9999 }}>
                                        <Autocomplete
                                            placeholder="Country"
                                            placeholderTextColor='black'
                                            keyboardShouldPersistTaps="true"
                                            inputContainerStyle={{ borderWidth: 0, width: width * 0.9, marginTop: width * 0.03, padding: 5 }}
                                            listStyle={{
                                                position: 'relative', maxHeight: 155,
                                            }}
                                            style={{ backgroundColor: "#ebeff0", fontSize: 16 }}
                                            data={films.length === 1 && comp(query, films[0].name) ? [] : films}
                                            defaultValue={query}
                                            onChangeText={text => this.setState({ query: text, islistopen: true })}
                                            renderItem={({ item, i }) => (
                                                islistopen == true ?
                                                    <TouchableOpacity
                                                        style={{
                                                            width: '100%',
                                                            borderWidth: 1,
                                                            marginTop: 2,
                                                            borderColor: 'grey',
                                                            paddingVertical: 10,
                                                            paddingLeft: 10,
                                                        }}
                                                        onPress={(text) => {
                                                            var someProperty = { ...this.state.viewaddress }
                                                            someProperty.country_id = item.id;
                                                            this.setState({ viewaddress: someProperty, query: item.name, islistopen: false })
                                                        }}>
                                                        <Text>{item.name}</Text>
                                                    </TouchableOpacity>
                                                    : null
                                            )}
                                        />
                                    </Item>

                                    <Item style={{ width: '90%', marginTop: width * 0.01, borderBottomColor: 'black' }}>
                                        <Input placeholder="EirCode"
                                            value={this.state.viewaddress != null ? this.state.viewaddress.zip : null}
                                            onChangeText={text => {
                                                var someProperty = { ...this.state.viewaddress }
                                                someProperty.zip = text;
                                                this.setState({ viewaddress: someProperty })
                                            }}
                                            placeholderTextColor='black' />
                                    </Item>
                                </View>
                                <View style={{ marginRight: width * 0.55, marginTop: width * 0.03, flexDirection: 'row' }}>
                                    <ToggleSwitch
                                        isOn={this.state.isOnDefaultToggleSwitch}
                                        onColor="#8CC63F"
                                        offColor="lightgrey"
                                        size="medium"
                                        onToggle={isOnDefaultToggleSwitch => {
                                            this.setState({ isOnDefaultToggleSwitch: isOnDefaultToggleSwitch })
                                        }}
                                    />
                                    <Text style={{ marginLeft: width * 0.05, fontSize: width * 0.05 }}>Default</Text>
                                </View>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#d75a4a', borderRadius: 32, marginTop: 40 }}
                                    onPress={() => this.deleteaddress()}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: width * 0.06,
                                            textAlign: 'center',
                                            padding: 10,
                                            paddingRight: 110,
                                            paddingLeft: 110,
                                        }}>
                                        DELETE
                                </Text>
                                </TouchableOpacity>
                            </View>
                        </Content>
                    </View>

                </ScrollView>
            </Container>
        )
    }

}