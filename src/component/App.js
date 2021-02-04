import 'react-native-gesture-handler';
import React, { Component, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Root, StyleProvider } from 'native-base';
import configureStore from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Navigation from './containers/navigation';
import SplashScreen from 'react-native-splash-screen';
import { navigation, auth } from '../redux/services';
import { SafeAreaView, StatusBar, Alert } from 'react-native';
var { persistor, store } = configureStore();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {}
        setTimeout(() => {
            SplashScreen.hide();
        }, 3000);

    }


    render() {
        return (
            <Root>
                <Provider store={store}>
                    <PersistGate
                        persistor={persistor}
                    >
                        <StatusBar translucent backgroundColor={'#8CC63F'} />
                        <Navigation />
                    </PersistGate>
                </Provider>
            </Root>
        );
    }
}


//export default Main;