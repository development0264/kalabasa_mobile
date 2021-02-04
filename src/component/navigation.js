import 'react-native-gesture-handler';
import React from 'react';
import { Linking, StatusBar, Alert } from 'react-native';
import { createAppContainer, DrawerActions } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
//import { createStackNavigator } from 'react-navigation-stack';
import { fromLeft, fromRight } from 'react-navigation-transitions';
import { navigation, auth } from '../redux/services';
import axios from '../redux/axios';
import url from 'url';
import SideBar from './containers/side-bar';
import ScreenLogin from './containers/screen/Login';
import ScreenCategories from './containers/screen/Categories';
import ScreenSubCategories from './containers/screen/SubCategories';
import ScreenAddress from './containers/screen/Address';
import ScreenAddEditAddress from './containers/screen/AddEditAddress';
import ScreenHome from './containers/screen/Home';
import ScreenProductDetails from './containers/screen/Product';
import ScreenCartDetails from './containers/screen/CartDetails';
import ScreenPayment from './containers/screen/Payment';
import ScreenAccount from './containers/screen/Account';
import ScreenHistory from './containers/screen/History';
import ScreenFavourite from './containers/screen/MyFavourite';
import ScreenGroupon from './containers/screen/Groupon';
import ScreenOrderDetail from './containers/screen/OrderDetail';
import ScreenRequest from './containers/screen/Request';
import ScreenAddRequest from './containers/screen/AddRequest';
import ScreenSearch from './containers/screen/Search';
import ScreenPopular from './containers/screen/Popular';
import ScreenNotification from './containers/screen/Notification';
import ScreenOrderSuccess from './containers/screen/OrderSuccess';

import ScreenRegister from './../component/screen/Register';
import ScreenForgotPassword from './../component/screen/ForgotPassword';
import firebase from 'react-native-firebase';


const checkprops = (props) => {
  console.log(props)
  return 'Login'
}
AppStackNavigator = createDrawerNavigator({
  Login: {
    screen: ScreenLogin,
    navigationOptions: {
      header: null,

    },
    gesturesEnabled: false
  },
  Register: {
    screen: ScreenRegister,
    navigationOptions: {
      header: null
    }
  },
  ForgotPassword: {
    screen: ScreenForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  Home: {
    screen: ScreenHome,
    navigationOptions: {
      header: null
    }
  },
  Categories: {
    screen: ScreenCategories,
    navigationOptions: {
      header: null
    }
  },
  SubCategories: {
    screen: ScreenSubCategories,
    navigationOptions: {
      header: null
    }
  },
  Address: {
    screen: ScreenAddress,
    navigationOptions: {
      header: null
    }
  },
  AddEditAddress: {
    screen: ScreenAddEditAddress,
    navigationOptions: {
      header: null
    }
  },

  ProductDetails: {
    screen: ScreenProductDetails,
    navigationOptions: {
      header: null
    }
  },
  CartDetails: {
    screen: ScreenCartDetails,
    navigationOptions: {
      header: null
    }
  },
  Payment: {
    screen: ScreenPayment,
    navigationOptions: {
      header: null
    }
  },
  Account: {
    screen: ScreenAccount,
    navigationOptions: {
      header: null
    }
  },
  History: {
    screen: ScreenHistory,
    navigationOptions: {
      header: null
    }
  },
  Notification: {
    screen: ScreenNotification,
    navigationOptions: {
      header: null
    }
  },
  Favourite: {
    screen: ScreenFavourite,
    navigationOptions: {
      header: null
    }
  },
  Groupon: {
    screen: ScreenGroupon,
    navigationOptions: {
      header: null
    }
  },
  OrderDetail: {
    screen: ScreenOrderDetail,
    navigationOptions: {
      header: null
    }
  },
  Request: {
    screen: ScreenRequest,
    navigationOptions: {
      header: null
    }
  },
  AddRequest: {
    screen: ScreenAddRequest,
    navigationOptions: {
      header: null
    }
  },
  Search: {
    screen: ScreenSearch,
    navigationOptions: {
      header: null
    }
  },
  Popular: {
    screen: ScreenPopular,
    navigationOptions: {
      header: null
    }
  },
  Notification: {
    screen: ScreenNotification,
    navigationOptions: {
      header: null
    }
  },
  OrderSuccess: {
    screen: ScreenOrderSuccess,
    navigationOptions: {
      header: null
    }
  }
},
  {

    headerMode: 'none',
    initialRouteName: 'Login',
    drawerType: 'front',
    drawerLockMode: 'unlocked',
    // transitionConfig: () => fromLeft(),
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: true,
      swipeEnabled: true,
      drawerLockMode: 'unlocked'
    }),
    drawerBackgroundColor: 'transparent', // or 'rgba(0,0,0,0)'
    drawerPosition: 'left',
    // drawerLockMode: 'unlocked',
    swipeEnabled: true,
    gesturesEnabled: true,
    edgeWidth: -100,
    contentComponent: props => <SideBar {...props} />,
  },
)
const NavigationContainer = createAppContainer(AppStackNavigator);





// const NavigationContainer = NavigationContainer(AppNavigator);

// const NavMain = StackNavigator({
//   //LeadersBoard: {screen: ScreenLeadersBoard},
//   //Home: { screen: ScreenHome },
//   Login: { screen: ScreenLogin },
//   // LoginSso: { screen: ScreenLoginSso },
//   // TeamPick: { screen: ScreenTeamPick },
//   // FeedPick: { screen: ScreenFeedPick },
//   // ContentView: { screen: ScreenContentView },
//   // ContentEdit: { screen: ScreenContentEdit },
//   // ContentAdd: { screen: ScreenContentAdd },
//   // ContentShare: { screen: ScreenContentShare },
//   // LeadersBoard: { screen: ScreenLeadersBoard },
//   // Settings: { screen: ScreenSettings },
//   // AddNetwork: { screen: ScreenAddNetwork },
//   // NotAMember: { screen: ScreenNotAMember },
//   //BottomTab: { screen: BottomTab }
// }, {
//   headerMode: 'none'
// });



