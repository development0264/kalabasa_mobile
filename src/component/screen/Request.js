
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Footer, Body, Col, Card, CardItem, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faCheck, faBan, faTimes } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Svg, { Path } from 'react-native-svg';


import Navbar from '../Navbar';
//import { RadioGroup } from 'react-native-flexi-radio-button';


export default class Request extends Component {

    constructor(props) {
        super(props);
        var status = this.props.account.orderstatus
        var orderstatus = status ? status.hasValue() ? status.getValue() : [] : [];
        this.state = {
            orderdetails: this.props.account.orderdetails,
            refreshing: false,
            orderstatus: orderstatus
        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ orderdetails: nextProps.account.orderdetails });
    }

    getStatus(id) {
        var status = this.state.orderstatus.filter(i => i.id == parseInt(id))
        return status.length > 0 ? status[0] : { color: 'violet', name: 'ordered' };
    }

    geticon(id) {
        var status = this.state.orderstatus.find(i => i.id == id)
        return status != undefined ? (status.name == 'error' ? faTimes : (status.name == 'pending' ? faBan : faCheck)) : faCheck;
    }

    _onRefresh = async () => {
        //alert('hi')
        this.setState({ refreshing: true });
        await this.props.requestmessagesGetList();
        this.setState({ refreshing: false });
    }


    render() {
        var { height, width } = Dimensions.get('window');
        var messages = this.props.account.requestmessages
        var ordermessages = messages ? messages.hasValue() ? messages.getValue() : [] : [];

        var left = (

            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('OrderDetail')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>

        );


        var right = (
            <Right style={{ flex: 1 }}>
                <Button style={{ flex: 0, marginLeft: width * 0.5, marginBottom: width * 0.05 }} transparent>
                    {/* <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} /> */}
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>

                <Navbar left={left} right={right} title="Request" fontSize={30} marginLeft={28} />
                <Content refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this._onRefresh()
                    }} />}>
                    <View style={{ flex: 1, }}>
                        {this.renderCardview()}
                        {this.renderBubble()}
                    </View>
                </Content>
                {ordermessages.length == 0 && this.state.refreshing == false ?
                    <Footer style={{ backgroundColor: '#8CC63F', height: 70 }} backgroundColor={'#8CC63F'} >
                        <Body>
                            <View style={styles.body}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('AddRequest')}
                                    style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginLeft: 0, flexDirection: 'row' }}
                                >
                                    <Image square style={{ width: 50, height: 50, marginLeft: 20, marginBottom: 5 }} source={require('../../images/user-message.png')} />
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: width * 0.06,
                                            // textAlign: 'center',
                                            padding: 5,
                                            paddingRight: 50,
                                            paddingLeft: 50,
                                            marginTop: 6,
                                            // backgroundColor: 'red',
                                        }}>
                                        Add Request
                                </Text>
                                </TouchableOpacity>
                            </View>
                        </Body>
                    </Footer>
                    : null}
            </Container>

            // </SideMenuDrawer>
        )
    }


    renderCardview() {
        return (
            <View style={{ flexDirection: 'row', top: 10, width: '100%', height: 100, }}>
                <View style={{ backgroundColor: '#efeff4', borderRightWidth: 1, width: '25%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('OrderDetail')}>
                    <Text style={{ alignSelf: 'center', marginTop: 0 }}>Order ID</Text>
                    <Text style={{ alignSelf: 'center', marginTop: 5 }}>{this.state.orderdetails.id}</Text>
                </View>
                <View style={{ width: '75%', backgroundColor: '#EFEFF4' }}>
                    <Row>
                        <View style={{ width: '65%', backgroundColor: '#efeff4' }}>
                            <Text style={{ marginTop: 2, color: '#0f0101', fontSize: 14, left: 15, fontFamily: 'Muna' }} numberOfLines={2}>
                                {this.state.orderdetails.addresses ? this.state.orderdetails.addresses.address_1 + "," + this.state.orderdetails.addresses.address_2 + "," + this.state.orderdetails.addresses.zip : null}
                            </Text>
                            <Text style={{ color: '#707070', left: 15, marginTop: 5, fontSize: 25, fontFamily: 'Helvetica Neue' }}>
                                € {this.state.orderdetails.total}
                            </Text>
                            <Text style={{ color: '#0f0101', left: 15, marginTop: 5, fontSize: 14, fontFamily: 'Muna' }}>
                                {this.state.orderdetails.created_at}
                            </Text>

                        </View>
                        <View style={{ width: '35%', height: '100%', backgroundColor: this.getStatus(this.state.orderdetails.order_status_id).color, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={this.geticon(this.state.orderdetails.order_status_id)} size={70} style={{ color: '#FFFFFF', }} />
                            <Text style={{ color: 'white', alignSelf: 'center', fontSize: 16, fontWeight: '500' }}>{this.getStatus(this.state.orderdetails.order_status_id).name}</Text>
                        </View>
                    </Row>
                </View>
            </View>
        )
    }

    renderBubble() {
        var { height, width } = Dimensions.get('window');
        var messages = this.props.account.requestmessages
        var ordermessages = messages ? messages.hasValue() ? messages.getValue() : [] : [];

        return (
            <View style={{ marginTop: 10, width: '95%' }}>

                <FlatList
                    data={ordermessages}
                    renderItem={({ item, index }) => (
                        <>
                            {item.created_id == this.props.login.login_details.getValue().id ?
                                <View style={[styles.item, styles.itemIn]}>
                                    <View style={[styles.balloon, { backgroundColor: '#EFEFF4', alignContent: 'center' }]}>
                                        <Text style={{ top: 5, color: 'black', fontSize: width * 0.05, textAlign: 'center' }}>{item.message}</Text>
                                        <View
                                            style={[
                                                styles.arrowContainer,
                                                styles.arrowLeftContainer,
                                            ]}
                                        >
                                            <Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5" enable-background="new 32.485 17.5 15.515 17.5">
                                                <Path
                                                    d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                                                    fill="#EFEFF4"
                                                    x="0"
                                                    y="0"
                                                />
                                            </Svg>
                                        </View>
                                    </View>
                                </View>
                                :
                                <View style={[styles.item, styles.itemOut]}>
                                    <View style={[styles.balloon, { backgroundColor: '#EFEFF4' }]}>
                                        <Text style={{ top: 5, color: 'black', fontSize: width * 0.05, }}>{item.message}</Text>
                                        <View
                                            style={[
                                                styles.arrowContainer,
                                                styles.arrowRightContainer,
                                            ]}
                                        >
                                            <Svg style={styles.arrowRight} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5" enable-background="new 32.485 17.5 15.515 17.5">
                                                <Path
                                                    d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                                                    fill="#EFEFF4"
                                                    x="0"
                                                    y="0"
                                                />
                                            </Svg>
                                        </View>
                                    </View>
                                </View>
                            }
                        </>
                    )}
                />

            </View>
        )
    }

}




var { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
    // item: {
    //     backgroundColor: '#f9c2ff',
    //     padding: 20,
    //     marginVertical: 8,
    //     marginHorizontal: 16,
    // },
    title: {
        fontSize: 32,
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },

    item: {
        marginVertical: moderateScale(7, 2),
        flexDirection: 'row'
    },
    itemIn: {
        alignSelf: 'flex-start',
        marginLeft: 20
    },
    itemOut: {
        alignSelf: 'flex-end',
        marginLeft: width * 0.02
    },
    balloon: {
        maxWidth: '90%',
        paddingHorizontal: moderateScale(10, 2),
        paddingTop: moderateScale(5, 2),
        paddingBottom: moderateScale(7, 2),
        borderRadius: 20,
    },
    arrowContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        flex: 1,
        // backgroundColor: 'lightgrey'
    },
    arrowLeftContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-start',

    },

    arrowRightContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    arrowLeft: {
        left: moderateScale(-6, 0.5),
        // backgroundColor: 'lightgrey'
    },

    arrowRight: {
        right: moderateScale(-6, 0.5),
    }
})