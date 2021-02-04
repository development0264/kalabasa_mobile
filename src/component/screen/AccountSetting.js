
import React, { Component } from 'react';
import { Image, View, Dimensions, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Content } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faSave } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import Autocomplete from "react-native-autocomplete-input"



import Navbar from '../Navbar';


export default class AccountSetting extends Component {

    constructor(props) {
        super(props);
        var accountLoading = this.props.account.account;
        var account = accountLoading ? accountLoading.hasValue() ? accountLoading.getValue() : {} : {};

        var country = this.props.home.country;
        var country = country.hasValue() ? country.getValue() : [];

        // alert(JSON.stringify(account))

        this.state = {
            isOnDefaultToggleSwitch: false,
            hidePassword1: true,
            hidePassword2: true,
            account: account,
            query: account ? account.country_name : null,
            country: country,
            islistopen: false
        };

    }


    managePasswordVisibility1 = async () => {
        this.setState({ hidePassword1: !this.state.hidePassword1 });
    }
    managePasswordVisibility2 = async () => {
        this.setState({ hidePassword2: !this.state.hidePassword2 });
    }

    componentWillReceiveProps(nextProps) {
        var accountLoading = nextProps.account.account;
        var account = accountLoading.hasValue() ? accountLoading.getValue() : {};
        this.setState({ account: account });

    }
    findFilm(query) {
        //method called everytime when we change the value of the input
        if (query === '' || query == null) {
            //if the query is null then return blank
            return [];
        }

        const { country } = this.state;
        //making a case insensitive regular expression to get similar value from the film json
        const regex = new RegExp(`${query.trim()}`, 'i');
        //return the filtered film array according the query from the input
        return country.filter(film => film.name.search(regex) >= 0);
    }

    customerupdate() {
        if (this.state.account.password != this.state.account.Repassword) {
            Alert.alert(
                'Passwords not mactch',
                'Passwords does not match !',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    { text: 'Ok' },
                ],
                { cancelable: false },
            )
        } else {
            var data = {
                "Fname": this.state.account.Fname,
                "Lname": this.state.account.Lname,
                "gender": this.state.account.gender,
                "nationality": this.state.account.nationality,
                "occupation": this.state.account.occupation,
                "country_id": this.state.account.country_id,
                "country_name": this.state.account.country_name,
                "password": this.state.account.password
            }
            this.props.customerupdate(data)
        }

    }



    render() {
        var { height, width } = Dimensions.get('window');
        const { query, islistopen } = this.state;
        var films = this.findFilm(query);
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.customerupdate()} transparent>
                    <FontAwesomeIcon icon={faSave} size={40} style={{ color: 'white' }} />
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>

                <Navbar left={left} right={right} title="Account" fontSize={30} marginLeft={28} />
                <View style={{ flex: 1, }}>
                    <Content>
                        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: height }}> */}
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', height: height + 50 }}>
                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black' }}>
                                <Input
                                    value={this.state.account != null ? this.state.account.name : null}
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.name = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    placeholder="User Name"
                                    placeholderTextColor='black' />
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black' }}>
                                <Input
                                    value={this.state.account != null ? this.state.account.Fname : null}
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.Fname = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    placeholder="First Name"
                                    placeholderTextColor='black' />
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black' }}>
                                <Input
                                    value={this.state.account != null ? this.state.account.Lname : null}
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.Lname = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    placeholder="Last Name"
                                    placeholderTextColor='black' />
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, marginBottom: 50, borderBottomColor: 'black' }}>
                                <Input
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.gender = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    value={this.state.account != null ? this.state.account.gender : null}
                                    placeholder="Gender"
                                    placeholderTextColor='black' />
                            </Item>

                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }} />

                            <Item style={{ width: '90%', marginTop: width * 0.04, borderBottomColor: 'black' }}>
                                <Input
                                    value={this.state.account != null ? this.state.account.email : null}
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.email = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    placeholder="Email"
                                    placeholderTextColor='black' />
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black' }}>
                                <Input
                                    placeholder="Password"
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.password = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    placeholderTextColor='black'
                                    secureTextEntry={this.state.hidePassword1} />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={this.managePasswordVisibility1}>
                                    {
                                        this.state.hidePassword1 ? <Icon name="ios-eye-off" /> : <Icon name="ios-eye" style={{ color: 'grey' }} />
                                    }
                                </TouchableOpacity>
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, marginBottom: 50, borderBottomColor: 'black' }}>
                                <Input placeholder="Re-Type Password"
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.Repassword = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    placeholderTextColor='black'
                                    secureTextEntry={this.state.hidePassword2} />
                                <TouchableOpacity activeOpacity={0.8} onPress={this.managePasswordVisibility2}>
                                    {
                                        this.state.hidePassword2 ? <Icon name="ios-eye-off" /> : <Icon name="ios-eye" style={{ color: 'grey' }} />
                                    }
                                </TouchableOpacity>
                            </Item>

                            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white' }} />

                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black', position: 'relative', zIndex: 9999 }}>
                                <Autocomplete
                                    placeholder="Preferable Product Country"
                                    placeholderTextColor='black'
                                    inputContainerStyle={styles.inputContainerStyle}
                                    listStyle={styles.listStyle}
                                    style={{ backgroundColor: "#ebeff0", fontSize: 16 }}
                                    data={films.length === 1 && comp(query, films[0].name) ? [] : films}
                                    defaultValue={query}
                                    onChangeText={text => this.setState({ islistopen: true, query: text })}
                                    renderItem={({ item, i }) => (
                                        islistopen == true ?
                                            <TouchableOpacity style={styles.item}
                                                onPress={() => {
                                                    var someProperty = { ...this.state.account }
                                                    someProperty.country_id = item.id;
                                                    someProperty.country_name = item.name;
                                                    this.setState({ account: someProperty, query: item.name, islistopen: false })
                                                    films = []
                                                }}>
                                                <Text>{item.name}</Text>
                                            </TouchableOpacity>
                                            : null
                                    )}
                                />

                                {/* <Input placeholder="Preferable Product Country" placeholderTextColor='black' /> */}
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black' }}>
                                <Input
                                    placeholder="Occupation"
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.occupation = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    value={this.state.account != null ? this.state.account.occupation : null}
                                    placeholderTextColor='black' />
                            </Item>

                            <Item style={{ width: '90%', marginTop: width * 0.02, borderBottomColor: 'black' }}>
                                <Input
                                    onChangeText={text => {
                                        var someProperty = { ...this.state.account }
                                        someProperty.nationality = text;
                                        this.setState({ account: someProperty })

                                    }}
                                    value={this.state.account != null ? this.state.account.nationality : null}
                                    placeholder="Nationality"
                                    placeholderTextColor='black' />
                            </Item>


                        </View>
                        {/* </View> */}
                    </Content>
                </View>
            </Container>
        )
    }

}

var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0
    },
    addChar: {
        zIndex: 1,
        position: 'absolute',
        fontSize: 30,
        right: 0,
        top: 0
    },
    inputContainerStyle: {
        borderBottomWidth: 1.5,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderLeftWidth: 0,
        width: width * 0.9
    },
    //listContainerStyle: { height: filteredMembers.length * 70 },
    listStyle: {
        borderColor: 'grey',
        margin: 0,
        overflow: 'scroll',
        maxHeight: 200,
        position: 'relative'
    },
    item: {
        fontSize: 16,
        borderBottomColor: 'grey',
        borderBottomWidth: 2,
        padding: 12
    }
});