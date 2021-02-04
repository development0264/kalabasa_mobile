
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Footer, Body, Col } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faTimes, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';


import Navbar from '../Navbar';


export default class OrderDetail extends Component {

    constructor(props) {
        super(props);
        var status = this.props.account.orderstatus
        var orderstatus = status ? status.hasValue() ? status.getValue() : [] : [];
        this.state = {
            //orderdetails: this.props.account.orderdetails,
            orderstatus: orderstatus
        };
    }

    // componentDidMount() {
    //     this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
    //         this.setState({ orderdetails: this.props.account.orderdetails });
    //     });
    // }


    // componentWillReceiveProps(nextProps) {
    //     this.setState({ orderdetails: nextProps.account.orderdetails });
    // }

    getOrderStatus(id) {
        var status = this.state.orderstatus.filter(i => i.id == parseInt(id))
        return status.length > 0 ? status[0] : { color: 'violet', name: 'ordered' };
    }

    getOrdericon(id) {
        var status = this.state.orderstatus.find(i => i.id == id)
        return status != undefined ? (status.name == 'error' ? faTimes : (status.name == 'pending' ? faBan : faCheck)) : faCheck;
    }

    orderrequest = async () => {
        await this.props.requestmessagesGetList()
        await this.props.navigation.navigate('Request')
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('History')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.orderrequest()} style={{ marginLeft: width * 0.5, }} transparent>
                    {/* <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} /> */}
                    <Image square style={{ width: 50, height: 50, }} source={require('../../images/user-message.png')} />
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>

                <Navbar left={left} right={right} title="Order Detail" fontSize={30} marginLeft={28} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    {this.renderCardview()}
                    {this.renderFlat()}
                </View>
                {/* {this.renderFlat()} */}
            </Container>

            // </SideMenuDrawer>
        )
    }

    renderCardview() {
        var orderdetails = this.props.account.orderdetails;
        return (
            <View style={{ flexDirection: 'row', top: 10, width: '100%', height: 120, }}>
                <View style={{ backgroundColor: '#efeff4', borderRightWidth: 1, width: '25%', alignItems: 'center', justifyContent: 'center' }} onPress={() => this.props.navigation.navigate('OrderDetail')}>
                    <Text style={{ alignSelf: 'center', marginTop: 0 }}>Order ID</Text>
                    <Text style={{ alignSelf: 'center', marginTop: 5 }}>{orderdetails.id}</Text>
                </View>
                <View style={{ width: '75%', backgroundColor: '#EFEFF4' }}>
                    <Row>
                        <View style={{ width: '65%', backgroundColor: '#efeff4' }}>
                            <Text style={{ marginTop: 2, color: '#0f0101', fontSize: 14, left: 15, fontFamily: 'Muna' }} numberOfLines={2}>
                                {orderdetails.addresses ? orderdetails.addresses.address_1 + "," + orderdetails.addresses.address_2 + "," + orderdetails.addresses.zip : null}
                            </Text>
                            <Text style={{ color: '#707070', left: 15, marginTop: 5, fontSize: 25, fontFamily: 'Helvetica Neue' }}>
                                € {orderdetails.total}
                            </Text>
                            <Text style={{ color: '#0f0101', left: 15, marginTop: 5, fontSize: 14, fontFamily: 'Muna' }}>
                                {orderdetails.created_at}
                            </Text>
                            <Text style={{ color: '#0f0101', left: 15, marginTop: 5, fontSize: 14, fontFamily: 'Roboto' }}>
                                Delivery Charges: € {orderdetails.delivery_fee ? orderdetails.delivery_fee : 0}
                            </Text>
                        </View>
                        <View style={{ width: '35%', height: '100%', backgroundColor: this.getOrderStatus(orderdetails.order_status_id).color, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                            <FontAwesomeIcon icon={this.getOrdericon(orderdetails.order_status_id)} size={70} style={{ color: '#FFFFFF', }} />
                            <Text style={{ color: 'white', alignSelf: 'center', fontSize: 16, fontWeight: '500' }}>{this.getOrderStatus(orderdetails.order_status_id).name}</Text>
                        </View>
                    </Row>
                </View>
            </View>
        )
    }


    renderFlat() {
        var { height, width } = Dimensions.get('window');
        var orderdetails = this.props.account.orderdetails;
        return (
            <FlatList
                style={{ marginTop: 10, width: width * 0.99 }}
                data={orderdetails.products}
                // ListFooterComponent={this.renderFooter}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', marginBottom: 10, height: 110, marginTop: 5 }}>
                        <View>
                            <Image
                                source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                style={{ height: 110, width: 100 }}
                            />
                        </View>
                        <View style={{ width: width * 0.74, marginLeft: 5, backgroundColor: '#F4B83A' }}>
                            {/* <TouchableOpacity style={{ marginLeft: width * 0.69 }} >
                            <FontAwesomeIcon icon={faTimesCircle} size={25} style={{ color: 'red' }} />
                        </TouchableOpacity> */}
                            <Row style={{ justifyContent: 'space-between' }}>
                                <Text style={{ color: 'white', fontSize: 20, height: 60, marginTop: 5, marginLeft: 10 }}>
                                    {item.name}
                                </Text>
                            </Row>

                            <Row style={{ justifyContent: 'space-between' }}>
                                <Col style={{ flexDirection: 'row', marginLeft: 10 }}>
                                    {/* <Button block icon transparent onPress={() => this.decrement()} > */}
                                    <FontAwesomeIcon icon={faTimes} size={25} style={{ color: 'white', marginTop: 10 }} />
                                    {/* </Button> */}
                                    <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, marginLeft: 5, marginBottom: 10 }}>
                                        <Text style={{ fontSize: 26, marginLeft: 10, color: 'white' }}>{item.pivot.quantity}</Text>
                                    </View>
                                    {/* <Button block icon transparent onPress={() => this.increment()}>
                                        <FontAwesomeIcon icon={faPlus} size={22} style={{ color: 'white' }} />
                                    </Button> */}
                                </Col>

                                <Text style={{ color: 'white', marginTop: 10, marginRight: 50, fontSize: 26, height: 37.5 }}>
                                    € {parseFloat(item.price * item.pivot.quantity).toFixed(2)}
                                </Text>
                            </Row>
                        </View>
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        )
    }

}





const styles = StyleSheet.create({
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    body: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 20
    },
})