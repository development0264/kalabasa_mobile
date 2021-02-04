
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Col, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faTimes, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
//import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';


import Navbar from '../Navbar';


export default class History extends Component {

    constructor(props) {
        super(props);
        var status = this.props.account.orderstatus
        var orderstatus = status ? status.hasValue() ? status.getValue() : [] : [];
        this.state = {
            FlatListItems: [],
            orderstatus: orderstatus,
            refreshing: false
        }

        this.props.orederGetList()
    }

    // componentDidMount = async () => {
    //     this.reRenderSomething = this.props.navigation.addListener('didFocus', async () => {
    //         await this.props.orederGetList()
    //     });
    // }


    getStatus(id) {
        var status = this.state.orderstatus.filter(i => i.id == parseInt(id))
        return status.length > 0 ? status[0] : { color: 'violet', name: 'ordered' };
    }



    geticon(id) {
        var status = this.state.orderstatus.find(i => i.id == id)
        return status != undefined ? (status.name == 'error' ? faTimes : (status.name == 'pending' ? faBan : faCheck)) : faCheck;
    }


    gotoOrderDetails = async (item) => {
        await this.props.orderdetailsSetViewing(item);
        await this.props.navigation.navigate('OrderDetail')
    }

    getflag(countryid) {
        //alert(countryid)
        var country = this.props.home.country;
        var country = country.hasValue() ? country.getValue() : [];
        if (country != undefined && country.length > 0) {
            var obj = country.filter(i => i.id == countryid);
            return obj[0].name;
        } else {
            return null;
        }

    }

    _onRefresh = async () => {
        //alert('hi')
        this.setState({ refreshing: true });
        await this.props.orederGetList()
        this.setState({ refreshing: false });
    }

    render() {
        var ordersList = this.props.account.orederList
        var order = ordersList ? ordersList.hasValue() ? ordersList.getValue() : [] : [];

        // var loadStatusCollection = LoadStatusCollection.create([
        //     this.props.account.orederList,
        // ]);
        var { height, width } = Dimensions.get('window');
        var left = (

            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
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
            <Container style={{ backgroundColor: '#FFFFFF', }} RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                this._onRefresh()
            }} >

                <Navbar left={left} right={right} title="History" fontSize={30} marginLeft={28} />
                {/* <LoadStatusView loadStatus={this.props.account.orederList}> */}

                {/* <Content refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this._onRefresh()
                    }} />}> */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <FlatList
                        style={{ marginTop: 10, width: width, height: height }}
                        data={order}
                        ItemSeparatorComponent={
                            () => <View style={{ margin: 5 }} />
                        }
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this._onRefresh();
                                }}
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', width: '100%', }}>
                                <TouchableOpacity style={{ width: '25%', alignItems: 'center' }} onPress={() => this.gotoOrderDetails(item)}>
                                    {item.products && item.products.length > 0 ?
                                        <Image
                                            source={{ uri: Config.IMAGE_BASE_URL + item.products[0].cover }}
                                            style={{ height: 100, width: 70, zIndex: -9999 }}
                                        />
                                        : null}
                                    <View style={{ backgroundColor: '#F6C661', top: 15, position: 'absolute', zIndex: 9999, opacity: 0.9, }}>
                                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 20 }}>{item.id}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ width: '75%' }}>
                                    <Row>
                                        <View style={{ width: '65%', backgroundColor: '#efeff4' }}>
                                            <Text style={{ marginTop: 2, color: '#0f0101', fontSize: 14, left: 15, fontFamily: 'Muna' }} numberOfLines={2}>
                                                {item.addresses ? item.addresses.address_1 + "," + item.addresses.address_2 + "," + this.getflag(item.addresses.country_id) : null}
                                            </Text>
                                            <Text style={{ color: '#0f0101', left: 15, marginTop: 5, fontSize: 14, fontFamily: 'Muna' }}>
                                                {item.created_at}
                                            </Text>
                                            <Text style={{ color: '#707070', left: 15, marginTop: 5, fontSize: 30, fontFamily: 'Helvetica Neue' }}>
                                                € {item.total}
                                            </Text>
                                        </View>
                                        <View style={{ width: '35%', height: '100%', backgroundColor: this.getStatus(item.order_status_id).color, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                            <FontAwesomeIcon icon={this.geticon(item.order_status_id)} size={70} style={{ color: '#FFFFFF', }} />
                                            <Text style={{ color: 'white', alignSelf: 'center', fontSize: 16, fontWeight: '500' }}>{this.getStatus(item.order_status_id).name}</Text>
                                        </View>
                                    </Row>
                                </View>
                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                {/* </Content> */}
            </Container >
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