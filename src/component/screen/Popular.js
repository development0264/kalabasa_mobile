
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Col, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faTimes, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';



import Navbar from '../Navbar';


export default class Popular extends Component {

    constructor(props) {
        super(props);
        //this.props.popularproductsAll()
        this.state = {
            grouponcart: []
        }
        this.getgroupon();
    }

    componentDidMount() {
        //this.props.popularproductsAll()
    }

    gotoproductdeatils = async (content) => {
        //alert(content.id)
        // this.props.productGetList(content.id, this.props.home.producttype)
        // this.props.navigation.navigate('ProductDetails')
        this.props.navigation.navigate('ProductDetails')
        this.props.productGetList(content.id, this.props.home.producttype)
        //this.props.relatedcategoryGetList()


    }

    renderNoContent() {
        return (
            <Content contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flex: 0.5 }}>No content available yet.</Text>
            </Content>
        );
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

    endReached = async () => {
        this.props.popularproductsAll('Popular');
        // this.props.productGetListMore(this.state.searchText)
        // alert(this.state.viewcategory.children[this.state.selectedIndex].id)
        //await this.props.subcategoriesGetList(this.state.viewcategory.children[this.state.selectedIndex].id)
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var popularproducts = this.props.home.popularproducts;
        var products = popularproducts ? popularproducts.hasValue() ? popularproducts.getValue() : [] : [];

        var cart = this.props.cart.cart
        var total_products = cart.hasValue() ? cart.getValue().length : 0;
        total_products = total_products + this.state.grouponcart.length

        var loadStatusCollection = LoadStatusCollection.create([
            this.props.home.popularproducts
        ]);

        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button style={{ flex: 0 }} onPress={() => this.props.navigation.navigate('CartDetails')} transparent>

                    <Icon type="AntDesign" name="shoppingcart" style={{ fontSize: 50, color: 'white', fontFamily: "Helvetica Neue" }} />

                    {total_products > 0 ?
                        <View style={{ position: 'absolute', top: -10, right: 5, justifyContent: 'flex-start', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                            <Text style={{ color: 'white', fontFamily: "Helvetica Neue" }}>{total_products}</Text>
                        </View>
                        : null}
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', }}>

                <Navbar left={left} right={right} title={this.props.home.producttype} fontSize={30} marginLeft={28} />
                <LoadStatusView loadStatus={loadStatusCollection} />
                <View style={{ flex: 1, }}>
                    {products.length > 0 ?
                        <View style={{ flex: 1 }}>
                            <FlatList
                                style={{ marginTop: 10, width: width * 0.99 }}
                                data={products}
                                numColumns={3}
                                keyExtractor={(item, index) => index.toString()}
                                scrollEventThrottle={300}
                                scrollRenderAheadDistance={0.5}
                                onEndReachedThreshold={0.09}
                                onEndReached={this.props.home.producttype == 'Popular' ? this.endReached.bind(this) : null}
                                ItemSeparatorComponent={
                                    () => <View style={{ height: 10 }} />
                                }
                                renderItem={({ item }) => (
                                    <View style={{ width: "33.33%" }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                                            <TouchableOpacity onPress={() => this.gotoproductdeatils(item)} style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                                <Image
                                                    source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                                    style={{ height: 110, width: 110, }}
                                                />
                                                <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#F6C661', borderRadius: 100 / 2, height: 45, width: 45, alignSelf: 'center', justifyContent: 'center' }}>
                                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: 12, fontWeight: '500' }}>€ {this.props.home.producttype == "Offers" ? item.amt : item.price}</Text>
                                                </View>
                                            </TouchableOpacity>

                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                        : this.renderNoContent()}

                </View>
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