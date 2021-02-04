
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList } from 'react-native';
import { Container, Button, Left, Right, Content, Input, Icon, Row } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faSave } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';
// import SelectableChips from 'react-native-chip/SelectableChips'
import Navbar from '../Navbar';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
import { ScrollView } from 'react-native-gesture-handler';
import Config from 'react-native-config';
import Flag from 'react-native-flags';

export default class SubCategory extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            viewcategory: this.props.categories.viewcategory,
            selectedIndex: 0,
            grouponcart: [],
            page: 1
        };
        this.getgroupon();
    }
    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
            this.setState({ selectedIndex: 0, page: 1, });
        });
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ viewcategory: nextProps.categories.viewcategory, page: 1, });
    }

    gotoproductdeatils(content) {
        //alert(content.id)
        this.props.productGetList(content.id, '')
        this.props.navigation.navigate('ProductDetails')
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

    endReached = async () => {
        // this.props.productGetListMore(this.state.searchText)
        // alert(this.state.viewcategory.children[this.state.selectedIndex].id)
        await this.props.subcategoriesGetList(this.state.viewcategory.children[this.state.selectedIndex].id)
    }

    backTo = async () => {
        setTimeout(async () => {
            await this.props.navigation.navigate('Categories');
        }, 500);

    }

    renderListItem(item) {
        var item = item.item
        var { height, width } = Dimensions.get('window');
        //console.log("787978789", item)
        return (
            <View style={{ flexDirection: 'row', marginBottom: 10, height: 120 }}>
                <TouchableOpacity onPress={() => this.gotoproductdeatils(item)} style={{ height: 140, width: '33.33%', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    {item && item.cover != undefined && item.cover != null ?
                        <Image
                            source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                            style={{ height: 120, width: 120 }}
                        />
                        : null}
                </TouchableOpacity>
                <View style={{ width: '66.66%', marginLeft: 0, backgroundColor: '#F4B83A' }}>
                    <Text style={{ color: 'white', padding: 10, fontSize: width * 0.05, textAlign: 'left', fontFamily: "Helvetica Neue", width: width * 0.66 }} numberOfLines={2}>
                        {item && item.name != undefined && item.name != null ? item.name : null}
                    </Text>
                    <Row style={{ justifyContent: 'space-between' }}>
                        <View style={{ alignSelf: 'center', justifyContent: 'center', height: 30, width: 60, marginLeft: 10, }}>
                            {/* <FontAwesomeIcon icon={faHeart} size={55} style={{ color: 'red' }} /> */}
                            {/* <ReactCountryFlag countryCode="US" svg /> */}
                            {item && item.country_id != undefined && item.country_id != null ? this.getflag(item.country_id) : null}
                        </View>

                        <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'white', fontSize: 30, right: 25 }}>
                            € {item && item.price != undefined && item.price != null ? item.price : null}
                        </Text>
                    </Row>
                </View>
            </View>
        )
    }

    renderNoContent() {
        return (
            <Content contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ flex: 0.5 }}>No content available yet.</Text>
            </Content>
        );
    }
    callcategories(index) {
        this.setState({ selectedIndex: index, page: 1 }, async () => {
            this.props.subcategoriesSetPage(1)
            this.props.subcategoriesSetData([])
            this.props.subcategoriesGetList(this.state.viewcategory.children[index].id)
        })
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

    render() {
        var subcategoryLoadStatus = this.props.categories.subcategory;
        var subcategory = subcategoryLoadStatus ? subcategoryLoadStatus.hasValue() ? subcategoryLoadStatus.getValue() : [] : [];
        var cart = this.props.cart.cart
        var total_products = cart.hasValue() ? cart.getValue().length : 0;
        total_products = total_products + this.state.grouponcart.length
        // alert(JSON.stringify(subcategory))
        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1, alignSelf: 'center', }}>
                <Button onPress={() => this.backTo()} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center', }}>
                <Button style={{ flex: 0 }} onPress={() => this.props.navigation.navigate('CartDetails')} transparent>

                    <Icon type="AntDesign" name="shoppingcart" style={{ fontSize: 40, color: 'white', fontFamily: "Helvetica Neue", height: width * 0.1 }} />

                    {total_products > 0 ?
                        <View style={{ position: 'absolute', top: -10, right: 5, justifyContent: 'flex-start', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                            <Text style={{ color: 'white', fontFamily: "Helvetica Neue", fontSize: width * 0.04 }}>{total_products}</Text>
                        </View>
                        : null}
                </Button>
            </Right>
        );

        var loadStatusCollection = LoadStatusCollection.create([
            this.props.categories.subcategory
        ]);

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

        var style = {
            marginLeft: 20,
            width: '100%',
            height: 31,
            justifyContent: 'center',
            alignSelf: 'center',
            alignItems: 'center',
            backgroundColor: '#8cc640',
            borderRadius: 16,
        }
        //alert(subcategory.length)
        var content = subcategory.length ? (
            <View style={{ flex: 0.92 }}>
                <FlatList
                    style={{ marginTop: 10, width: width * 0.99 }}
                    data={subcategory}
                    keyExtractor={(item, index) => index.toString()}
                    scrollEventThrottle={300}
                    scrollRenderAheadDistance={0.5}
                    onEndReachedThreshold={0.01}
                    onEndReached={this.endReached.bind(this)}
                    ItemSeparatorComponent={
                        () => <View style={{ height: 10 }} />
                    }
                    renderItem={this.renderListItem.bind(this)}
                />
            </View>
        ) : this.renderNoContent();

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>

                <Navbar left={left} right={right} title={this.state.viewcategory.name} fontSize={30} marginLeft={28} />
                <LoadStatusView loadStatus={loadStatusCollection} />
                <View style={{ flex: 1 }}>
                    {/* <ScrollView horizontal style={{ backgroundColor: 'red' }}> */}
                    <View style={{ flex: 0.08 }}>
                        <FlatList
                            //style={{ width: '100%' }}
                            data={this.state.viewcategory.children}
                            horizontal={true}
                            keyExtractor={(item, index) => index.toString()}
                            ItemSeparatorComponent={
                                () => <View style={{ margin: 3 }} />
                            }
                            renderItem={({ item, index }) => (
                                <View style={{ marginRight: 15, justifyContent: 'space-evenly' }}>
                                    <TouchableOpacity onPress={() => this.callcategories(index)} style={this.state.selectedIndex == index ? styleradius : style}>
                                        <Text style={{ fontFamily: "Helvetica Neue", color: '#FFFFFF', fontSize: 16, textAlign: 'center' }}>{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    </View>
                    {/* </ScrollView> */}
                    {content}

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