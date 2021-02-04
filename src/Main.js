import React, { Component, useEffect } from 'react';
import { Provider } from 'react-redux';
import { Root, StyleProvider } from 'native-base';
import { Scene, Router } from 'react-native-router-flux';


import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Categories from './pages/Categories';
import SubCategory from './pages/SubCategory';
import SelectAddress from './pages/SelectAddress';

import configureStore from '../redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Navigation from './containers/navigation';
var { persistor, store } = configureStore();

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            // <Root>
            //     <Router>
            //         <Scene key="root">
            //             <Scene key="login" component={Login} hideNavBar />
            //             <Scene key="register" component={Register} hideNavBar />
            //             <Scene key="forgotpassword" component={ForgotPassword} hideNavBar />
            //             {/* <Scene initial key="ordersuccess" component={OrderSuccess} hideNavBar /> */}
            //             {/* <Scene initial key="editaddress" component={EditAddress} hideNavBar /> */}
            //             {/* <Scene initial key="accountsetting" component={AccountSetting} hideNavBar /> */}
            //             {/* <Scene initial key="myfavourite" component={MyFavourite} hideNavBar /> */}
            //             {/* <Scene initial key="notification" component={Notification} hideNavBar /> */}
            //             {/* <Scene initial key="cartitem" component={CartItem} hideNavBar /> */}
            //             {/* <Scene initial key="selectaddress" component={SelectAddress} hideNavBar /> */}
            //             {/* <Scene initial key="history" component={History} hideNavBar /> */}
            //             {/* <Scene initial key="addrequest" component={AddRequest} hideNavBar /> */}
            //             {/* <Scene initial key="request" component={Request} hideNavBar /> */}
            //             {/* <Scene initial key="orderdetail" component={OrderDetail} hideNavBar /> */}
            //             {/* <Scene initial key="popular" component={Popular} hideNavBar /> */}
            //             {/* <Scene initial key="newproducts" component={NewProducts} hideNavBar /> */}
            //             {/* <Scene initial key="offers" component={Offers} hideNavBar /> */}
            //             <Scene key="categories" component={Categories} hideNavBar />
            //             <Scene key="subcategory" component={SubCategory} hideNavBar />
            //             <Scene initial key="selectaddress" component={SelectAddress} hideNavBar />
            //         </Scene>
            //     </Router>
            // </Root>
            <Root>
                <Provider store={store}>
                    <PersistGate
                        persistor={persistor}
                    >
                        <StyleProvider>
                            <Navigation />
                        </StyleProvider>
                    </PersistGate>
                </Provider>
            </Root>
        );
    }

}


//export default Main;