// const NavigationContainer = DrawerNavigator({
//   NavMain: { screen: NavMain }
// }, {
//   contentComponent: props => <SideBar {...props} />,
//   // https://github.com/react-community/react-navigation/issues/3148#issuecomment-352778884
//   drawerOpenRoute: 'DrawerOpen',
//   drawerCloseRoute: 'DrawerClose',
//   drawerToggleRoute: 'DrawerToggle'
// });

// getStateForAction on the main navigator is executed every time we attempt to change screen
// - we check authorisation here block the action if authorisation fails (by returning null)
// When authorisation fails we redirect to the login action
const getStateForActionDefault = NavigationContainer.router.getStateForAction;
NavigationContainer.router.getStateForAction = (action, state) => {
  if (!auth.isNavigationPermitted(action.routeName)) {
    auth.handleNavigationAuthFailure(action.routeName, { successScreen: action.routeName });
    return null;
  }
  return getStateForActionDefault(action, state);
};


export default class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.handleOpenUrl = this.handleOpenUrl.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);

    this._retrieveData();
  }

  // componentDidMount() {
  //   this.reRenderSomething = this.props.navigation.addListener('didFocus', () => {
  //     this.checkPermission();
  //     this.messageListener();
  //   });
  // }

  // checkPermission = async () => {
  //   const enabled = await firebase.messaging().hasPermission();
  //   if (enabled) {
  //     this.getFcmToken();
  //   } else {
  //     this.requestPermission();
  //   }
  // }

  // getFcmToken = async () => {
  //   const fcmToken = await firebase.messaging().getToken();
  //   if (fcmToken) {
  //     this.props.FcmToken(fcmToken)
  //     //this.showAlert('Your Firebase Token is:', fcmToken);
  //   } else {
  //     this.props.FcmToken(null)
  //     //this.showAlert('Failed', 'No token received');
  //   }
  // }

  // requestPermission = async () => {
  //   try {
  //     await firebase.messaging().requestPermission();
  //     // User has authorised
  //   } catch (error) {
  //     // User has rejected permissions
  //   }
  // }

  // messageListener = async () => {
  //   this.notificationListener = firebase.notifications().onNotification((notification) => {
  //     console.log(notification);
  //     const { title, body, data } = notification;
  //     this.showAlert(title, data.body);
  //   });

  //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     console.log(notificationOpen);
  //     const { title, body } = notificationOpen.notification;
  //     console.log(title, body);
  //     //this.showAlert(title, body);
  //   });

  //   const notificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     const { title, body } = notificationOpen.notification;
  //     console.log(title, body);
  //     //this.showAlert(title, body);
  //   }

  //   this.messageListener = firebase.messaging().onMessage((message) => {
  //     console.log(JSON.stringify(message));
  //   });
  // }

  // showAlert = (title, message) => {
  //   Alert.alert(
  //     title,
  //     message,
  //     [
  //       { text: 'OK', onPress: () => console.log('OK Pressed') },
  //     ],
  //     { cancelable: false },
  //   );
  // }



  _retrieveData = async () => {
    try {
      if (this.props.login && this.props.login.login_details != null && this.props.login.login_details.hasValue()) {
        var login_details = this.props.login.login_details.getValue();
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + login_details.access_token
        setTimeout(function () {
          navigation.navigate('Home');
        })
      } else {
        this.props.navigation.navigate('Login');
      }
    } catch (error) {
    }
  };

  componentDidMount() {
    Linking.getInitialURL().then(url => this.handleOpenUrl(url));
    Linking.addEventListener('url', event => this.handleOpenUrl(event.url));
    this.props.navAppLoaded();
  }

  handleOpenUrl(urlString) {
    ////console.log('123', urlString)
    // When the app is opened via a URL this method is called with that URL
    if (urlString) {
      const urlData = url.parse(urlString, true);
      switch (urlData.pathname) {
        case '/app/loginreturn':
          if (urlData.query.token) {
            this.props.memberTokenLogin(urlData.query.token);
          }
          break;
      }
    }
  }

  // gets the current screen from navigation state
  getCurrentRouteName(navigationState) {
    if (!navigationState) {
      return null;
    }
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
      return this.getCurrentRouteName(route);
    }
    return route.routeName;
  }

  // onNavigationStateChange can be used for analytics
  onNavigationStateChange(prevState, currentState) {
    const currentScreen = this.getCurrentRouteName(currentState);
    const prevScreen = this.getCurrentRouteName(prevState);
    ////console.log("onNavigationStateChange", currentScreen, prevScreen)
    if (prevScreen !== currentScreen) {
      if (currentScreen == 'Login' && !auth.hasRole('authed')) {
        // We landed on the login page but we are already authed - go home
        navigation.navigate('Home');
      }
      // the line below uses the Google Analytics tracker
      // change the tracker here to use other Mobile analytics SDK.
      // //console.log('navigateTo: ' + currentScreen);
    }
  }

  render() {
    return (
      <NavigationContainer
        onNavigationStateChange={this.onNavigationStateChange}
        ref={navigatorRef => {
          //initialRouteName = 'Home'
          // Navigation service needs a ref to a navigation component in order to access the navigation functionality
          navigation.setContainer(navigatorRef);
          // Navigation action is not triggered for the first screen so we must check nav authorisation manually on initial app load
          auth.authNavigation('Home');
        }}
      />
    );
  }
}
