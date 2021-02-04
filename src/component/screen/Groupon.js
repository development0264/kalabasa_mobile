
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Col, Toast } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faPlus, faMinus, faStar } from '@fortawesome/free-solid-svg-icons'
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';



import Navbar from '../Navbar';


export default class Groupon extends Component {

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            grouponcart: [],
            groupon: []
        };
        //AsyncStorage.setItem('groupon_cart', "");
        //this.getgroupon();
        //AsyncStorage.setItem('groupon_cart', null);
    }

    componentDidMount() {
        //this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
        this.getgroupon();
        //});
    }

    getgroupon = async () => {
        var data = {
            date: this.currentdate(),
        }
        await this.props.grouponGetList(data)
        var grouponproduct = this.props.product.grouponproduct;
        var groupproduct = grouponproduct ? grouponproduct.hasValue() ? grouponproduct.getValue() : [] : [];
        this.setState({ groupon: groupproduct });
        var groupon_cart = await AsyncStorage.getItem("groupon_cart")
        if (groupon_cart) {
            this.setState({ grouponcart: JSON.parse(groupon_cart) })
        } else {
            this.setState({ grouponcart: [] })
        }

    }

    currentdate() {
        var date = new Date();
        var firstdayDay = date.getDate();
        var firstdayMonth = date.getMonth() + 1;
        var firstdayYear = date.getFullYear();
        return ("0000" + firstdayYear.toString()).slice(-4) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("00" + firstdayDay.toString()).slice(-2);
    }

    increment() {
        this.setState({
            count: this.state.count + 1
        });
    };

    decrement() {
        this.setState({
            count: this.state.count - 1
        });
    };

    addtogrouponcart = async (item, qty) => {
        var isLoggedIn = this.props.login.login_details.hasValue();
        if (isLoggedIn) {
            var checkcart = this.state.grouponcart.filter(i => i.id == item.id);
            if (checkcart.length == 0) {
                item.qty = item.qty != undefined && item.qty != "" ? (item.qty > 0 ? item.qty : item.min_qty) : item.min_qty;
                this.state.grouponcart.push(item);
                await AsyncStorage.setItem('groupon_cart', JSON.stringify(this.state.grouponcart));
                await AsyncStorage.getItem("groupon_cart", (err, res) => {
                    if (!res) {
                        this.setState({ grouponcart: [] });
                    } else {
                        this.setState({ grouponcart: JSON.parse(res) });
                    }
                })
                this.props.grouponaddcart('Product added in cart', 'success')
            } else {
                this.props.grouponaddcart('Product already in cart', 'danger')
            }
        }
        else {
            Toast.show({
                text: 'Please login to place order', type: 'danger', position: 'bottom',
                duration: 5000
            })
        }

    }

    quantityupdate = async (item, qty) => {
        var Index = this.state.groupon.findIndex(i => i.id == item.id);
        if (Index > -1) {
            var qty =
                this.state.groupon[Index].qty != undefined && this.state.groupon[Index].qty != "" && this.state.groupon[Index].qty > 0 ?
                    parseInt(this.state.groupon[Index].qty) + qty :
                    parseInt(this.state.groupon[Index].min_qty) + qty
            this.state.groupon[Index].qty = qty;
            var grouponqty = this.state.grouponcart.filter(i => i.id == item.id);
            if (grouponqty.length > 0) {
                grouponqty[0].qty = this.state.groupon[Index].qty
                await AsyncStorage.setItem('groupon_cart', JSON.stringify(this.state.grouponcart));
                this.props.grouponaddcart('Product quntity update!', 'success')
            }
            let items = [];
            this.state.groupon.map((item) => {
                items.push(item);
            });
            this.setState({ groupon: items });

        }

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

    getleftdays = (enddate) => {
        var Difference_In_Time = new Date(enddate.split(" ")[0]).getTime() - new Date().getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return parseInt(Difference_In_Days) + 1

    }

    gotoproductdeatils = async (content, type) => {
        var productdetails = await this.props.productGetList(content.id, type)
        await this.props.navigation.navigate('ProductDetails')
        //await this.props.navigation.navigate('Search');
    }


    render() {
        var { height, width } = Dimensions.get('window');

        var cart = this.props.cart.cart
        var total_products = cart.hasValue() ? cart.getValue().length : 0;


        total_products = total_products + this.state.grouponcart.length

        var grouponproduct = this.props.product.grouponproduct;
        var groupproduct = grouponproduct ? grouponproduct.hasValue() ? grouponproduct.getValue() : [] : [];

        var isLoggedIn = this.props.login.login_details.hasValue();

        var left = (

            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>

        );

        var loadStatusCollection = LoadStatusCollection.create([
            this.props.product.grouponproduct
        ]);

        var right = isLoggedIn ? (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button style={{ flex: 0 }} onPress={() => this.props.navigation.navigate('CartDetails')} transparent>
                    <Icon type="AntDesign" name="shoppingcart" style={{ fontSize: 40, color: 'white', fontFamily: "Helvetica Neue" }} />
                    {total_products > 0 ?
                        <View style={{ position: 'absolute', top: -10, right: 5, justifyContent: 'flex-start', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                            <Text style={{ color: 'white', fontFamily: "Helvetica Neue" }}>{total_products}</Text>
                        </View>
                        : null}
                </Button>
            </Right>
        ) : null;

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF' }}>

                <Navbar left={left} right={right} title="Groupon" fontSize={30} marginLeft={28} />
                <LoadStatusView loadStatus={loadStatusCollection} />
                {groupproduct.length > 0 ?
                    <View style={{ flex: 1 }}>
                        <FlatList
                            style={{ flex: 1, marginTop: 0, width: width, }}
                            data={groupproduct}
                            ItemSeparatorComponent={
                                () => <View style={{ marginBottom: 15, backgroundColor: 'red' }} />
                            }
                            renderItem={({ item, index }) => (
                                //console.log(index),
                                <View style={{ flex: 1 }}>

                                    <View style={{ flex: 1, width: width, height: height * 0.415 }}>
                                        <View style={{ height: '60%', flexDirection: 'row', width: '100%', alignSelf: 'center' }}>
                                            <Image
                                                source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                                style={{ height: 175, width: 170, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}
                                            />
                                            <View style={{ width: '50%', justifyContent: "center", alignSelf: 'center', }}>
                                                <Text style={{ alignSelf: 'center', fontSize: width * 0.055, color: 'grey' }}>DAYS LEFT</Text>
                                                <Text style={{ alignSelf: 'center', fontSize: width * 0.07, fontWeight: 'bold', color: 'grey' }}>{this.getleftdays(item.end_date)}</Text>

                                                <Text style={{ alignSelf: 'center', fontSize: width * 0.055, color: 'grey' }}>ITEMS LEFT</Text>
                                                <Text style={{ alignSelf: 'center', fontSize: width * 0.07, fontWeight: 'bold', color: 'grey' }}>{item.remaining_quantity}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity onPress={() => this.addtogrouponcart(item)} style={{ top: height * 0.2, height: 60, width: 60, borderRadius: 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'absolute', zIndex: 9999, right: 10, backgroundColor: index % 2 == 0 ? '#8cc640' : '#F4B83A' }}>
                                            <Icon name="ios-add" type="Ionicons" style={{ fontSize: 60, color: 'white' }} />
                                        </TouchableOpacity>
                                        <View style={{ height: '40%', width: '100%', backgroundColor: index % 2 == 0 ? '#F4B83A' : '#8cc640' }}>

                                            <TouchableOpacity onPress={() => this.gotoproductdeatils(item, 'Groupon')} >
                                                <Text style={{ color: 'white', fontSize: 22, marginLeft: 20, textAlign: 'left' }}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>

                                            <Row style={{ alignSelf: 'center' }}>
                                                <Col style={{ flexDirection: 'row', marginLeft: 20, alignSelf: 'center' }}>
                                                    {/* <Text> {this.getcartqty(item)}</Text>
                                                <Text> {item.min_qty}</Text> */}
                                                    <Button transparent icon onPress={() => (this.getcartqty(item) > item.min_qty ? this.quantityupdate(item, -1) : item.min_qty)}>
                                                        <FontAwesomeIcon icon={faMinus} size={30} style={{ color: 'white' }} />
                                                    </Button>
                                                    <View style={{ marginRight: 10, marginLeft: 10, alignSelf: 'flex-start', }}>
                                                        <Text style={{ fontSize: 30, color: 'white', bottom: 5 }}>{this.getcartqty(item)}</Text>
                                                    </View>
                                                    <Button transparent icon onPress={() => this.quantityupdate(item, 1)}>
                                                        <FontAwesomeIcon icon={faPlus} size={30} style={{ color: 'white' }} />
                                                    </Button>
                                                </Col>
                                                <Text style={{ textAlign: 'center', alignSelf: 'center', color: 'white', fontSize: 35, right: 20 }}>
                                                    € {parseFloat((item.qty == undefined ? 1 : item.qty) * item.price).toFixed(2)}
                                                </Text>
                                            </Row>

                                            <Text style={{ color: 'white', fontSize: 20, marginLeft: 20, bottom: 5 }}>Min. QTY {item.min_qty}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                    :
                    <View style={{ marginTop: height * 0.38 }}>
                        <FontAwesomeIcon icon={faStar} size={40} style={{ color: '#8CC63F', alignSelf: 'center' }} />
                        <Text style={{ fontSize: width * 0.05, fontWeight: '500', alignSelf: 'center' }}>No GroupOn Items...!</Text>
                    </View>
                }
            </Container>
            // </SideMenuDrawer>
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
})