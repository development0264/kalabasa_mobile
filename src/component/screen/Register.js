/**
* This is the Login Page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Container, Item, Input, Icon, Left, Button, Header, Toast } from 'native-base';
//import { Actions } from 'react-native-router-flux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Form, Field } from 'react-native-validate-form';
import Config from 'react-native-config';

import InputField from '../InputField';


const required = value => (value ? undefined : 'This is a required field.');
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value) ? 'Please provide a valid email address.' : undefined;

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            errors: [],
            hidePassword1: true,
            hidePassword2: true,
        };
    }


    ValidateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    emailvalidate = (text) => {
        //console.log(text);        
        if (this.ValidateEmail(text) === false) {
            this.setState({ email: text })

            let submitResults = this.myForm.validate();

            let errors = [];

            submitResults.forEach(item => {
                errors.push({ field: item.fieldName, error: item.error });
            });
            this.setState({ errors: errors });
            return false;
        }
        else {
            this.setState({ email: text })
            this.setState({ errors: [] });
        }
    }

    submitForm() {
        let submitResults = this.myForm.validate();

        let errors = [];

        submitResults.forEach(item => {
            errors.push({ field: item.fieldName, error: item.error });
        });
        this.setState({ errors: errors });
    }

    submitFailed() {
        //console.log("Submit Faield!");
    }

    managePasswordVisibility1 = async () => {
        this.setState({ hidePassword1: !this.state.hidePassword1 });
    }
    managePasswordVisibility2 = async () => {
        this.setState({ hidePassword2: !this.state.hidePassword2 });
    }

    async submitSuccess() {
        if (this.state.password !== this.state.password_confirmation) {
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
                name: this.state.name,
                email: this.state.email,
                password: this.state.password,
                password_confirmation: this.state.password_confirmation,
            };
            try {

                var headers = new Headers();
                headers.append('Accept', 'application/json');
                headers.append("Content-Type", 'application/json');
                fetch(Config.API_BASE_URL + "/auth/signup", {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify(data)
                })
                    .then((response) => response.json())
                    .then((responseJson) => {
                        this.setState({ loading: false })
                        if (responseJson["status"] == "success") {
                            // this.storeData(responseJson["customer"], responseJson["access_token"]);
                            Toast.show({ text: responseJson.message, type: 'success', duration: 5000 })
                            setTimeout(() => {
                                //Actions.login()
                                this.props.navigation.navigate('Login')
                            });
                        }
                        else {
                            console.log("responseJson", responseJson.errors.email)
                            if (responseJson.errors) {
                                if (responseJson.errors.email) {
                                    Toast.show({ text: responseJson.errors.email, type: 'danger' })
                                } else if (esponseJson.errors.name) {
                                    Toast.show({ text: responseJson.errors.name, type: 'danger' })
                                } else {
                                    Toast.show({ text: responseJson.message, type: 'danger' })
                                }
                            }
                            else {
                                Toast.show({ text: responseJson.message, type: 'danger' })
                            }
                        }
                    })
            } catch (errors) {

                alert(errors);
            }
        }
    }

    render() {
        var { height, width } = Dimensions.get('window');
        return (
            // <KeyboardAvoidingView >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                <Container style={{
                    backgroundColor: '#8CC63F', width: '100%',
                    justifyContent: 'center', height: height
                }}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={{ top: 40, left: 20, position: 'absolute', zIndex: 9999 }}>
                        <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                    </TouchableOpacity>
                    <View style={styles.mainView}>
                        <Image source={require('../../images/kalabasa_logo_new.png')} style={styles.logoStyle} />
                        <Form ref={(ref) => this.myForm = ref}
                            validate={true}
                            submit={this.submitSuccess.bind(this)}
                            failed={this.submitFailed.bind(this)}
                            errors={this.state.errors}>
                            <View style={styles.inputView}>
                                <Item style={{ width: width * 0.7, marginTop: width * 0.06 }}>
                                    <Field
                                        component={InputField}
                                        name="Username"
                                        value={this.state.name}
                                        customStyle={{ width: width * 0.7, height: 40, fontSize: width * 0.04 }}
                                        onChangeText={(text) => this.setState({ name: text })}
                                        placeholder="Username"
                                        placeholderTextColor="grey"
                                    />
                                </Item>
                                <Item style={{ width: width * 0.7, marginTop: width * 0.03 }}>
                                    <Field
                                        required
                                        component={InputField}
                                        validations={[required, email]}
                                        name="email"
                                        value={this.state.email}
                                        customStyle={{ width: width * 0.7, height: 40, fontSize: width * 0.04 }}
                                        onChangeText={text => this.emailvalidate(text)}
                                        placeholder="Email"
                                        placeholderTextColor="grey"
                                        errors={this.state.errors}
                                    />
                                </Item>
                                <Item style={{ width: width * 0.7, marginTop: width * 0.03, justifyContent: 'space-between' }}>
                                    <Field
                                        required
                                        component={InputField}
                                        validations={[required]}
                                        name="password"
                                        value={this.state.password}
                                        onChangeText={(text) => this.setState({ password: text })}
                                        customStyle={{ width: width * 0.6, height: 40, fontSize: width * 0.04 }}
                                        placeholder="Password"
                                        placeholderTextColor="grey"
                                        secureTextEntry={this.state.hidePassword1}
                                        errors={this.state.errors}
                                    />
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.managePasswordVisibility1}>
                                        {
                                            this.state.hidePassword1 ? <Icon name="ios-eye-off" /> : <Icon name="ios-eye" style={{ color: 'grey' }} />
                                        }
                                    </TouchableOpacity>
                                </Item>
                                <Item style={{ width: width * 0.7, marginTop: width * 0.03, justifyContent: 'space-between' }}>
                                    <Field
                                        required
                                        component={InputField}
                                        validations={[required]}
                                        name="password_confirmation"
                                        value={this.state.password_confirmation}
                                        secureTextEntry={this.state.hidePassword2}
                                        onChangeText={(text) => this.setState({ password_confirmation: text })}
                                        customStyle={{ width: width * 0.6, height: 40, fontSize: width * 0.04 }}
                                        placeholder=" Re-Type Password"
                                        placeholderTextColor="grey"
                                    // errors={this.state.errors}
                                    />
                                    <TouchableOpacity activeOpacity={0.8} onPress={this.managePasswordVisibility2}>
                                        {
                                            this.state.hidePassword2 ? <Icon name="ios-eye-off" /> : <Icon name="ios-eye" style={{ color: 'grey' }} />
                                        }
                                    </TouchableOpacity>
                                </Item>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginTop: width * 0.09 }}
                                    onPress={() => this.submitForm()}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: width * 0.06,
                                            textAlign: 'center',
                                            padding: 8,
                                            paddingRight: 90,
                                            paddingLeft: 90,
                                        }}>
                                        Register
                        </Text>
                                </TouchableOpacity>
                            </View>
                        </Form>
                    </View>

                </Container>
            </ScrollView>
            // </KeyboardAvoidingView >

        );
    }
}

var { height, width } = Dimensions.get('window');
const styles = StyleSheet.create({
    mainView: {
        // position: 'relative',
        // zIndex: -10,
        // flex: 0.90,
        width: '100%',
        alignSelf: 'center',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: width * 1.5,
        top: 20,
        borderBottomLeftRadius: width * 2,
        borderBottomRightRadius: width * 2,
        borderTopLeftRadius: width * 2,
        borderTopRightRadius: width * 2
    },
    logoStyle: {
        top: width * 0.10,
        height: width * 0.5,
        width: width * 0.77,
    },
    inputView: {
        top: width * 0.10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
})
