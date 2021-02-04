import LoadStatus from '../../lib/load-status';
import { navigation } from '../services';
import axios from '../axios';

const initState = (state) => {
    state = state ? { ...state } : {};
    state.cart = state.cart ? state.cart : LoadStatus.createEmpty();
    return state;
};

const reducer = (previousState, action) => {
    var state = previousState ? previousState : initState();
    switch (action.type) {
        case 'NAV_APP_LOADED':
            state = initState(previousState);
            break;
        case 'CART_GET_LIST_START':
            state = Object.assign({}, state, {
                cart: LoadStatus.createLoading(),
            });
            break;
        case 'CART_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                cart: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'CART_TOTAL_PRODUCT_FINISH':
            state = Object.assign({}, state, {
                total_products: action.content
            });
            break;
        case 'CART_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                cart: LoadStatus.createErrorLoading(action.error)
            });
        case 'CART_ADD_LIST_START':
            state = Object.assign({}, state, {
                cart: LoadStatus.createLoading(),
            });
            break;
        case 'CART_ADD_LIST_FINISH':
            state = Object.assign({}, state, {
                cart: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'CART_ADD_LIST_ERROR':
            state = Object.assign({}, state, {
                cart: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'CART_UPDATE_START':
            state = Object.assign({}, state, {
                cartupdate: LoadStatus.createLoading(),
            });
            break;
        case 'CART_UPDATE_FINISH':
            state = Object.assign({}, state, {
                cartupdate: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'CART_UPDATE_ERROR':
            state = Object.assign({}, state, {
                cartupdate: LoadStatus.createErrorLoading(action.error)
            });
            break
        case 'CART_REMOVE_START':
            state = Object.assign({}, state, {
                cartremove: LoadStatus.createLoading(),
            });
            break;
        case 'CART_REMOVE_FINISH':
            state = Object.assign({}, state, {
                cartremove: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'CART_REMOVE_ERROR':
            state = Object.assign({}, state, {
                cartremove: LoadStatus.createErrorLoading(action.error)
            });
            break
        case 'SHIPPINGS_GET_LIST_START':
            state = Object.assign({}, state, {
                couriers: LoadStatus.createLoading(),
            });
            break;
        case 'SHIPPINGS_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                couriers: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'SHIPPINGS__GET_LIST_ERROR':
            state = Object.assign({}, state, {
                couriers: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'SAVEORDER_START':
            state = Object.assign({}, state, {
                couriers: LoadStatus.createLoading(),
            });
            break;
        case 'SAVEORDER_FINISH':
            state = Object.assign({}, state, {
                couriers: LoadStatus.createDoneLoading(action.content),
                cart: LoadStatus.createEmpty()
            });
            break;
        case 'SAVEORDER_ERROR':
            state = Object.assign({}, state, {
                couriers: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'PAYMENT_START':
            break;
        case 'PAYMENT_FINISH':
            state = Object.assign({}, state, {
                cart: LoadStatus.createEmpty()
            });
            break;
        case 'PAYMENT_ERROR':
            state = Object.assign({}, state, {
                orderpayment: LoadStatus.createErrorLoading(action.error)
            });
            break;

    }
    return state;
}
export default reducer;