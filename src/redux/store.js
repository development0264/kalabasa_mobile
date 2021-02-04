import Config from 'react-native-config'
import url from 'url';
import { NativeModules } from 'react-native';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore, createTransform, persistReducer, persistCombineReducers } from 'redux-persist';
//import reduxPersistStorage from 'redux-persist/lib/storage';
import reduxStoreTransform from './store-transform';
import reducers from './reducers';
import * as services from './services';
import AsyncStorage from '@react-native-community/async-storage';

export default function configureStore() {
    var createStoreHandler = createStore;
    if (Config.REACTOTRON_ENABLE == 'TRUE') {
        require('reactotron-react-native');
        const Reactotron = require('reactotron-react-native').default;
        require('reactotron-redux');
        const reactotronRedux = require('reactotron-redux').reactotronRedux;
        const { hostname } = url.parse(NativeModules.SourceCode.scriptURL);
        Reactotron
            .configure({ host: 'localhost' }) // controls connection & communication settings
            .useReactNative() // add all built-in react native plugins
            .use(reactotronRedux())
            .connect();
        createStoreHandler = Reactotron.createStore;
        // For calls to console to appear in Reactotron UI app we have to replace console with Reactotron
        if (console) console = Reactotron;
        console.disableYellowBox = true;
    }

    const reducersPersisted = persistReducer({
        key: 'primary',
        debug: true,
        transforms: [reduxStoreTransform],
        storage: AsyncStorage
    }, combineReducers(reducers));


    const store = createStoreHandler(
        reducersPersisted,
        compose(
            applyMiddleware(thunkMiddleware), // lets us dispatch() functions
        )
    );

    const persistor = persistStore(store);
    //persistor.purge();

    // Inject store.getState into services so they can access reduxState
    Object.values(services).forEach(service => {
        if (service && !service.getReduxState) {
            service.getReduxState = store.getState;
        }
    });

    return { persistor, store };
}
