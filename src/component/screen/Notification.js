
import React, { Component } from 'react';
import { StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Content, Body } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faTimes } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';
import LoadStatusView from '../load-status-view';
import LoadStatusCollection from '../../lib/load-status-collection';
import Navbar from '../Navbar';


export default class Notification extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false
        };
        this.props.notificationGetList();
        this.props.unreadNotification();
    }

    removeNotification(id) {
        this.props.notificationDelete(id)
    }
    readNotification = async (item) => {
        if (item.read == 0) {
            this.props.notificationRead(item.id);
            this.props.notificationGetList();
            this.props.unreadNotification();
        }
    }

    _onRefresh = async () => {
        this.setState({ refreshing: true });
        await this.props.notificationGetList();
        await this.props.unreadNotification();
        this.setState({ refreshing: false });
    }

    render() {
        var { height, width } = Dimensions.get('window');

        var notificationList = this.props.account.notificationList
        var notification = notificationList ? notificationList.hasValue() ? notificationList.getValue() : [] : [];

        var loadStatusCollection = LoadStatusCollection.create([
            this.props.account.notificationList,
        ]);

        var left = (

            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Home')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>

        );
        var right = (
            <Right style={{ flex: 1 }}>
                {/* <Button style={{ flex: 0, marginLeft: width * 0.5, marginBottom: width * 0.05 }} transparent>
                    <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} />
                </Button> */}
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#FFFFFF', position: 'relative' }}>

                <Navbar left={left} title="Notification" fontSize={30} marginLeft={28} />
                {/* <LoadStatusView loadStatus={loadStatusCollection} /> */}
                {/* <Content refreshControl={
                    <RefreshControl refreshing={this.state.refreshing} onRefresh={() => {
                        this._onRefresh()
                    }} />}> */}

                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                    <FlatList
                        style={{ marginTop: 10, width: width, height: height }}
                        data={notification}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={() => {
                                    this._onRefresh();
                                }}
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={{ backgroundColor: '#ebeff0', marginBottom: 10, height: 110 }}>
                                <View style={{ flexDirection: 'row', width: '100%', }}>
                                    <TouchableOpacity style={{ backgroundColor: 'white', borderRadius: 200 / 2, height: 25, width: 25, marginLeft: 10, alignSelf: 'center' }} onPress={() => this.readNotification(item)}>
                                        {item.read == 1 ?
                                            null
                                            : <View style={{ marginLeft: 5, marginTop: 5, marginRight: 0, height: 15, width: 15, backgroundColor: '#ff9500', borderRadius: 200 / 2, zIndex: -9999, }} >
                                            </View>}
                                    </TouchableOpacity>
                                    <View style={{ marginLeft: 20 }}>
                                        <Row style={{ height: '80%' }}>
                                            <Text style={{ color: '#0f010', marginTop: width * 0.02, fontFamily: 'Muna', fontSize: 14, width: width * 0.75 }} numberOfLines={3}>
                                                {item.message}
                                            </Text>
                                            <Button onPress={() => this.removeNotification(item.id)} style={{ flex: 0, marginBottom: width * 0.05 }} transparent>
                                                <FontAwesomeIcon icon={faTimes} size={25} style={{ color: 'red' }} />
                                            </Button>
                                        </Row>
                                        <Row style={{ height: '20%', bottom: 10 }}>
                                            <Text style={{ color: '#0f010', fontSize: 14, fontFamily: 'Muna' }}>
                                                {item.created_at}
                                            </Text>
                                        </Row>
                                    </View>
                                </View>
                            </View>
                        )}
                    />
                </View>
                {/* </Content> */}
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