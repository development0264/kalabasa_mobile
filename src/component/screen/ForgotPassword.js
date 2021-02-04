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
// import { toastShow } from '../../redux/action/toast';

import InputField from '../InputField';


const required = value => (value ? undefined : 'This is a required field.');
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value) ? 'Please provide a valid email address.' : undefined;


export default class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            errors: [],
        };
    }

    ValidateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        return (false)
    }
    emailvalidate = (text) => {
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

    async submitSuccess() {

        var data = {
            // name: this.state.name,
            email: this.state.email,
            // password: this.state.password,
            // password_confirmation: this.state.password_confirmation,
        };
        try {

            var headers = new Headers();
            headers.append('Accept', '*/*');
            headers.append("Content-Type", 'application/json');
            fetch(Config.API_BASE_URL + "/auth/forgot-password", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    this.setState({ loading: false })
                    // alert(JSON.stringify(responseJson))
                    // Toast.show({ text: responseJson.message, type: 'success' })
                    // return
                    if (responseJson["status"] == "success") {
                        // this.storeData(responseJson["customer"], responseJson["access_token"]);
                        Toast.show({ text: responseJson.message, type: 'success' })
                        setTimeout(() => {
                            //Actions.login()
                            this.props.navigation.navigate('Login')
                        });
                    }
                    else {
                        this.setState({ hasError: true, errorText: 'Invalid Email Id...!' });
                    }
                })
        } catch (errors) {

            alert(errors);
        }

    }

    submitFailed() {
        //console.log("Submit Faield!");
    }


    render() {
        var { height, width } = Dimensions.get('window');
        return (

            // <KeyboardAvoidingView style={{ flexGrow: 1, justifyContent: "flex-end", backgroundColor: '#8CC63F' }} behavior="padding" enabled>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
                <Container style={{
                    backgroundColor: '#8CC63F', width: '100%',
                    justifyContent: 'center', height: height
                }}>


                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')} style={{ top: 40, left: 20, position: 'absolute', zIndex: 9999 }}>
                        <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                    </TouchableOpacity>
                    <View style={styles.mainView}>
                        <Image source={require('../../images/kalabasa_logo_new.png')} style={styles.logoStyle} />
                        <Form ref={(ref) => this.myForm = ref}
                            validate={true}
                            submit={this.submitSuccess.bind(this)}
                            failed={this.submitFailed.bind(this)}
                            errors={this.state.errors}>
                            <Item style={{ width: width * 0.7, marginTop: width * 0.25, marginBottom: 10 }}>
                                <Field
                                    required
                                    component={InputField}
                                    validations={[required, email]}
                                    name="email"
                                    value={this.state.email}
                                    onChangeText={text => this.emailvalidate(text)}
                                    customStyle={{ width: width * 0.7, height: 40, fontSize: width * 0.04 }}
                                    // customStyle={styles.text_css}
                                    placeholder="Email"
                                    placeholderTextColor="grey"
                                    errors={this.state.errors}
                                />
                            </Item>


                            <TouchableOpacity
                                style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginTop: 40 }}
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
                                    Submit
                                </Text>
                            </TouchableOpacity>
                        </Form>
                    </View>


                </Container>
            </ScrollView>
            // </KeyboardAvoidingView>

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
        height: 180,
        width: 280,
    },
    inputView: {
        top: width * 0.10,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text_css: {
        // color: 'white',
        width: '100%',
        // backgroundColor: 'red'
    },
})
