
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, AsyncStorage } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Col, Content, Toast } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faHeart, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'
import Config from 'react-native-config';
// import SelectableChips from 'react-native-chip/SelectableChips';

import Navbar from '../Navbar';
import { ScrollView } from 'react-native-gesture-handler';
// import ReactCountryFlag from "react-country-flag"
// import { flagMappings } from 'react-native-country-flags';
import Flag from 'react-native-flags';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
// import { Carousel as Carousel123 } from 'react-native-banner-carousel';
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import { WebView } from 'react-native-webview';
import HTML from 'react-native-render-html';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 220;
export default class ProductDetail extends Component {


    constructor(props) {
        super(props);
        var product = this.props.product.product;
        var productdetails = product ? product.hasValue() ? product.getValue() : {} : null;
        this.state = {
            position: 1,
            interval: null,
            product: productdetails,
            qty: 1,
            isLoggedIn: this.props.login.login_details.hasValue(),
            grouponcart: [],
            activeSlide: 0
            // initialChips: [
            //     "OFFER",
            //     "GROUPON",
            //     "NEW",
            // ]
        };
    }

    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', async () => {
            this.productdetailget();
        });
    }

    productdetailget = async () => {
        var isLoggedIn = this.props.login.login_details.hasValue();
        var product = this.props.product.product;
        var productdetails = product ? product.hasValue() ? product.getValue() : {} : null;
        if (isLoggedIn) {
            var cart = this.props.cart.cart;
            var cartdetails = cart != undefined ? cart.hasValue() ? cart.getValue() : [] : [];
            var cart_product = cartdetails.length > 0 ? cartdetails.filter(i => i.id == this.state.product.id) : [];
            this.setState({ qty: cart_product.length > 0 ? cart_product[0].qty : 1 })
            this.getgroupon(productdetails);
            if (this.props.product.productType == "Groupon") {
                var grouponqty = this.state.grouponcart.filter(i => i.id == productdetails.id);
                if (grouponqty.length > 0) {
                    this.setState({ qty: grouponqty[0].qty })
                } else {
                    this.setState({ qty: productdetails.min_quantity })
                }
            }
            await this.props.favoriteproductGetList();
            await this.props.relatedcategoryGetList();
        } else {
            var product = this.props.product.product;
            var productdetails = product ? product.hasValue() ? product.getValue() : {} : null;
            this.setState({ qty: productdetails.qty > 0 ? productdetails.qty : this.props.product.productType == "Groupon" ? productdetails.min_quantity : 1 })
        }
    }

    gotocart = async (id) => {
        var isLoggedIn = this.props.login.login_details.hasValue();
        if (isLoggedIn) {
            if (this.props.product.productType == "Groupon") {
                var product = this.props.product.product;
                var item = product ? product.hasValue() ? product.getValue() : {} : null;
                var checkcart = this.state.grouponcart.filter(i => i.id == id);
                if (checkcart.length == 0) {
                    item.qty = this.state.qty > 0 ? this.state.qty : item.min_quantity
                    this.state.grouponcart.push(item);
                    await AsyncStorage.setItem('groupon_cart', JSON.stringify(this.state.grouponcart));
                    await AsyncStorage.getItem("groupon_cart", (err, res) => {
                        if (!res) {
                            this.setState({ grouponcart: [] });
                        } else {
                            this.setState({ grouponcart: JSON.parse(res) });
                        }
                    })
                    await this.props.grouponaddcart('Product added in cart', 'success')
                    await this.props.navigation.navigate('CartDetails')
                } else {
                    checkcart[0].qty = this.state.qty;
                    await AsyncStorage.setItem('groupon_cart', JSON.stringify(this.state.grouponcart));
                    await this.props.navigation.navigate('CartDetails')
                }

            }
            else {
                var cart = this.props.cart.cart;
                var cartdetails = cart != undefined ? cart.hasValue() ? cart.getValue() : [] : [];
                var cart_product = cartdetails.length > 0 ? cartdetails.filter(i => i.id == id) : [];
                if (cart_product.length > 0) {
                    var data = {
                        rowId: cart_product[0].rowId,
                        qty: this.state.qty
                    }
                    await this.props.cartupdate(data)
                    await this.props.navigation.navigate('CartDetails')
                } else {
                    var data = []
                    if (cartdetails.length > 0) {
                        for (var j = 0; j < cartdetails.length; j++) {
                            //console.log(cartdetails)
                            var obj = new Object();
                            obj.id = cartdetails[j].id
                            obj.count = cartdetails[j].qty
                            data.push(obj)
                        }
                        var obj = {
                            id: id,
                            count: this.state.qty
                        }
                        data.push(obj)
                    } else {
                        data = [{
                            id: id,
                            count: this.state.qty
                        }]
                    }
                    await this.props.cartadd(data)
                    await this.props.navigation.navigate('CartDetails')
                }
            }
        }
        else {
            Toast.show({
                text: 'Please login to place order', type: 'danger', position: 'bottom',
                duration: 5000
            })
        }
    }

    addtofavorite = async (id, status) => {
        var data = {
            product_id: id,
            status: status
        }
        await this.props.addfavourite(data)
        await this.props.favoriteproductGetList()
    }



    getflag(countryid) {
        var country = this.props.home.country;
        var country = country.hasValue() ? country.getValue() : [];
        var list = []
        if (country != undefined && country.length > 0) {
            var obj = country.filter(i => i.id == countryid);
            if (obj.length > 0) {
                list.push(<Flag
                    code={obj[0].iso}
                    size={64}
                />)
            } else {
                list.push(<Image
                    source={require('../../images/care.png')}
                    style={[{ width: 64, height: 64 }]}
                />)
            }
        } else {
            list.push(<Image
                source={require('../../images/care.png')}
                style={[{ width: 64, height: 64 }]}
            />)
        }
        return list;
    }

    getgroupon = async (productdetails) => {
        await AsyncStorage.getItem("groupon_cart", (err, res) => {
            if (!res) {
                this.setState({ grouponcart: [] });
                this.setState({ qty: productdetails.min_quantity ? productdetails.min_quantity : 1 })
            } else {
                this.setState({ grouponcart: JSON.parse(res) });

            }
        })
    }

    getcartqty = (item) => {
        if (this.state.grouponcart.length > 0) {
            var grouponqty = this.state.grouponcart.filter(i => i.id == item.id);
            if (grouponqty.length > 0) {
                item.qty = grouponqty[0].qty;
                this.setState({ qty: grouponqty[0].qty })
                return grouponqty[0].qty;
            } else {
                return (this.state.qty > 0 ? this.state.qty : item.min_quantity);
            }
        } else {
            return (this.state.qty > 0 ? this.state.qty : item.min_quantity);
        }
    }


    downgradeqyt(productdetails) {
        if (this.props.product.productType == "Groupon") {
            if (this.state.qty > productdetails.min_quantity) {
                this.setState({ qty: this.state.qty - 1 })
            } else {
                productdetails.min_quantity
            }
        } else {
            this.setState({ qty: this.state.qty > 1 ? this.state.qty - 1 : 1 })
        }
    }

    renderPage(item, index) {
        var { height, width } = Dimensions.get('window');
        return (
            <Image style={{ flex: 2, height: width, width: width, alignContent: 'center' }} source={{ uri: Config.IMAGE_BASE_URL + item.src }} />
        );
    }

    renderMultiImagelist(banner) {
        // var { height, width } = Dimensions.get('window');
        // return (
        //     <Carousel123
        //         autoplay
        //         //sliderWidth={width}
        //         //itemWidth={width}
        //         autoplayTimeout={5000}
        //         index={0}
        //         pageSize={width}
        //         style={{ backgroundColor: 'red' }}
        //         ItemSeparatorComponent={
        //             () => <View style={{ margin: 3 }} />
        //         }
        //     >
        //         {productdetails.cover ?
        //             (
        //                 <Image style={{ flex: 2, height: width, width: width, alignContent: 'center' }} source={{ uri: Config.IMAGE_BASE_URL + productdetails.cover }} />

        //             ) : null}
        //         {banner.map((image, index) => this.renderPage(image, index))}

        //     </Carousel123>
        // )
        const { activeSlide } = this.state;
        const renderItem = ({ item, index }, parallaxProps) => {
            return (
                <View style={{ height: BannerHeight, height: width, }}>
                    <ParallaxImage
                        source={{ uri: Config.IMAGE_BASE_URL + item.src }}
                        containerStyle={styles.imageContainer}
                        style={styles.itemImage}
                        parallaxFactor={-0.01}
                        {...parallaxProps}
                    />
                </View>
            );
        };
        return (
            <View style={styles.container}>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    sliderWidth={width}
                    sliderHeight={width}
                    padding={0.5}
                    itemWidth={width}
                    itemHeight={width + 100}
                    data={banner}
                    style={{ resizeMode: 'contain', height: width + 100 }}
                    renderItem={renderItem}
                    hasParallaxImages={true}
                    style={{ backgroundColor: 'green' }}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                />
                <Pagination
                    dotsLength={banner.length} // also based on number of sildes you want
                    activeDotIndex={activeSlide}
                    containerStyle={{ alignSelf: 'center', bottom: 0, backgroundColor: 'transparent', zIndex: 9999, position: 'absolute' }}
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 100,
                        //marginHorizontal: 5,
                        backgroundColor: "black"
                    }}
                    inactiveDotStyle={{
                        backgroundColor: "white"
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
            </View >
        )
    }

    getleftdays = (enddate) => {
        if (enddate) {
            var Difference_In_Time = new Date(enddate.split(" ")[0]).getTime() - new Date().getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            return parseInt(Difference_In_Days) + 1
        }
        else {
            return 0
        }

    }


    render() {
        var { height, width } = Dimensions.get('window');
        const { entries, activeSlide } = this.state;
        var cart = this.props.cart.cart
        var total_products = cart != undefined ? cart.hasValue() ? cart.getValue().length : 0 : 0;
        total_products = total_products + this.state.grouponcart.length

        var product = this.props.product.product;
        var productdetails = product ? product.hasValue() ? product.getValue() : {} : null;

        var fproduct = this.props.product.favouriteproduct;
        var favouriteproduct = fproduct && fproduct.hasValue() ? fproduct.getValue() : [];

        var Isfav = productdetails ? favouriteproduct.filter(i => i.product_id == productdetails.id) : [];

        var rproduct = this.props.product.realtedcategory;
        var realtedcategory = rproduct && rproduct.hasValue() ? rproduct.getValue() : [];


        var loadStatusCollection = LoadStatusCollection.create([
            this.props.product.realtedcategory,
            this.props.product.product,
        ]);

        const gotoproductdeatils = async (content, type) => {
            await this.props.productGetList(content.id, type);
            this.productdetailget();
        }
        const goback = async () => {
            const { navigation } = this.props;
            if (navigation.state.params && navigation.state.params.previous_screen == 'category') {
                this.props.navigation.navigate('Categories')
            } else {
                this.props.navigation.navigate('Home')
            }
            return
            //this.props.product.productType == 'Popular' ? this.props.navigation.navigate('Categories') : this.props.navigation.navigate('Home')
        }

        var left = (
            <Left style={{ flex: 1, alignSelf: 'center', }}>
                <Button onPress={() => goback()} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                </Button>
            </Left>
        );
        var right = (
            <Right style={{ flex: 1, alignSelf: 'center', }}>
                <Button style={{ flex: 0 }} transparent onPress={() => this.props.navigation.navigate('CartDetails')}>

                    <Icon type="AntDesign" name="shoppingcart" style={{ fontSize: 40, color: 'white', fontFamily: "Helvetica Neue", height: width * 0.1 }} />

                    {total_products > 0 ?
                        <View style={{ position: 'absolute', top: width * -0.015, right: 5, justifyContent: 'flex-start', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                            <Text style={{ color: 'white', fontFamily: "Helvetica Neue", fontSize: width * 0.04 }}>{total_products}</Text>
                        </View>
                        : null}
                </Button>
            </Right>
        );



        var bannerimages = []
        if (productdetails && productdetails.images && productdetails.images.length) {
            bannerimages.push({ src: productdetails.cover })
            for (var i = 0; i < productdetails.images.length; i++) {
                bannerimages.push({ src: productdetails.images[i].src })
            }
        }

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{}}>
                <Navbar left={left} right={right} title="Product Detail" fontSize={30} />
                <LoadStatusView loadStatus={loadStatusCollection} />
                <View style={{ flex: 1, }}>
                    <Content>
                        <View style={{ height: width * 0.99, width: width, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>

                            {bannerimages.length > 0 ?

                                this.renderMultiImagelist(bannerimages)
                                :
                                productdetails.cover != null ?
                                    <Image
                                        source={{ uri: Config.IMAGE_BASE_URL + productdetails.cover }}
                                        style={{ flex: 1, height: width * 0.90, width: width, alignContent: 'center' }}
                                    />
                                    :
                                    <Image
                                        source={require('../../images/default.png')}
                                        style={{ flex: 1, height: width * 0.90, width: width, alignContent: 'center' }}
                                    />
                            }

                            <View style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', borderRadius: 100, backgroundColor: '#8cc640', height: 30, width: this.props.product.productType ? this.props.product.productType.length * 12 : 0, zIndex: 9999, top: 15, left: 10 }}>
                                <Text style={{ textAlign: 'center', color: 'white', fontSize: 20 }}>{this.props.product.productType}</Text>
                            </View>
                            {this.props.product.productType == "Groupon" ?
                                <View style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', width: 65, zIndex: 9999, bottom: 100, left: 10 }}>
                                    <View style={{ position: 'absolute', backgroundColor: '#8cc640', right: -8, justifyContent: 'center', alignItems: 'center', height: 28, width: 65 }}>
                                        <Text style={{ color: 'white', fontSize: 13 }}>Days Left</Text>
                                    </View>
                                    <View style={{ position: 'absolute', backgroundColor: '#fdb83a', top: 10, right: -8, justifyContent: 'center', alignItems: 'center', height: 55, width: 65 }}>
                                        <Text style={{ color: 'white', fontSize: 50 }}>{this.getleftdays(productdetails.end_date)}</Text>
                                    </View>
                                    <View style={{ position: 'absolute', backgroundColor: '#8cc640', top: 65, right: -8, justifyContent: 'center', alignItems: 'center', height: 28, width: 65 }}>
                                        <Text style={{ color: 'white', fontSize: 16 }}>€ {productdetails.price}</Text>
                                    </View>
                                </View>
                                : null}

                            <View style={{ position: 'absolute', zIndex: 9999, top: 15, right: 10 }}>
                                {/* <FontAwesomeIcon icon={faHeart} size={55} style={{ color: 'red' }} /> */}
                                {/* <ReactCountryFlag countryCode="US" svg /> */}
                                {this.getflag(productdetails.country_id)}
                            </View>

                            <TouchableOpacity onPress={() => this.addtofavorite(productdetails.id, Isfav.length > 0 ? !Isfav[0].likeStatus : 1)} style={{ position: 'absolute', zIndex: 9999, bottom: 55, right: 10 }}>
                                <FontAwesomeIcon icon={faHeart} size={55} style={{ color: Isfav.length > 0 ? Isfav[0].likeStatus == 0 ? '#808080' : 'red' : '#808080', fontSize: 55 }} />
                            </TouchableOpacity>

                        </View>

                        <View style={{ width: width, height: width * 0.38, backgroundColor: '#F4B83A', margin: 2, }}>
                            <TouchableOpacity onPress={() => this.gotocart(productdetails.id)} style={{ top: -28, height: 60, width: 60, borderRadius: 100, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', position: 'absolute', zIndex: 9999, right: 10, backgroundColor: '#8cc640' }}>
                                <Icon name="ios-add" type="Ionicons" style={{ fontSize: 60, color: 'white' }} />
                            </TouchableOpacity>

                            <Text style={{ color: 'white', fontSize: width * 0.05, height: 60, marginTop: 5, marginLeft: 20, width: width * 0.8 }} numberOfLines={2} allowFontScaling={false}>
                                {productdetails.name}
                            </Text>

                            <Row style={{ bottom: 15, alignSelf: 'center' }}>
                                <Col style={{ flexDirection: 'row', marginLeft: 20, alignSelf: 'center' }}>
                                    <Button transparent icon onPress={() => this.downgradeqyt(productdetails)}>
                                        <FontAwesomeIcon icon={faMinus} size={40} style={{ color: 'white' }} />
                                    </Button>
                                    <View style={{ marginRight: 10, marginLeft: 10, alignSelf: 'flex-start', }}>
                                        <Text style={{ fontSize: width * 0.1, color: 'white', bottom: 5 }}>{this.state.qty}</Text>
                                    </View>
                                    <Button transparent icon onPress={() => this.setState({ qty: this.state.qty + 1 })}>
                                        <FontAwesomeIcon icon={faPlus} size={40} style={{ color: 'white' }} />
                                    </Button>
                                </Col>
                                <Text style={{ textAlign: 'center', alignSelf: 'center', color: 'white', fontSize: width * 0.1, right: 20 }}>
                                    € {parseFloat(this.state.qty * (productdetails.price != undefined ? productdetails.price : 0)).toFixed(2)}
                                </Text>
                            </Row>
                            {this.props.product.productType == "Groupon" ?
                                <Text style={{ color: 'white', fontSize: 20, marginLeft: 20, bottom: 5 }}>Min. QTY {productdetails.min_quantity}</Text>
                                : null}
                        </View>

                        {productdetails.description != null ?
                            <>
                                {/* <Text style={{ alignSelf: 'flex-start', fontSize: width * 0.05, marginLeft: width * 0.02, color: 'grey', fontWeight: '500' }}>{productdetails.description}</Text> */}
                                <View style={{ width: '100%', alignSelf: 'flex-start', paddingLeft: 5, paddingRight: 5 }}>
                                    {/* <WebView
                                        style={{ height: 100 }}
                                        originWhitelist={['*']}
                                        source={{ html: productdetails.description }}
                                    /> */}
                                    {/* <Text>{productdetails.description}</Text> */}
                                    <HTML html={productdetails.description} baseFontStyle={{ fontSize: 16 }} />
                                </View>
                            </>
                            : null}

                        {realtedcategory.length > 0 ?
                            <View style={{ marginTop: 10, height: 140, justifyContent: 'space-between' }}>
                                <FlatList
                                    data={realtedcategory}
                                    horizontal={true}
                                    keyExtractor={(item, index) => index.toString()}
                                    ItemSeparatorComponent={
                                        () => <View style={{ margin: 3 }} />
                                    }
                                    renderItem={({ item, index }) => (
                                        item.id != productdetails.id ?
                                            <TouchableOpacity style={{ marginRight: width * 0.04 }} onPress={() => gotoproductdeatils(item, 'Popular')}>
                                                {item && item.cover != undefined && item.cover != null ?
                                                    <Image
                                                        source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                                        style={{ height: 110, width: 110, zIndex: -9999 }}
                                                    />
                                                    : null}
                                                <View style={{ backgroundColor: '#8CC63F', marginTop: width * -0.27, opacity: 1, marginLeft: 70, borderRadius: 100 / 2, height: 50, width: 50 }}>
                                                    <Text style={{ alignSelf: 'center', color: 'white', fontSize: 13, marginTop: 16, fontWeight: '500' }}>€  {item.price}</Text>
                                                </View>
                                            </TouchableOpacity>
                                            : null
                                    )}
                                />
                            </View>
                            : null
                        }
                    </Content>
                </View>
            </Container >
            // </SideMenuDrawer>
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
    ww: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 8, backgroundColor: 'rgba(255, 255, 255, 0.92)'
    },
    tabBar: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        left: 0,
        borderTopWidth: 1,
        borderColor: '#ddd',
    },
    container: {
        flex: 1,
        width: '100%',
        //backgroundColor: 'red'
    },
    itemImage: {
        width: width,
        height: width,
        resizeMode: 'stretch',
        backgroundColor: 'green'
    },
    imageContainer: {
        flex: 1,
        width: width,
        height: width,
    },
})