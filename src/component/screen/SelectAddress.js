
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Footer, Body, Col, Content, Radio } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faPlus, faAngleRight } from '@fortawesome/free-solid-svg-icons';

import AsyncStorage from '@react-native-community/async-storage';
import Navbar from '../Navbar';
export default class SelectAddress extends Component {

    constructor(props) {
        super(props);
        //this.props.addressGetList()
        this.state = {
            selectedaddress: 0,
            FlatListItems: [],
            selectedIndex: 0
        };
        //this.componentDidMount = this.componentDidMount.bind(this);
        this.props.addressGetList()
    }

    componentDidMount() {
        this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
            this.props.addressGetList();
        });
    }

    FlatListItemSeparator = () => {
        return (
            //Item Separator
            <View style={{ height: 1, width: '100%', backgroundColor: '#C8C8C8' }} />
        );
    };

    gotosubcategory = async (item) => {
        await this.props.addressSetViewing(item);
        if (this.props.navigation.state.params.Page == "CartItem") {
            await this.props.shippingsGetList()
            await this.props.navigation.navigate('Payment')
        }
        else {
            await this.props.navigation.navigate('AddEditAddress')
        }


    }

    gotoaddress() {
        this.props.addressSetViewing(null);
        this.props.navigation.navigate('AddEditAddress')
    }



    callcategories(index) {
        this.setState({ selectedIndex: index })
    }

    renderNoContent() {
        return (
            <Content contentContainerStyle={{ flex: 0.88, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Text style={{ fontSize: 20 }}>No address available yet.</Text>
            </Content>
        );
    }

    render() {
        var { height, width } = Dimensions.get('window');

        var addressLoadStatus = this.props.address.address;
        var address = addressLoadStatus ? addressLoadStatus.hasValue() ? addressLoadStatus.getValue() : [] : [];

        var left = (
            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>
        );

        var right = (
            <Right style={{ flex: 1, alignSelf: 'center' }}>
                <Button style={{ flex: 0 }} onPress={() => this.gotoaddress()} transparent>
                    <FontAwesomeIcon icon={faPlus} size={35} style={{ color: 'white' }} />
                </Button>
            </Right>
        );

        var content = address.length ? (
            <View style={{ flex: 0.92 }}>
                <FlatList
                    data={address}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: width * 0.22 }}
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    renderItem={({ item, index }) => (
                        <View style={{ backgroundColor: '#ebeff0', marginBottom: 0, height: 110 }}>
                            <View style={{ flexDirection: 'row' }}>

                                <View style={{ marginLeft: 20 }}>

                                    <Row style={{ height: '100%', alignSelf: 'center', alignItems: 'center' }}>
                                        <Col style={{ alignSelf: 'center', alignItems: 'center', left: -8, width: '15%' }}>

                                            <TouchableOpacity style={{ backgroundColor: 'transparent', width: 30, height: 30, position: 'absolute', zIndex: 9999 }} onPress={() => this.callcategories(index)}>
                                            </TouchableOpacity>
                                            <Radio
                                                style={{ width: 30, height: 30, position: 'relative', zIndex: -9999 }}
                                                selectedColor={"orange"}
                                                selected={item.is_default}
                                            />
                                        </Col>
                                        <Col style={{ width: '72%' }}>
                                            <Text style={{ color: 'black', textAlign: 'left', justifyContent: 'flex-start', fontSize: 18 }} numberOfLines={3}>
                                                {item.alias}
                                            </Text>
                                            <Text style={{ color: 'black', justifyContent: 'center', fontSize: 15 }} numberOfLines={3}>
                                                {item.address_1},{item.address_2}, {item.zip}
                                            </Text>
                                            <Text style={{ color: 'black', justifyContent: 'center', fontSize: 15 }} numberOfLines={3}>
                                                Phone : {item.phone != null ? item.phone : 'N/A'}
                                            </Text>
                                        </Col>
                                        <Col style={{ alignSelf: 'center', alignItems: 'center', width: '10%' }}>
                                            <TouchableOpacity onPress={() => this.gotosubcategory(item)} >
                                                <Icon name="ios-arrow-forward" style={{ fontSize: 50, color: '#707070' }} />
                                            </TouchableOpacity>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Text style={{ color: 'black', fontSize: 18 }}>
                                            {item.time}
                                        </Text>
                                    </Row>
                                </View>
                            </View>
                        </View>

                    )}
                />
            </View>
        ) : this.renderNoContent();

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>
                <Navbar left={left} right={right} title="Address" fontSize={30} marginLeft={28} />
                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
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
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})