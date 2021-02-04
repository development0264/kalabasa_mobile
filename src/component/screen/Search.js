
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Header, Body, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
import { Actions } from 'react-native-router-flux';
import Config from 'react-native-config';
import Navbar from '../Navbar';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
import Flag from 'react-native-flags';
import _ from "lodash";

export default class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            issearch: false,
            viewcategory: this.props.categories.viewcategory,
            grouponcart: [],
            searchText: this.gettext(),
        };

        this.search_order_dish = this.search_order_dish.bind(this);
        this.onChangeTextDelayed = _.debounce(this.search_order_dish, 2500);

    }

    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
            //this.setState({ searchText: this.gettext() })
            this.getgroupon();
        });
    }

    renderNoContent() {
        return (
            <Content contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flex: 0.5 }}>No content available yet.</Text>
            </Content>
        );
    }

    search_order_dish = async (text) => {
        if (text != "" && text != null) {
            this.setState({ searchText: text })
            this.setState({ issearch: true })
            this.props.searchproduct(text)
        } else {
            this.props.searchproductGetListFinish([])
            this.setState({ issearch: false })
            this.setState({ searchText: null })
            this.props.searchproduct(text)
        }
    }

    gotoproductdeatils = async (content, type) => {
        //alert(content.id)        
        this.setState({ searchText: null })
        this.props.navigation.navigate('ProductDetails')
        var productdetails = await this.props.productGetList(content.id, type)
        // if (type != "Groupon") {
        //     await this.props.relatedcategoryGetList()
        // }

    }

    getflag(countryid) {
        //alert(countryid)
        var country = this.props.home.country;
        var country = country.hasValue() ? country.getValue() : [];
        if (country != undefined && country.length > 0) {
            var obj = country.filter(i => i.id == countryid);

            var list = []
            if (obj.length > 0) {
                list.push(<Flag
                    code={obj[0].iso}
                    size={64}
                />)
            }
        }
        return list;
    }

    renderListItemSearch(data) {
        var content = data.item;
        return (
            <TouchableOpacity onPress={() => this.gotoproductdeatils(content, 'Search')} style={{ flex: 1, height: 32, backgroundColor: '#FFFFFF', borderBottomWidth: 2, paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderBottomColor: '#C0C0C0' }}>
                <Text>{content.name}</Text>
            </TouchableOpacity>
        );
    }

    renderListItem(item) {
        return (
            <View style={{ justifyContent: 'space-evenly' }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <TouchableOpacity onPress={() => this.gotoproductdeatils(item)} style={{ height: 140, width: '33.33%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                            style={{ width: 110, height: 140 }}
                        />
                    </TouchableOpacity>
                    <View style={{ width: '66.66%', marginLeft: 0, backgroundColor: '#F4B83A' }}>
                        <Text style={{ color: 'white', padding: 10, fontSize: 20, textAlign: 'center', fontFamily: "Helvetica Neue", }}>
                            {item.name}
                        </Text>
                        <Row style={{ justifyContent: 'space-between' }}>
                            <View style={{ alignSelf: 'center', justifyContent: 'center', height: 30, width: 60, marginLeft: 10, }}>
                                {/* <FontAwesomeIcon icon={faHeart} size={55} style={{ color: 'red' }} /> */}
                                {/* <ReactCountryFlag countryCode="US" svg /> */}
                                {this.getflag(item.country_id)}
                            </View>

                            <Text style={{ color: 'white', marginTop: 25, margin: 20, fontSize: 25, height: 37.5 }}>
                                € {item.price}
                            </Text>
                        </Row>
                    </View>
                </View>
            </View>
        )
    }


    gettext() {
        var subcategoryLoadStatus = this.props.categories.subcategory;
        var subcategory = subcategoryLoadStatus ? subcategoryLoadStatus.hasValue() ? subcategoryLoadStatus.getValue() : [] : [];

        var product = this.props.product.product;
        var productdetails = product ? product.hasValue() ? product.getValue() : null : null;
        return (subcategory.length > 0 ? this.state.viewcategory.name : productdetails ? productdetails.sku : productdetails.sku)
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

    searchHeaderclose() {
        this.setState({ issearch: !this.state.issearch, searchText: null })
    }

    keyExtractor(content) {
        return 'm_' + content.id;
    }

    endReached() {
        this.props.productGetListMore(this.state.searchText)
    }

    render() {
        var { height, width } = Dimensions.get('window');

        var cart = this.props.cart.cart
        var total_products = cart != undefined ? (cart.hasValue() ? cart.getValue().length : 0) : 0;
        total_products = total_products + this.state.grouponcart.length

        var subcategoryLoadStatus = this.props.categories.subcategory;
        var subcategory = subcategoryLoadStatus ? subcategoryLoadStatus.hasValue() ? subcategoryLoadStatus.getValue() : [] : [];

        var product = this.props.product.product;
        var productdetails = product ? product.hasValue() ? product.getValue() : null : null;

        var searchproduct = this.props.home.searchproduct;
        var shproducts = searchproduct ? searchproduct.hasValue() ? searchproduct.getValue() : [] : [];

        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.openDrawer()} transparent>
                    <Icon name="ios-menu" style={{ fontSize: 40, color: 'white' }} />
                    {total_products > 0 ?
                        <View style={{ position: 'absolute', top: -3, right: -2, justifyContent: 'center', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                            <Text style={{ color: 'white', fontWeight: '500' }}>{total_products}</Text>
                        </View>
                        : null}
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button style={{ flex: 0 }} onPress={() => this.searchHeader()} transparent>
                    <Icon name="ios-search" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Right>
        );

        var content = subcategory.length ? (
            <View style={{ flex: 1 }}>
                <FlatList
                    data={subcategory}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={
                        () => <View style={{ height: 10 }} />
                    }
                    renderItem={({ item, index }) => (
                        this.renderListItem(item)
                    )}
                />
            </View>
        ) : productdetails != null ? this.renderListItem(productdetails) : this.renderNoContent();

        // this.setState({ searchText: subcategory.length > 0 ? this.state.viewcategory.name : productdetails ? productdetails.sku : productdetails.sku })
        // alert(this.state.searchText)        
        return (

            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>
                <Header
                    transparent
                    style={{ backgroundColor: '#8CC63F', zIndex: 1, height: 100 }}
                    backgroundColor={'#8CC63F'}
                    noShadow={true}
                >
                    {left}
                    <View style={{ alignSelf: 'center' }}>
                        <Body style={{ width: '100%', flex: 0, alignSelf: 'center' }}>
                            <Item style={{ backgroundColor: 'white', borderRadius: 100, width: width * 0.6, height: height * 0.07 }}>
                                <Button transparent onPress={() => this.searchHeaderclose()}>
                                    <Icon name="ios-close" size={32} style={{ fontSize: 32 }} />
                                </Button>
                                <Input
                                    onChangeText={this.onChangeTextDelayed}
                                    value={this.state.searchText}
                                    style={{ left: 15, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                />
                                {/* <Icon name="ios-search" style={{ fontSize: 30, color: '#413d3d' }} onPress={() => this.searchFilterFunction(this.state.searchText)} /> */}
                            </Item>
                        </Body>
                    </View>
                    <Right style={{ flex: 1, alignSelf: 'center' }}>
                        {/* <Button transparent>
                            <Image square style={{ width: 50, height: 50, marginLeft: 0, marginBottom: 0 }} source={require('../../images/barcode-scan.png')} />
                        </Button> */}
                    </Right>
                </Header>

                <View style={{ flex: 1 }}>
                    {this.state.searchText && this.state.issearch && shproducts.length > 0 ?
                        <View style={{ position: 'absolute', zIndex: 1, width: width, flexDirection: 'column', height: height * 0.35, }}>
                            <FlatList
                                data={shproducts}
                                keyExtractor={this.keyExtractor.bind(this)}
                                renderItem={this.renderListItemSearch.bind(this)}
                                scrollEventThrottle={300}
                                scrollRenderAheadDistance={0.5}
                                onEndReachedThreshold={0.01}
                                onEndReached={this.endReached.bind(this)}
                                style={{ backgroundColor: '#FFFFFFF' }}
                            />
                        </View>
                        : null}
                    {content}
                </View>
            </Container >
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