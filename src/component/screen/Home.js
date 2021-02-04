
import React, { Component, Fragment } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, KeyboardAvoidingView, ScrollView, PermissionsAndroid, Platform, AsyncStorage, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Header, Body, Col, Footer, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBars, faSearch } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import Auth from '../containers/auth';
// import Carousel from 'react-native-banner-carousel';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
import Config from 'react-native-config';

import Scanbarcode from 'react-native-scan-barcode';
import Carousel, { ParallaxImage } from 'react-native-snap-carousel';

import Navbar from '../Navbar';
import _ from "lodash";
const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 220;

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            issearch: false,
            isbarcode: false,
            torchMode: 'off',
            cameraType: 'back',
            searchText: null,
            isLoggedIn: false,
            grouponcart: [],
            refreshing: false
        };
        this.search_order_dish = this.search_order_dish.bind(this);
        this.onChangeTextDelayed = _.debounce(this.search_order_dish, 2500);
        this._carousel = null;
        this.settingNotificationsGet();
    }

    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
            var data = {
                date: this.currentdate(),
            }
            this.props.grouponGetList(data)
            this.getgroupon();
            var isLoggedIn = this.props.login.login_details.hasValue();
            if (isLoggedIn) {
                this.props.cartGetList();
                this.props.accountGet();
                this.props.unreadNotification();
            }
        });
    }

    _onRefresh = async () => {
        // alert('hi')
        this.setState({ refreshing: true });
        await this.settingNotificationsGet();
        this.setState({ refreshing: false });
    }


    settingNotificationsGet() {
        //alert("settingNotificationsGet")
        //alert(JSON.stringify(this.props.login.login_details))
        var isLoggedIn = this.props.login.login_details.hasValue();
        this.setState({ isLoggedIn: isLoggedIn })
        this.props.homecontentGetList()
        this.props.popularproducts()
        var data = {
            current_date: this.currentdate(),
        }
        this.props.offerproducts(data)
        this.props.newproducts()
        this.props.country()
        this.props.orederstatus()
        var data = {
            date: this.currentdate(),
        }
        this.props.grouponGetList(data)
        this.getgroupon();
        this.props.categoriesGetList();
        if (isLoggedIn) {
            this.props.cartGetList();
            this.props.accountGet();
            this.props.unreadNotification();
        }
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


    // componentDidMount = async () => {
    //     await this.props.cartGetList()
    //     await this.props.homecontentGetList()
    //     await this.props.popularproducts()
    //     var data = {
    //         current_date: this.currentdate(),
    //     }
    //     await this.props.offerproducts(data)
    //     await this.props.newproducts()
    //     await this.props.country()
    // }
    searchHeaderclose() {
        if (this.state.isbarcode == true) {
            this.setState({ isbarcode: false, issearch: !this.state.issearch, searchText: null })
        } else {
            this.setState({ issearch: !this.state.issearch, searchText: null })
        }
    }
    searchHeader() {
        this.setState({ issearch: !this.state.issearch, searchText: null })
    }
    gotocategories = async () => {
        await this.props.navigation.navigate('Categories')
    }
    gotogroupons = async () => {
        await this.props.navigation.navigate('Groupon')
    }
    gotopopular = async () => {
        this.props.navigation.navigate('Popular');
        await this.props.popularproductssetListPage(1);
        await this.props.popularproductSetData([]);
        await this.props.popularproductsAll('Popular');
    }

    gotonewproducts = async () => {
        this.props.navigation.navigate('Popular');
        await this.props.popularproductSetData([]);
        await this.props.newproductsAll('New Products');
    }

    gotooffer = async () => {
        this.props.navigation.navigate('Popular')
        var data = {
            current_date: this.currentdate(),
        }
        await this.props.popularproductSetData([]);
        this.props.offerproductsAll(data, 'Offers')

    }


    gotosubcategory = async (content) => {
        this.props.categorySetViewing(content);
        //alert(content.children[0].id)
        if (content.children.length > 0) {
            this.props.subcategoriesSetPage(1)
            this.props.subcategoriesSetData([])
            this.props.subcategoriesGetList(content.children[0].id)
        } else {
            this.props.subcategoriesGetListFinish([])
        }
        await this.props.navigation.navigate('SubCategories')
    }

    gotoproductdeatils = async (content, type) => {
        // console.log(JSON.stringify(content))
        // return        
        // await this.props.productGetList(content.id, type)
        this.setState({ searchText: null })
        var isLoggedIn = this.props.login.login_details.hasValue();
        var productdetails = await this.props.productGetList(content.id, type)
        if (type != "Groupon" && isLoggedIn) {
            await this.props.relatedcategoryGetList(productdetails.category_id)
        }
        this.props.navigation.navigate('ProductDetails')
        //await this.props.navigation.navigate('Search');
    }

    search_order_dish(text) {
        if (text != "" && text != null) {
            this.setState({ searchText: text })
            this.props.searchproduct(text)
        } else {
            this.props.searchproductGetListFinish([])
            this.setState({ searchText: null })
            this.props.searchproduct(text)
        }
    }

    currentdate() {
        var date = new Date();
        var firstdayDay = date.getDate();
        var firstdayMonth = date.getMonth() + 1;
        var firstdayYear = date.getFullYear();
        return ("0000" + firstdayYear.toString()).slice(-4) + "-" + ("00" + firstdayMonth.toString()).slice(-2) + "-" + ("00" + firstdayDay.toString()).slice(-2);
    }

    OpenBarcode = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted) {
                    try {
                        this.setState({ isbarcode: true })
                    }
                    catch (ex) {
                        alert(ex.message)
                    }
                }
            } else {
                //console.log('Camera permission denied');
            }
        } else {
            this.setState({ isbarcode: true })
        }
    }

    barcodeReceived = async (e) => {
        this.setState({
            issearch: false,
            isbarcode: false,
        })
        await this.props.productGetList(e.data, 'Search');
        await this.props.navigation.navigate('Search');
    }

    renderListItem(data) {
        var content = data.item;
        return (
            <TouchableOpacity onPress={() => this.gotoproductdeatils(content, 'Search')} style={{ flex: 1, height: 32, backgroundColor: '#FFFFFF', borderBottomWidth: 2, paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderBottomColor: '#C0C0C0' }}>
                <Text>{content.name}</Text>
            </TouchableOpacity>
        );
    }

    keyExtractor(content) {
        return 'm_' + content.id;
    }

    endReached() {
        this.props.productGetListMore(this.state.searchText)
    }

    _onRefresh = async () => {
        //alert('hi')
        this.setState({ refreshing: true });
        await this.settingNotificationsGet();
        this.setState({ refreshing: false });
    }


    render() {
        var { height, width } = Dimensions.get('window');

        var cart = this.props.cart.cart
        var total_products = cart != undefined ? (cart.hasValue() ? cart.getValue().length : 0) : 0;
        //alert(total_products)

        total_products = total_products + this.state.grouponcart.length

        var bannerLoadStatus = this.props.home.banners;
        var banner = bannerLoadStatus ? bannerLoadStatus.hasValue() ? bannerLoadStatus.getValue() : [] : [];
        banner = banner.filter(i => i.status == 1);

        // var categoryLoadStatus = this.props.home.category;
        // var category = categoryLoadStatus ? categoryLoadStatus.hasValue() ? categoryLoadStatus.getValue() : [] : [];

        var categoryLoadStatus = this.props.categories.category;
        var category = categoryLoadStatus ? categoryLoadStatus.hasValue() ? categoryLoadStatus.getValue() : [] : [];

        var grouponproduct = this.props.product.grouponproduct;
        var groupproduct = grouponproduct ? grouponproduct.hasValue() ? grouponproduct.getValue() : [] : [];


        var popularproducts = this.props.home.popularhomeproducts;
        var popproducts = popularproducts ? popularproducts.hasValue() ? popularproducts.getValue() : [] : [];

        var offerproducts = this.props.home.offerproducts;
        var offproducts = offerproducts ? offerproducts.hasValue() ? offerproducts.getValue() : [] : [];

        // alert(offproducts.length)

        var newproducts = this.props.home.newproducts;
        var nwproducts = newproducts ? newproducts.hasValue() ? newproducts.getValue() : [] : [];

        var searchproduct = this.props.home.searchproduct;
        var shproducts = searchproduct ? searchproduct.hasValue() ? searchproduct.getValue() : [] : [];

        var loadStatusCollection = LoadStatusCollection.create([
            this.props.cart.cart,
            this.props.home.banners,
            this.props.home.category,
            this.props.home.popularhomeproducts,
            this.props.home.newproducts
        ]);
        var isLoggedIn = this.props.login.login_details.hasValue();
        var left = isLoggedIn == true ? (
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
        ) : <Left style={{ flex: 1, alignSelf: 'center', top: width * -0.02 }}>
                <Button onPress={() => this.props.navigation.navigate('Login')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>;

        var right = (
            // <LoadStatusView loadStatus={loadStatusCollection}>
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button style={{ flex: 0 }} onPress={() => this.searchHeader()} transparent>
                    <Icon name="ios-search" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Right>
            // </LoadStatusView>
        );

        return (
            // <KeyboardAvoidingView>
            // <Fragment>
            //     <SafeAreaView style={{ flex: 1, backgroundColor: 'red' }} />

            <Auth permit="authed">

                <Container style={{ width: '100%' }}>

                    {this.state.issearch == false ?
                        <>
                            <Navbar left={left} right={right} title="Home" fontSize={30} />
                        </>
                        :
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
                                            //value={this.state.searchText}
                                            style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}
                                        />
                                        {/* <Icon name="ios-search" style={{ fontSize: 30, color: '#413d3d' }} onPress={() => this.searchFilterFunction(this.state.searchText)} /> */}
                                    </Item>
                                </Body>
                            </View>
                            <Right style={{ flex: 1, alignSelf: 'center' }}>
                                {/* <TouchableOpacity transparent onPress={() => this.OpenBarcode()}>
                                    <Image square style={{ width: 50, height: 50, marginLeft: 0, marginBottom: 0 }} source={require('../../images/barcode-scan.png')} />
                                </TouchableOpacity> */}
                            </Right>
                        </Header>
                    }

                    <LoadStatusView loadStatus={loadStatusCollection} />
                    <View style={{ flex: 1, }}>


                        {this.state.searchText && this.state.issearch && shproducts.length > 0 ?
                            <View style={{ position: 'absolute', zIndex: 1, width: width, flexDirection: 'column', height: height * 0.35, }}>
                                <FlatList
                                    keyboardShouldPersistTaps='handled'
                                    data={shproducts}
                                    keyExtractor={this.keyExtractor.bind(this)}
                                    renderItem={this.renderListItem.bind(this)}
                                    scrollEventThrottle={300}
                                    scrollRenderAheadDistance={0.5}
                                    onEndReachedThreshold={0.01}
                                    onEndReached={this.endReached.bind(this)}
                                    style={{ backgroundColor: '#FFFFFFF' }}
                                />
                            </View>
                            : null}


                        {this.state.isbarcode == true ?
                            <Scanbarcode
                                onBarCodeRead={this.barcodeReceived}
                                style={{ flex: 1 }}
                                torchMode={this.state.torchMode}
                                cameraType={this.state.cameraType}
                            />
                            :
                            <>
                                <Content refreshControl={
                                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                                        this._onRefresh()
                                    }} />}>
                                    <View style={{ flex: 1, height: '100%', position: 'relative', zIndex: -10 }}>
                                        {banner.length > 0 ?
                                            <View style={{ height: height * 0.35, alignItems: 'center', alignSelf: 'center' }}>
                                                {this.renderBannerlist(banner)}
                                            </View>
                                            : null}

                                        {offproducts.length > 0 ?
                                            <View style={{ position: 'relative', zIndex: -9999 }}>
                                                <TouchableOpacity onPress={() => this.gotooffer()}>
                                                    <Text style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, textDecorationLine: 'underline' }} >All Offers</Text>
                                                </TouchableOpacity>
                                                {this.renderofferproducts(offproducts)}
                                            </View>
                                            : null}

                                        {category.length > 0 ?
                                            <View style={{ position: 'relative', zIndex: -9999 }}>
                                                <TouchableOpacity onPress={() => this.gotocategories()}>
                                                    <Text style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, textDecorationLine: 'underline' }} >All Categories</Text>
                                                </TouchableOpacity>
                                                {this.renderCatgorylist(category)}
                                            </View>
                                            : null}

                                        {groupproduct.length > 0 ?
                                            <View style={{ position: 'relative', zIndex: -9999 }}>
                                                <TouchableOpacity onPress={() => this.gotogroupons()}>
                                                    <Text style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, textDecorationLine: 'underline' }} >All Groupons</Text>
                                                </TouchableOpacity>
                                                {this.renderGrouonlist(groupproduct)}
                                            </View>
                                            : null}

                                        {popproducts.length > 0 ?
                                            <View style={{ position: 'relative', zIndex: -9999 }}>
                                                <TouchableOpacity onPress={() => this.gotopopular()}>
                                                    <Text style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, textDecorationLine: 'underline' }} >All Popular</Text>
                                                </TouchableOpacity>
                                                {this.renderpopularproductlist(popproducts)}
                                            </View>
                                            : null}

                                        {nwproducts.length > 0 ?
                                            <View style={{ position: 'relative', zIndex: -9999 }}>
                                                <TouchableOpacity onPress={() => this.gotonewproducts()}>
                                                    <Text style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 10, textDecorationLine: 'underline' }} >All News</Text>
                                                </TouchableOpacity>
                                                {this.rendernewproducts(nwproducts)}
                                            </View>
                                            : null}

                                    </View>
                                </Content>
                                <>
                                    {total_products > 0 && isLoggedIn == true ?
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('CartDetails')} style={styles.MainContainer}>
                                            <View style={{ left: 7, alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon type="AntDesign" name="shoppingcart" style={{ fontSize: 45, width: 65, color: 'white', fontFamily: "Helvetica Neue" }} />
                                            </View>
                                            <View style={{ position: 'absolute', backgroundColor: 'red', top: -3, right: -3, justifyContent: 'center', alignItems: 'center', height: 20, width: 20, borderRadius: 200 / 2 }}>
                                                <Text style={{ color: 'white' }}>{total_products}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        : null}
                                </>
                            </>
                        }

                    </View>
                </Container >
            </Auth>
            // </Fragment>
        )
    }

    renderPage(image, index) {
        return (
            <View >
                <Image style={{ width: BannerWidth, height: BannerHeight, margin: 0 }} source={{ uri: image.image }} />
            </View>
        );
    }

    renderBannerlist(banner) {
        var { height, width } = Dimensions.get('window');
        const renderItem = ({ item, index }, parallaxProps) => {
            return (
                <View style={{ left: width * -0.145 }}>
                    <ParallaxImage
                        source={{ uri: item.image }}
                        containerStyle={styles.imageContainer}
                        style={styles.itemImage}
                        parallaxFactor={-0.1}
                        {...parallaxProps}
                    />
                </View>
            );
        };
        return (
            <View style={styles.container}>
                {/* <Carousel
                    autoplay
                    autoplayTimeout={5000}
                    index={0}
                    pageSize={BannerWidth}
                    ItemSeparatorComponent={
                        () => <View style={{ margin: 3 }} />
                    }
                >
                    {banner.map((image, index) => this.renderPage(image, index))}
                </Carousel> */}

                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    autoplay={5000}
                    //autoplayTimeout={5000}
                    loop={true}
                    sliderWidth={width}
                    padding={10}
                    itemWidth={width - 95}
                    data={banner}
                    style={{ resizeMode: 'contain' }}
                    renderItem={renderItem}
                    hasParallaxImages={true}
                />
            </View >
        )
    }

    renderCatgorylist(category) {
        var { height, width } = Dimensions.get('window');
        var styleradius = {
            marginLeft: 20,
            width: '100%',
            height: 31,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#8cc640',
            borderWidth: 3,
            borderColor: '#fdb83a',
            borderRadius: 16,
            marginHorizontal: 8
        }


        return (

            <View style={{ marginTop: 10, marginLeft: 0 }}>
                <FlatList
                    //style={{ width: '100%' }}
                    data={category}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={
                        () => <View style={{ margin: 3 }} />
                    }
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.gotosubcategory(item)} style={{ marginLeft: 10, marginRight: 15, justifyContent: 'space-evenly', backgroundColor: '#efeded' }}>
                            <Image
                                source={{ uri: item.cover }}
                                style={{ width: width * 0.18, height: width * 0.2 }}
                            />
                        </TouchableOpacity>
                    )}
                />
            </View>


        )
    }

    getleftdays = (enddate) => {
        var Difference_In_Time = new Date(enddate.split(" ")[0]).getTime() - new Date().getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        return parseInt(Difference_In_Days) + 1

    }

    renderGrouonlist(groupproduct) {
        var { height, width } = Dimensions.get('window');
        var styleradius = {
            marginLeft: 20,
            width: '100%',
            height: 31,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#8cc640',
            borderWidth: 3,
            borderColor: '#fdb83a',
            borderRadius: 16,
            marginHorizontal: 8
        }


        return (

            <View style={{ marginTop: 10, marginLeft: 0 }}>
                <FlatList
                    //style={{ width: '100%' }}
                    data={groupproduct}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={
                        () => <View style={{ margin: 3 }} />
                    }
                    renderItem={({ item, index }) => (
                        <TouchableOpacity onPress={() => this.gotoproductdeatils(item, 'Groupon')} style={{ marginLeft: 10, ginRight: 15, justifyContent: 'space-evenly', backgroundColor: '#efeded' }}>
                            <Image
                                source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                style={{ width: 170, height: 170, }}
                            />
                            <View style={{ position: 'absolute', backgroundColor: '#8cc640', right: -8, justifyContent: 'center', alignItems: 'center', height: 28, width: 65 }}>
                                <Text style={{ color: 'white', fontSize: 13 }}>Days Left</Text>
                            </View>
                            <View style={{ position: 'absolute', backgroundColor: '#fdb83a', top: 25, right: -8, justifyContent: 'center', alignItems: 'center', height: 55, width: 65 }}>
                                <Text style={{ color: 'white', fontSize: 50 }}>{this.getleftdays(item.end_date)}</Text>
                            </View>
                            <View style={{ position: 'absolute', backgroundColor: '#8cc640', top: 80, right: -8, justifyContent: 'center', alignItems: 'center', height: 28, width: 65 }}>
                                <Text style={{ color: 'white', fontSize: 16 }}>€ {item.price}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>


        )
    }

    renderpopularproductlist(popularproducts) {
        var { height, width } = Dimensions.get('window');
        var styleradius = {
            marginLeft: 20,
            width: '100%',
            height: 31,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#8cc640',
            borderWidth: 3,
            borderColor: '#fdb83a',
            borderRadius: 16,
            marginHorizontal: 8
        }


        return (

            <View style={{ marginTop: 10, marginLeft: 0 }}>
                <FlatList
                    //style={{ width: '100%' }}
                    data={popularproducts}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={
                        () => <View style={{ margin: 3 }} />
                    }
                    renderItem={({ item, index }) => (

                        <TouchableOpacity onPress={() => this.gotoproductdeatils(item, 'Popular')} style={{ marginLeft: 10, marginRight: 15, justifyContent: 'space-evenly', backgroundColor: '#efeded' }}>
                            <Image
                                source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                style={{ width: 120, height: 120, }}
                            />
                            <View style={{ position: 'absolute', backgroundColor: '#8cc640', right: -3, justifyContent: 'center', alignItems: 'center', height: 38, width: 38, borderRadius: 200 / 2 }}>
                                <Text style={{ color: 'white', fontSize: 11 }}>€ {item.price}</Text>
                            </View>
                        </TouchableOpacity>

                    )}
                />
            </View>


        )
    }

    renderofferproducts(offerproducts) {
        var { height, width } = Dimensions.get('window');
        var styleradius = {
            marginLeft: 20,
            width: '100%',
            height: 31,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#8cc640',
            borderWidth: 3,
            borderColor: '#fdb83a',
            borderRadius: 16,
            marginHorizontal: 8
        }


        return (

            <View style={{ marginTop: 10, marginLeft: 0 }}>
                <FlatList
                    style={{ width: '100%', height: 130 }}
                    data={offerproducts}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={
                        () => <View style={{ margin: 3 }} />
                    }
                    renderItem={({ item, index }) => (

                        <TouchableOpacity onPress={() => this.gotoproductdeatils(item, 'Offer')} style={{ marginLeft: 10, marginRight: 15, justifyContent: 'space-evenly', backgroundColor: 'transparent' }}>
                            <Image
                                source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                style={{ width: 120, height: 120, }}
                            />
                            <View style={{ position: 'absolute', zIndex: 9999, backgroundColor: '#ff9500', right: -8, top: 0, justifyContent: 'center', alignItems: 'center', height: 45, width: 45, borderRadius: 200 / 2 }}>
                                <Text style={{ color: 'white', fontSize: 11 }}>€ {item.amt}</Text>
                            </View>
                        </TouchableOpacity>

                    )}
                />
            </View>


        )
    }

    rendernewproducts(newproducts) {
        var { height, width } = Dimensions.get('window');
        var styleradius = {
            marginLeft: 20,
            width: '100%',
            height: 31,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#8cc640',
            borderWidth: 3,
            borderColor: '#fdb83a',
            borderRadius: 16,
            marginHorizontal: 8
        }


        //alert(products.length)
        return (

            <View style={{ marginTop: 10, marginLeft: 0 }}>
                <FlatList
                    //style={{ width: '100%' }}
                    data={newproducts}
                    horizontal={true}
                    keyExtractor={(item, index) => index.toString()}
                    ItemSeparatorComponent={
                        () => <View style={{ margin: 3 }} />
                    }
                    renderItem={({ item, index }) => (

                        <TouchableOpacity onPress={() => this.gotoproductdeatils(item, 'New Products')} style={{ marginLeft: 10, marginRight: 15, justifyContent: 'space-evenly', backgroundColor: '#efeded' }}>
                            <Image
                                source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                style={{ width: 120, height: 120, }}
                            />
                            <View style={{ position: 'absolute', backgroundColor: '#8cc640', right: -3, justifyContent: 'center', alignItems: 'center', height: 38, width: 38, borderRadius: 200 / 2 }}>
                                <Text style={{ color: 'white', fontSize: 11 }}>€ {item.price}</Text>
                            </View>
                        </TouchableOpacity>

                    )}
                />
            </View>


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
    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 200 / 2,
        height: 65,
        width: 65,
        backgroundColor: '#ff9500',
        borderColor: '#ff9500',
        right: 20,
        bottom: 20,
        position: 'absolute',
        zIndex: 9999
    },
    container: {
        flex: 1,
        alignSelf: 'center'
    },
    itemImage: {
        //width: width - 20,
        resizeMode: 'stretch',
    },
    imageContainer: {
        height: width * 0.5,
        width: width,
    },
})
