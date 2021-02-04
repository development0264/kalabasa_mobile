
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Footer, Body, Col, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faTimesCircle, faPlus, faMinus, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';


import Navbar from '../Navbar';



export default class CartItem extends Component {

    constructor(props) {
        super(props);
        var cart = this.props.cart.cart;
        var cartdetails = cart != undefined ? cart.hasValue() ? cart.getValue() : [] : [];
        //var total_products = cart != undefined ? (cart.hasValue() ? cart.getValue().length : 0) : 0;
        this.state = {
            total: 0,
            cartdetails: cartdetails,
            grouponcart: []
        };
        //this.gettotalamount = this.gettotalamount.bind(this)
        // this.decrement = this.decrement.bind(this)    
        this.grouponcart();
    }

    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
            this.grouponcart();
        });
    }

    grouponcart = async () => {
        var groupon_cart = await AsyncStorage.getItem("groupon_cart")
        if (groupon_cart) {
            this.setState({ grouponcart: JSON.parse(groupon_cart) })
        } else {
            this.setState({ grouponcart: [] })
        }
    }

    componentWillReceiveProps() {
        var cart = this.props.cart.cart;
        var cartdetails = cart.hasValue() ? cart.getValue() : [];
        if (cartdetails.length > 0) {
            this.setState({ cartdetails: cartdetails })
        } else {
            this.setState({ cartdetails: [] })
        }

    }

    quantityupdate = async (rowId, qty) => {
        var data = {
            "rowId": rowId,
            "qty": qty
        }
        await this.props.cartGetList()
        await this.props.cartupdate(data)
    }

    removecart = async (rowId) => {
        var data = {
            "rowId": rowId,
        }
        await this.props.cartGetList()
        await this.props.removecart(data)
    }

    gettotalamount() {
        let total = 0;
        this.state.cartdetails.map((item, i) => {
            total = total + (item.qty * item.price)
        })
        this.state.grouponcart.map((item, i) => {
            total = total + (item.qty * item.price)
        })
        return parseFloat(total).toFixed(2)
    }

    gotoaddress = async () => {
        await this.props.addressGetList()
        await this.props.navigation.navigate('Address', { Page: 'CartItem' })
    }

    quantityupdategroupon = async (item, qty) => {
        var grouponqty = this.state.grouponcart.filter(i => i.id == item.id);
        if (grouponqty.length > 0) {
            grouponqty[0].qty = grouponqty[0].qty + qty
            await AsyncStorage.setItem('groupon_cart', JSON.stringify(this.state.grouponcart));
        }
        let items = [];
        this.state.grouponcart.map((item) => {
            items.push(item);
        });
        this.setState({ grouponcart: items });
        this.props.grouponaddcart('Product quntity update!', 'success')

    }

    removegroupcart = async (item) => {
        var Index = this.state.grouponcart.findIndex(i => i.id == item.id);
        if (Index > -1) {
            this.state.grouponcart.splice(Index, 1)
            await AsyncStorage.setItem('groupon_cart', JSON.stringify(this.state.grouponcart));
            let items = [];
            this.state.grouponcart.map((item) => {
                items.push(item);
            });
            this.setState({ grouponcart: items });
        }
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>
                <Navbar left={left} title="Cart" fontSize={30} marginLeft={28} />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    {this.state.cartdetails.length == 0 && this.state.grouponcart.length == 0 ?

                        <View>
                            <FontAwesomeIcon icon={faShoppingCart} size={40} style={{ color: '#8CC63F', alignSelf: 'center' }} />
                            <Text style={{ fontSize: width * 0.05, fontWeight: '500' }}>Your Cart is Empty...!</Text>
                        </View>
                        :
                        <Content>
                            {this.state.grouponcart.length > 0 ?
                                <>
                                    {this.renderFlat()}
                                    {this.renderGroupFlat()}
                                </>
                                : this.renderFlat()}
                        </Content>
                    }
                </View>

                {this.state.cartdetails.length > 0 || this.state.grouponcart.length > 0 ?
                    <Footer style={{ backgroundColor: '#8CC63F', height: 70 }} backgroundColor={'#8CC63F'} >

                        <View style={styles.body}>
                            <Text style={{ color: 'white', textAlign: 'center', width: '50%', fontSize: 25 }}>Total:{' '}
                                <Text>{this.gettotalamount()}</Text>
                            </Text>

                            <TouchableOpacity
                                onPress={() => this.gotoaddress()}
                                style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginTop: 0 }}

                            >
                                <Text
                                    style={{
                                        color: 'white',
                                        fontSize: width * 0.06,
                                        textAlign: 'center',
                                        padding: 3,
                                        paddingRight: 20,
                                        paddingLeft: 20,
                                    }}>
                                    PAY NOW
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </Footer>
                    : null}
            </Container>

            // </SideMenuDrawer>
        )
    }


    renderFlat() {
        var { height, width } = Dimensions.get('window');
        var cart = this.props.cart.cart;
        var cartdetails = cart.hasValue() ? cart.getValue() : [];

        return (
            <View style={{ marginTop: 5 }}>
                <FlatList
                    data={this.state.cartdetails}
                    //style={{ backgroundColor: 'red' }}
                    renderItem={({ item }) => (
                        <View>
                            <View style={{ flexDirection: 'row', width: '100%', padding: 12, }}>
                                <View style={{ width: '33.33%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: item.product.cover }}
                                        style={{ width: 130, height: 130 }}
                                    />
                                </View>
                                <TouchableOpacity onPress={() => this.removecart(item.rowId)} style={{ backgroundColor: 'reds', right: 0, top: 0, position: 'absolute', zIndex: 9999 }} >
                                    <FontAwesomeIcon icon={faTimesCircle} size={25} style={{ color: 'red' }} />
                                </TouchableOpacity>
                                <View style={{ width: '66.66%', backgroundColor: '#F4B83A', position: 'relative' }}>
                                    <Row style={{ justifyContent: 'space-between' }}>
                                        <Text style={{ color: 'white', fontSize: 20, height: 75, marginTop: 5, marginLeft: 10 }}>
                                            {item.name}
                                        </Text>
                                    </Row>
                                    <Row style={{ justifyContent: 'space-between' }}>
                                        <Col style={{ flexDirection: 'row', marginLeft: 10, alignSelf: 'center' }}>
                                            <Button block icon transparent onPress={() => this.quantityupdate(item.rowId, (item.qty - 1) >= 1 ? -1 : 0)} >
                                                <FontAwesomeIcon icon={faMinus} size={22} style={{ color: 'white' }} />
                                            </Button>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, marginLeft: 10, marginBottom: 5 }}>
                                                <Text style={{ fontSize: 22, marginLeft: 10, color: 'white' }}>{item.qty}</Text>
                                            </View>
                                            <Button block icon transparent onPress={() => this.quantityupdate(item.rowId, 1)}>
                                                <FontAwesomeIcon icon={faPlus} size={22} style={{ color: 'white' }} />
                                            </Button>
                                        </Col>
                                        <Col style={{ flexDirection: 'row', right: 10, justifyContent: 'flex-end', alignSelf: 'center' }}>
                                            <Text style={{ color: 'white', fontSize: 25, right: 20 }}>
                                                € {parseFloat(item.qty * item.price).toFixed(2)}
                                            </Text>
                                        </Col>
                                    </Row>
                                </View>
                            </View>


                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        )
    }

    getcartqty = (item) => {
        if (this.state.grouponcart.length > 0) {
            var grouponqty = this.state.grouponcart.filter(i => i.id == item.id);
            if (grouponqty.length > 0) {
                item.qty = grouponqty[0].qty;
                return grouponqty[0].qty;
            } else {
                return item.qty != undefined && item.qty != "" ? (item.qty > 0 ? item.qty : item.min_qty) : item.min_qty;
            }
        } else {
            return item.qty != undefined && item.qty != "" ? (item.qty > 0 ? item.qty : item.min_qty) : item.min_qty;
        }
    }

    renderGroupFlat() {
        var cart = this.props.cart.cart;
        return (
            <FlatList
                data={this.state.grouponcart}
                //style={{ padding: 10, backgroundColor: 'red' }}
                renderItem={({ item }) => (
                    <View>
                        <View style={{ flexDirection: 'row', width: '100%', padding: 12, }}>
                            <View style={{ width: '33.33%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                    style={{ width: 130, height: 150 }}
                                />
                            </View>
                            <TouchableOpacity onPress={() => this.removegroupcart(item)} style={{ backgroundColor: 'reds', right: 0, top: 0, position: 'absolute', zIndex: 9999 }} >
                                <FontAwesomeIcon icon={faTimesCircle} size={25} style={{ color: 'red' }} />
                            </TouchableOpacity>
                            <View style={{ width: '66.66%', backgroundColor: '#F4B83A', position: 'relative' }}>
                                <Row style={{ justifyContent: 'space-between' }}>
                                    <Text style={{ color: 'white', fontSize: 20, height: 75, marginTop: 5, marginLeft: 10 }}>
                                        {item.name}
                                    </Text>
                                </Row>
                                <View style={{ left: 10, justifyContent: 'flex-start', alignSelf: 'flex-start', borderRadius: 100, backgroundColor: '#8cc640', height: 25, width: 80, }}>
                                    <Text style={{ textAlign: 'center', color: 'white', fontSize: 16 }}>Group On</Text>
                                </View>
                                <Row style={{ justifyContent: 'space-between' }}>
                                    <Col style={{ flexDirection: 'row', marginLeft: 10, alignSelf: 'center' }}>
                                        <Button block icon transparent onPress={() => (this.getcartqty(item) > item.min_qty ? this.quantityupdategroupon(item, -1) : item.min_qty)}  >
                                            <FontAwesomeIcon icon={faMinus} size={22} style={{ color: 'white' }} />
                                        </Button>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginRight: 20, marginLeft: 10, marginBottom: 5 }}>
                                            <Text style={{ fontSize: 22, marginLeft: 10, color: 'white' }}>{item.qty}</Text>
                                        </View>
                                        <Button block icon transparent onPress={() => this.quantityupdategroupon(item, 1)}>
                                            <FontAwesomeIcon icon={faPlus} size={22} style={{ color: 'white' }} />
                                        </Button>
                                    </Col>
                                    <Col style={{ flexDirection: 'row', right: 10, justifyContent: 'flex-end', alignSelf: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: 25, right: 20 }}>
                                            € {parseFloat(item.qty * item.price).toFixed(2)}
                                        </Text>
                                    </Col>
                                </Row>
                            </View>
                        </View>


                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        )
    }

}




var { height, width } = Dimensions.get('window');
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
        flex: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        height: '100%',
        marginTop: width * 0.01
    },
})