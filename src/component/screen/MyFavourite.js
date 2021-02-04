
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faSave, faHeart } from '@fortawesome/free-solid-svg-icons';
//import { Actions } from 'react-native-router-flux';

import Config from 'react-native-config';

import Navbar from '../Navbar';
import Flag from 'react-native-flags';
import { Circle } from 'react-native-svg';

export default class MyFavourite extends Component {

    constructor(props) {
        super(props);
        this.props.favoriteproductGetList()
    }

    componentDidMount() {
        this.props.favoriteproductGetList()
    }

    getflag(countryid) {
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

    gotoproductdeatils(content, type) {
        //alert(content.product_id)
        this.props.productGetList(content.product_id, type)
        this.props.navigation.navigate('ProductDetails')
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var fproduct = this.props.product.favouriteproduct;
        var favouriteproduct = fproduct ? fproduct.hasValue() ? fproduct.getValue() : [] : [];

        var left = (

            <Left style={{ flex: 1, alignSelf: 'center', }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: width * 0.095, color: 'white' }} />
                </Button>
            </Left>

        );

        // var right = (
        //     <Right style={{ flex: 1, alignSelf: 'center' }}>
        //         <Button style={{ flex: 0, marginLeft: width * 0.5 }} transparent>
        //             <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} />
        //         </Button>
        //     </Right>
        // );

        return (
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>

                <Navbar left={left} title="My Favourite" fontSize={30} marginLeft={28} />
                {favouriteproduct.length > 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <FlatList
                            style={{ marginTop: 10, width: width * 0.99, }}
                            data={favouriteproduct}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', marginBottom: 10, height: 130 }}>
                                    <TouchableOpacity onPress={() => this.gotoproductdeatils(item, 'Favourite')}>
                                        <Image
                                            source={{ uri: Config.IMAGE_BASE_URL + item.cover }}
                                            style={{ height: 130, width: 120 }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ width: width * 0.75, marginLeft: 0, backgroundColor: '#F4B83A' }}>
                                        <Text numberOfLines={2} ellipsizeMode={'tail'} style={{ color: 'white', padding: 10, fontSize: 18, width: width * 0.7 }}>
                                            {item.product_name}
                                        </Text>

                                        <Row style={{ justifyContent: 'space-between' }}>
                                            {/* <Image
                                            source={{ uri: item.cover }}
                                            style={{ height: 40, width: 80, marginTop: 20, marginLeft: 10 }}
                                        /> */}

                                            <View style={{ height: 30, width: 60, marginLeft: 10, left: 0 }}>
                                                {/* <FontAwesomeIcon icon={faHeart} size={55} style={{ color: 'red' }} /> */}
                                                {/* <ReactCountryFlag countryCode="US" svg /> */}
                                                {this.getflag(item.country_id)}
                                            </View>

                                            <Text style={{ alignSelf: 'center', textAlign: 'center', color: 'white', fontSize: 30, right: 40 }}>
                                                € {item.price}
                                            </Text>
                                        </Row>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                    :
                    <View style={{ marginTop: height * 0.38 }}>
                        <FontAwesomeIcon icon={faHeart} size={40} style={{ color: '#8CC63F', alignSelf: 'center' }} />
                        <Text style={{ fontSize: width * 0.05, fontWeight: '500', alignSelf: 'center' }}>No Favourite Items...!</Text>
                    </View>
                }
            </Container>
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