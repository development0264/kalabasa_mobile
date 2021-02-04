import React, { Component } from 'react';
import { View, Dimensions, StatusBar } from 'react-native';
import { Header, Body, Title, Left, Right, Icon, Text } from 'native-base';

// Our custom files and classes import
// import Colors from '../Colors';

export default class Navbar extends Component {

    render() {
        var { height, width } = Dimensions.get('window');
        return (
            <>
                <Header
                    transparent
                    style={{ backgroundColor: '#8CC63F', zIndex: 1, height: 100 }}
                    backgroundColor={'#8CC63F'}
                    // androidStatusBarColor={'#233240'}
                    noShadow={true}
                >

                    {this.props.left ? this.props.left : <Left style={{ flex: 1 }} />}
                    <View style={{ alignSelf: 'center' }}>
                        <Body style={{ width: '100%', flex: 0 }}>
                            <Title style={{ fontSize: this.props.fontSize, color: 'white', fontFamily: "Helvetica Neue" }}>{this.props.title}</Title>
                        </Body>
                    </View>
                    {this.props.right ? this.props.right : <Right style={{ flex: 1 }} />}
                </Header>
                <StatusBar translucent backgroundColor={'#8CC63F'} />
            </>
        );
    }
}

const styles = {
    body: {
        // width: '100%',
        // flex: 0,
        // marginBottom: this.props.marginBottom
    },
    title: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // alignContent: 'center',
        // alignSelf: 'center',
        //fontFamily: 'Roboto',
        // fontWeight: '100',

    }
};
