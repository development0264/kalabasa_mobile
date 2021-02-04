
import React, { Component } from 'react';
import { Image, Text, Dimensions } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody, Grid, Col, Row, Footer } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheckCircle, faTimesCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';


import Navbar from '../Navbar';


export default class Ordersuccess extends Component {

    constructor(props) {
        super(props);

    }
    render() {
        var { height, width } = Dimensions.get('window');

        var status = this.props.account.order;
        var orderstatus = status ? status.hasValue() ? status.getValue() : {} : {};

        var IsOrederSuccess = this.props.account.IsOrederSuccess;

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button style={{ flex: 0 }} onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-close" style={{ fontSize: 50, color: 'white' }} />
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
                <Navbar right={right} title={IsOrederSuccess == true ? "Success" : "Fail"} fontSize={30} />
                <View style={{ backgroundColor: '#FFFFFF', flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    {IsOrederSuccess == true ?
                        <>
                            <FontAwesomeIcon icon={faCheckCircle} size={200} style={{ color: '#8cc640', bottom: 30 }} />
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Your order is Successfully placed,</Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Please check your email for more detail.</Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Order Number : {orderstatus.id == null ? "" : orderstatus.id} </Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Order Ref. : {orderstatus.reference} </Text>
                        </>
                        : <>
                            <FontAwesomeIcon icon={faTimesCircle} size={200} style={{ color: '#d75a4a', bottom: 30 }} />
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Your order is fail,</Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Please make sure you</Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>have correct card detail.</Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>Or contact our support</Text>
                            <Text style={{ color: '#000000', fontSize: 20, textAlign: 'center', alignItems: 'center', fontFamily: "Helvetica Neue" }}>team for more detail</Text>
                        </>
                    }
                </View>
            </Container>
            // </SideMenuDrawer>
        )
    }

}