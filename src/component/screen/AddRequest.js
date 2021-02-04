
import React, { Component } from 'react';
import { Image, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { Container, Button, Left, Right, Item, Input, Icon, Row, Content } from 'native-base';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faChevronLeft, faSave } from '@fortawesome/free-solid-svg-icons'
//import { Actions } from 'react-native-router-flux';



import Navbar from '../Navbar';


export default class AddRequest extends Component {

    constructor(props) {
        super(props);
        this.state = {
            order_id: this.props.account.orderdetails.id,
            message: null,
        };

    }

    submit = async () => {
        var data = {
            order_id: this.state.order_id,
            message: this.state.message
        }

        await this.props.requestmessagesInsert(data)
        await this.props.navigation.navigate('Request')
    }

    render() {
        var { height, width } = Dimensions.get('window');
        var left = (

            <Left style={{ flex: 1, alignSelf: 'center' }}>
                <Button onPress={() => this.props.navigation.navigate('Request')} transparent>
                    <Icon name="ios-arrow-back" style={{ fontSize: 40, color: 'white' }} />
                </Button>
            </Left>

        );

        var right = (
            <Right style={{ flex: 1 }}>
                <Button style={{ flex: 0, marginLeft: width * 0.5, marginBottom: width * 0.05 }} transparent>
                    {/* <FontAwesomeIcon icon={faSave} size={35} style={{ color: 'white' }} /> */}
                </Button>
            </Right>
        );

        return (

            // <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
            <Container style={{ backgroundColor: '#ebeff0', position: 'relative' }}>

                <Navbar left={left} right={right} title="Request" fontSize={30} marginLeft={28} />

                <Content>
                    <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                        <View style={{ flex: 0.9 }}>

                            <Text style={{ fontSize: 25 }}>Add your request below : </Text>

                            <Item style={{ width: '90%', marginTop: width * 0.05, height: '40%', backgroundColor: 'white' }}>
                                <Input
                                    value={this.state.message}
                                    onChangeText={(text) => this.setState({ message: text })}
                                    placeholder="Add Your Request here..."
                                    placeholderTextColor='grey'
                                    multiline
                                    numberOfLines={10}
                                    style={{ alignSelf: 'flex-start' }} />
                            </Item>

                            <Row style={{ justifyContent: 'space-around', marginTop: width * 0.1 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: '#D75A4A', borderRadius: 30, marginTop: 0, height: 50 }}
                                //   onPress={() => this.login()}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: width * 0.06,
                                            textAlign: 'center',
                                            padding: 10,
                                            paddingRight: 30,
                                            paddingLeft: 30,
                                        }}>
                                        Cancel
                                </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#F4B83A', borderRadius: 30, marginTop: 0, height: 50 }}
                                    onPress={() => this.submit()}
                                >
                                    <Text
                                        style={{
                                            color: 'white',
                                            fontSize: width * 0.06,
                                            textAlign: 'center',
                                            padding: 10,
                                            paddingRight: 30,
                                            paddingLeft: 30,
                                        }}>
                                        Submit
                                </Text>
                                </TouchableOpacity>
                            </Row>

                            <Row>
                                <Text style={{ width: width * 0.9, fontSize: 18, marginTop: -20 }}>* Our customer service will review the request and come back to you.</Text>
                            </Row>

                        </View>
                    </View>
                </Content>
            </Container>
            // </SideMenuDrawer>
        )
    }

}