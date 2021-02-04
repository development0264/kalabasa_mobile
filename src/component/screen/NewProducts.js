
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Col } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faTimes, faCheck, faBan } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';



import Navbar from '../component/Navbar';


export default class NewProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            FlatListItems: [
                {
                    imageUrl: 'file:///Users/logixbuilt/Downloads/hiclipart.com.png',
                    imageUrl2: 'file:///Users/logixbuilt/Downloads/PngItem_1940970.png',
                    imageUrl3: 'file:///Users/logixbuilt/Downloads/grainwaves_pack.png',
                    price1: '€ 11.5',
                    price2: '€ 8.00',
                    price3: '€ 6.50'
                },

                {
                    imageUrl: 'file:///Users/logixbuilt/Downloads/hiclipart.com.png',
                    imageUrl2: 'file:///Users/logixbuilt/Downloads/PngItem_1940970.png',
                    imageUrl3: 'file:///Users/logixbuilt/Downloads/grainwaves_pack.png',
                    price1: '€ 11.5',
                    price2: '€ 8.00',
                    price3: '€ 6.50'
                },

                {
                    imageUrl: 'file:///Users/logixbuilt/Downloads/hiclipart.com.png',
                    imageUrl2: 'file:///Users/logixbuilt/Downloads/PngItem_1940970.png',
                    imageUrl3: 'file:///Users/logixbuilt/Downloads/grainwaves_pack.png',
                    price1: '€ 11.5',
                    price2: '€ 8.00',
                    price3: '€ 6.50'
                },

                {
                    imageUrl: 'file:///Users/logixbuilt/Downloads/hiclipart.com.png',
                    imageUrl2: 'file:///Users/logixbuilt/Downloads/PngItem_1940970.png',
                    imageUrl3: 'file:///Users/logixbuilt/Downloads/grainwaves_pack.png',
                    price1: '€ 11.5',
                    price2: '€ 8.00',
                    price3: '€ 6.50'
                },

                {
                    imageUrl: 'file:///Users/logixbuilt/Downloads/hiclipart.com.png',
                    imageUrl2: 'file:///Users/logixbuilt/Downloads/PngItem_1940970.png',
                    imageUrl3: 'file:///Users/logixbuilt/Downloads/grainwaves_pack.png',
                    price1: '€ 11.5',
                    price2: '€ 8.00',
                    price3: '€ 6.50'
                },
            ]
        };

    }


    render() {
        var { height, width } = Dimensions.get('window');
        var left = (
            <Left style={{ flex: 1, marginRight: 0 }}>
                <Button style={{ flex: 0, marginBottom: width * 0.05 }} transparent>
                    <FontAwesomeIcon icon={faChevronLeft} size={30} style={{ color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1 }}>
                <Button style={{ flex: 0, marginLeft: width * 0.0, marginBottom: width * 0.05 }} transparent>
                    {/* <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} /> */}
                    <View>
                        <Image square style={{ width: 40, height: 40, marginLeft: 0, marginBottom: 0 }} source={require('../images/cart.png')} />
                    </View>
                    <View style={{ position: 'absolute', top: -3, right: 5, justifyContent: 'center', alignItems: 'center', height: 20, width: 20, backgroundColor: 'red', borderRadius: 200 / 2 }}>
                        <Text style={{ color: 'white', fontWeight: '500' }}>2</Text>
                    </View>
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>

                <Navbar left={left} right={right} title="New Products" fontSize={30} marginLeft={28} />
                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <FlatList
                        style={{ marginTop: 10, width: width * 0.99 }}
                        data={this.state.FlatListItems}
                        renderItem={({ item }) => (
                            <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10, height: 110, justifyContent: 'space-evenly' }}>
                                <View>
                                    <Image
                                        source={{ uri: item.imageUrl }}
                                        style={{ height: 110, width: 110, zIndex: -9999 }}
                                    />
                                    <View style={{ backgroundColor: '#F6C661', marginTop: width * -0.23, opacity: 0.7, marginLeft: 70, marginTop: -120, borderRadius: 100 / 2, height: 50, width: 50 }}>
                                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16, marginTop: 16, fontWeight: '500' }}>{item.price1}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Image
                                        source={{ uri: item.imageUrl2 }}
                                        style={{ height: 110, width: 110, zIndex: -9999 }}
                                    />
                                    <View style={{ backgroundColor: '#F6C661', marginTop: width * -0.23, opacity: 0.7, marginLeft: 70, marginTop: -120, borderRadius: 100 / 2, height: 50, width: 50 }}>
                                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16, marginTop: 16, fontWeight: '500' }}>{item.price2}</Text>
                                    </View>
                                </View>
                                <View>
                                    <Image
                                        source={{ uri: item.imageUrl3 }}
                                        style={{ height: 110, width: 110, zIndex: -9999 }}
                                    />
                                    <View style={{ backgroundColor: '#F6C661', marginTop: width * -0.23, opacity: 0.7, marginLeft: 70, marginTop: -120, borderRadius: 100 / 2, height: 50, width: 50 }}>
                                        <Text style={{ alignSelf: 'center', color: 'white', fontSize: 16, marginTop: 16, fontWeight: '500' }}>{item.price3}</Text>
                                    </View>
                                </View>

                            </View>
                        )}
                        keyExtractor={(item, index) => index.toString()}
                    />
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