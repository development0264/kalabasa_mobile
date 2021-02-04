
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, AsyncStorage, RefreshControl } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Col, Toast } from 'native-base';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
// import { faChevronLeft, faTimes, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';



import Navbar from '../Navbar';

const { height, width } = Dimensions.get('window');
export default class Categories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grouponcart: [],
            refreshing: false
        };
    }
    // componentWillMount = async () => {
    //     await this.props.categoriesGetList()
    //     this.getgroupon();
    // }

    componentWillMount() {
        this.props.categoriesGetList();
        this.getgroupon();
    }


    getAdjustedFontSize = (size) => {
        return parseInt(size) * width * (1.8 - 0.002 * width) / 400;
    }

    gotosubcategory = async (content) => {
        this.props.categorySetViewing(content);
        if (content.children.length > 0) {
            await this.props.subcategoriesSetPage(1)
            await this.props.subcategoriesSetData([])
            await this.props.subcategoriesGetList(content.children[0].id)
        } else {
            await this.props.subcategoriesSetPage(1)
            await this.props.subcategoriesSetData([])
            await this.props.subcategoriesGetNoDataListFinish([])
        }
        this.props.navigation.navigate('SubCategories')
    }

    getgroupon = async () => {
        await AsyncStorage.getItem("groupon_cart", (err, res) => {
            if (!res) {
                this.setState({ grouponcart: [] });
            } else {
                this.setState({ grouponcart: JSON.parse(res) });
            }
        })
    }

    gotoproductdeatils = async (content, type) => {
        this.props.navigation.navigate('ProductDetails', { previous_screen: 'category' })
        this.props.productGetList(content.id, type)
        // if (type != "Groupon") {
        //     this.props.relatedcategoryGetList()
        // }
        //await this.props.navigation.navigate('Search');
    }

    _onRefresh = async () => {
        //alert('hi')
        this.setState({ refreshing: true });
        await this.props.categoriesGetList();
        this.setState({ refreshing: false });
    }

    noChild = () => {
        Toast.show({ text: 'Product is not available.', type: 'warning' })
    }

    render() {

        var categoryLoadStatus = this.props.categories.category;
        var category = categoryLoadStatus ? categoryLoadStatus.hasValue() ? categoryLoadStatus.getValue() : [] : [];
        var cart = this.props.cart.cart
        var total_products = cart ? cart.hasValue() ? cart.getValue().length : 0 : 0;
        total_products = total_products + this.state.grouponcart.length
        // console.log("Test", JSON.stringify(category))
        // var isLoggedIn = this.props.login.login_details.hasValue();
        //alert(isLoggedIn)

        var loadStatusCollection = LoadStatusCollection.create([
            this.props.cart.cart,
            this.props.categories.category
        ]);

        var left = (

            <Left style={{ flex: 1, alignSelf: 'center', }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                </Button>
            </Left>

        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center', top: width * -0.02 }}>
                <Button style={{ height: width * 0.17 }} onPress={() => this.props.navigation.navigate('CartDetails')} transparent>
                    <Icon type="AntDesign" name="shoppingcart" style={{ fontSize: 40, color: 'white', fontFamily: "Helvetica Neue" }} />
                    {total_products > 0 ?
                        <View style={{ position: 'absolute', top: width * 0.01, right: 5, justifyContent: 'flex-start', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                            <Text style={{ color: 'white', fontFamily: "Helvetica Neue", fontSize: width * 0.04 }}>{total_products}</Text>
                        </View>
                        : null}
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', }} RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                this._onRefresh()
            }}>

                <Navbar left={left} right={right} title="Categories" fontSize={30} marginLeft={28} />
                {!this.state.refreshing ?
                    <LoadStatusView loadStatus={loadStatusCollection} />
                    : null}
                <View >
                    <FlatList
                        style={{ marginTop: 10, marginBottom: 100, width: '100%' }}
                        data={category}
                        numColumns={2}
                        keyExtractor={(item, index) => index.toString()}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this._onRefresh();
                                }}
                            />
                        }
                        // ItemSeparatorComponent={
                        //     () => <View style={{ height: 10 }} />
                        // }
                        renderItem={({ item }) => (
                            <View style={{ width: width * 0.5, height: width * 0.7 }}>
                                <View style={{ flex: 1, width: width / 2, alignItems: 'center', }}>
                                    <TouchableOpacity onPress={() => this.gotosubcategory(item)} style={{ alignItems: 'center', backgroundColor: '#f8f7f7', width: width * 0.42, height: width * 0.42, backgroundColor: '#f8f7f7' }}>
                                        <Image
                                            source={{ uri: item.cover }}
                                            style={{ width: width * 0.4, height: width * 0.3, alignItems: 'center' }}
                                        />
                                        <Text style={{ fontSize: this.getAdjustedFontSize(25), color: '#707070', fontFamily: "Helvetica Neue", textAlign: "center", textAlignVertical: "center" }} numberOfLines={1}>{item.name}</Text>
                                    </TouchableOpacity>
                                    {item.children.length > 0 ?
                                        <View style={{ flex: 1, flexDirection: 'row', width: '75%', justifyContent: 'space-between', alignItems: 'center' }}>
                                            {item.children[0] && item.children[0].product && item.children[0].product.length > 0 && item.children[0].product[0].cover != null ?
                                                <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2 }} onPress={() => this.gotoproductdeatils(item.children[0].product[0], 'Popular')}>
                                                    <Image
                                                        source={{ uri: Config.IMAGE_BASE_URL + item.children[0].product[0].cover }}
                                                        style={{ width: width * 0.2, height: width * 0.2 }}
                                                    />
                                                </TouchableOpacity>
                                                :
                                                <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2 }} onPress={() => this.gotoproductdeatils(item.children[0].product[0], 'Popular')}>
                                                    <Image
                                                        source={require('../../images/default.png')}
                                                        style={{ width: width * 0.2, height: width * 0.2 }}
                                                    />
                                                </TouchableOpacity>
                                            }
                                            {item.children[1] && item.children[1].product && item.children[1].product.length > 0 && item.children[1].product[0].cover != null ?
                                                <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2 }} onPress={() => this.gotoproductdeatils(item.children[1].product[0], 'Popular')}>
                                                    <Image
                                                        source={{ uri: Config.IMAGE_BASE_URL + item.children[1].product[0].cover }}
                                                        style={{ width: width * 0.2, height: width * 0.2 }}
                                                    />
                                                </TouchableOpacity>
                                                : <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2 }} onPress={() => this.noChild()}>
                                                    <Image
                                                        source={require('../../images/default.png')}
                                                        style={{ width: width * 0.2, height: width * 0.2 }}
                                                    />
                                                </TouchableOpacity>
                                            }
                                        </View>
                                        : <View style={{ flex: 1, flexDirection: 'row', width: '75%', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2 }} onPress={() => this.noChild()}>
                                                <Image
                                                    source={require('../../images/default.png')}
                                                    style={{ width: width * 0.2, height: width * 0.2 }}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity style={{ width: width * 0.2, height: width * 0.2 }} onPress={() => this.noChild()}>
                                                <Image
                                                    source={require('../../images/default.png')}
                                                    style={{ width: width * 0.2, height: width * 0.2 }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                            </View>
                        )}
                    />
                </View>
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