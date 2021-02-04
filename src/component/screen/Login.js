/**
* This is the Login Page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, Dimensions, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert } from 'react-native';
import { Container, Item, Input, Icon, Left, Button, Header } from 'native-base';
import { Actions } from 'react-native-router-flux';
import DeviceInfo from 'react-native-device-info';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { navigation, auth } from '../../redux/services';
import { Form, Field } from 'react-native-validate-form';
import InputField from '../InputField';
import firebase from 'react-native-firebase';


const required = value => (value ? undefined : 'This is a required field.');
const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,5}$/i.test(value) ? 'Please provide a valid email address.' : undefined;

export default class Login extends Component {
    constructor(props) {
        super(props);
        //alert(this.props.login.fcmToken)
        this.state = {
            email: '',
            password: '',
            remember_me: true,
            device_id: this.props.login.fcmToken,//DeviceInfo.getDeviceId(),
            hidePassword: true,
            loading: false,
            successScreen: null
        };
        // await this.props.FcmToken(fcmToken);
        this.checkPermission();
        this.messageListener();
    }


    checkPermission = async () => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getFcmToken();
        } else {
            this.requestPermission();
        }
    }

    getFcmToken = async () => {

        const fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // console.log("token", fcmToken);
            await this.props.FcmToken(fcmToken)
            this.setState({ device_id: fcmToken })
            // console.log("Login", this.props.login.fcmToken);
            // alert(fcmToken);
        } else {
            await this.props.FcmToken(null)
            //this.showAlert('Failed', 'No token received');
        }
    }

    requestPermission = async () => {
        try {
            await firebase.messaging().requestPermission();
            this.getFcmToken();
            // User has authorised
        } catch (error) {
            // User has rejected permissions
        }
    }

    messageListener = async () => {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            // console.log((notification));
            const { title, body, data } = notification;
            this.showAlert(title, body);
        });

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // console.log((notificationOpen));
            const { title, body } = notificationOpen.notification;
            // console.log(title, body);
            this.showAlert(title, body);
        });

        const notificationOpen = await firebase.notifications().getInitialNotification();
        // console.log((notification));
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            // console.log(title, body);
            this.showAlert(title, body);
        }

        this.messageListener = firebase.messaging().onMessage((message) => {
            // console.log(JSON.stringify(message));
            const { title, text, body, priority } = message._data;
            this.showAlert(title, text, body);
            // alert(message);
        });
    }

    showAlert = (title, message) => {
        Alert.alert(
            title,
            message,
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
    }


    setStateFromParams() {
        //alert(JSON.stringify(this.props.navigation.state))
        if (this.props.navigation.state.params && this.props.navigation.state.params.successScreen) {
            this.setState({
                successScreen: this.props.navigation.state.params.successScreen
            });
        }
    }
    componentDidMount() {
        this.setStateFromParams();
    }

    componentWillReceiveProps(nextProps) {
        this.setStateFromParams();
    }

    managePasswordVisibility = async () => {
        this.setState({ hidePassword: !this.state.hidePassword });
    }

    ValidateEmail(mail) {
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    async submitSuccess() {
        var data = {
            email: this.state.email,
            password: this.state.password,
            device_id: this.state.device_id,
            device_type: Platform.OS,
            remember_me: true
        };
        try {
            this.props.Login(data, { successScreen: this.state.successScreen })
        } catch (errors) {
            alert(errors);
        }
    }

    emailvalidate = (text) => {
        this.setState({ email: text })
        if (this.ValidateEmail(text) === false) {
            let submitResults = this.myForm.validate();

            let errors = [];

            submitResults.forEach(item => {
                errors.push({ field: item.fieldName, error: item.error });
            });
            this.setState({ errors: errors });
        }
        else {
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

    gotohome() {
        this.props.LoginGuest(null, { successScreen: this.state.successScreen })
    }

    render() {
        var { height, width } = Dimensions.get('window');
        return (
            // <KeyboardAvoidingView style={{ flexGrow: 1, justifyContent: "flex-end", backgroundColor: '#8CC63F' }} behavior="padding" enabled>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='always'>
                <Container style={{
                    backgroundColor: '#8CC63F', width: '100%',
                    justifyContent: 'center', height: height
                }}>

                    <View style={styles.mainView}>
                        <Image source={require('../../images/kalabasa_logo_new.png')} style={styles.logoStyle} />
                        <Form ref={(ref) => this.myForm = ref}
                            validate={true}
                            submit={this.submitSuccess.bind(this)}
                            failed={this.submitFailed.bind(this)}
                            errors={this.state.errors}>
                            <View style={styles.inputView}>
                                <Item style={{ width: width * 0.7, marginTop: width * 0.01 }}>
                                    <Field
                                        required
                                        component={InputField}
                                        validations={[required, email]}
                                        name="email"
                                        placeholder="Username or Email"
                                        onChangeText={(text) => this.emailvalidate(text)}
                                        //onChangeText={(text) => this.setState({ email: text })}
                                        customStyle={{ width: width * 0.7, height: 40, fontSize: width * 0.04 }}
                                        value={this.state.email}
                                        placeholderTextColor='grey'
                                        errors={this.state.errors}
                                        keyboardType="email-address"
                                    />
                                </Item>

                                <Item style={{ width: width * 0.7, marginTop: width * 0.05, justifyContent: 'space-between' }}>
                                    <Field placeholder="Password"
                                        required
                                        component={InputField}
                                        validations={[required]}
                                        onChangeText={(text) => this.setState({ password: text })}
                                        secureTextEntry={this.state.hidePassword}
                                        customStyle={{ width: width * 0.7, height: 40, fontSize: width * 0.04 }}
                                        value={this.state.password}
                                        placeholderTextColor='grey'
                                        errors={this.state.errors} />
                                    <TouchableOpacity style={{ justifyContent: 'flex-end' }} activeOpacity={0.8} onPress={this.managePasswordVisibility}>
                                        {
                                            this.state.hidePassword ? <Icon name="ios-eye-off" /> : <Icon name="ios-eye" style={{ color: 'grey' }} />
                                        }
                                    </TouchableOpacity>

                                </Item>
                                {/* <FormError>{this.state.errors['email']}</FormError> */}
                                <TouchableOpacity
                                    style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginTop: width * 0.1 }}
                                    onPress={() => this.submitForm()}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: width * 0.07,
                                            textAlign: 'center',
                                            padding: 8,
                                            paddingRight: 90,
                                            paddingLeft: 90,
                                        }}>
                                        Login
                        </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ top: width * 0.25, flexDirection: 'row', justifyContent: 'space-between', width: width * 0.7 }}>
                                <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'grey' }} onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                                    <Text style={{ marginTop: 10, color: 'grey', fontSize: width * 0.035 }}>Forgot Password</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'grey' }} onPress={() => this.gotohome()} >
                                    <Text style={{ marginTop: 10, color: 'grey', fontSize: width * 0.035 }}>Skip</Text>
                                </TouchableOpacity>
                            </View>
                        </Form>
                    </View>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginRight: 20 }}>
                        <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: 'white' }} onPress={() => this.props.navigation.navigate('Register')}>
                            <Text style={{ color: 'white', fontSize: 16, alignSelf: 'center', fontSize: width * 0.04 }}>Register</Text>
                        </TouchableOpacity>
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
        // flex: 0.8,
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
        top: width * 0.15,
        height: width * 0.5,
        width: width * 0.77,
    },
    inputView: {
        top: width * 0.20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
})
