import axios from '../axios';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';
import { orederByidGetList, orderstatusGetFinish } from './account';
import { AsyncStorage } from 'react-native';

export const cartGetListStart = () => {
    return {
        type: 'CART_GET_LIST_START',
    }
}

export const cartGetListFinish = (content) => {
    return {
        type: 'CART_GET_LIST_FINISH',
        content
    }
}

export const cartproductFinish = (content) => {
    return {
        type: 'CART_TOTAL_PRODUCT_FINISH',
        content
    }
}

export const cartGetListError = (error) => {
    return {
        type: 'CART_GET_LIST_ERROR',
        error
    }
}

export const cartGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(cartGetListStart());
        try {
            var response = await axios.get('/carts');
            //console.log(response.data.cart)
        } catch (error) {
            dispatch(cartGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.cart.items) ? response.data.cart.items : [];
        dispatch(cartGetListFinish(content));
        var total_products = response.data.cart.total_products;
        dispatch(cartproductFinish(total_products));
        return content;
    };
}


export const caraddStart = () => {
    return {
        type: 'CART_ADD_LIST_START',
    }
}

export const caraddFinish = (content) => {
    return {
        type: 'CART_ADD_LIST_FINISH',
        content
    }
}

export const caraddError = (error) => {
    return {
        type: 'CART_ADD_LIST_ERROR',
        error
    }
}

export const cartadd = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(caraddStart());
        try {
            //console.log("data", data)
            var response = await axios.post('/carts', data);
            //console.log("response", response)
        } catch (error) {
            //console.log("error", error)
            dispatch(caraddError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        var content = Array.isArray(response.data) ? response.data : [];
        dispatch(caraddFinish(content));
        dispatch(cartGetList());
        return content;
    };
}

export const cartupdateStart = () => {
    return {
        type: 'CART_UPDATE_START',
    }
}

export const cartupdateFinish = (content) => {
    return {
        type: 'CART_UPDATE_FINISH',
        content
    }
}

export const cartupdateError = (error) => {
    return {
        type: 'CART_UPDATE_ERROR',
        error
    }
}

export const cartupdate = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(cartupdateStart());
        try {
            var response = await axios.post('/carts/add', data);
            //console.log("response", response)
        } catch (error) {
            //console.log("error", error)
            dispatch(cartupdateError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        var content = Array.isArray(response.data) ? response.data : [];
        dispatch(cartupdateFinish(content));
        await dispatch(cartGetList());
        return content;
    };
}

export const cartremoveStart = () => {
    return {
        type: 'CART_REMOVE_START',
    }
}

export const cartremoveFinish = (content) => {
    return {
        type: 'CART_REMOVE_FINISH',
        content
    }
}

export const cartremoveError = (error) => {
    return {
        type: 'CART_REMOVE_ERROR',
        error
    }
}

export const removecart = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(cartremoveStart());
        try {
            var response = await axios.post('/carts/remove', data);
            //console.log("response", response)
        } catch (error) {
            //console.log("error", error)
            dispatch(cartremoveError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        var content = Array.isArray(response.data) ? response.data : [];
        dispatch(cartremoveFinish(content));
        await dispatch(cartGetList());
        return content;
    };
}

export const shippingsGetListStart = (content) => {
    return {
        type: 'SHIPPINGS_GET_LIST_START',
        content
    }
}

export const shippingsproductFinish = (content) => {
    return {
        type: 'SHIPPINGS_GET_LIST_FINISH',
        content
    }
}

export const shippingsGetListError = (error) => {
    return {
        type: 'SHIPPINGS__GET_LIST_ERROR',
        error
    }
}

export const shippingsGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(shippingsGetListStart());
        try {
            var response = await axios.get('/shippings');
            //console.log(response.data.couriers)
        } catch (error) {
            dispatch(shippingsGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.couriers) ? response.data.couriers : [];
        dispatch(shippingsproductFinish(content));
        return content;
    };
}

export const saveordersStart = () => {
    return {
        type: 'SAVEORDER_START',
    }
}

export const saveordersFinish = (content) => {
    return {
        type: 'SAVEORDER_FINISH',
        content
    }
}

export const saveordersError = (error) => {
    return {
        type: 'SAVEORDER_ERROR',
        error
    }
}

export const saveorders = (data, payment) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(saveordersStart());
        try {
            var response = await axios.post('/order/order_store', data);
            // console.log("order_store", JSON.stringify(response.data.order))
        } catch (error) {
            alert(JSON.stringify(error))
            // console.log(JSON.stringify(error))
            dispatch(saveordersError(error));
            dispatch(orderstatusGetFinish(false));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        if (response.data.status == "success" && data.payment_method == "card payment") {
            payment["order_reference"] = response.data.order.reference
            payment["order_id"] = response.data.order.id;
            var content = [];
            var content = response.data.order ? response.data.order : [];
            await dispatch(orderpayment(payment));
            await dispatch(orederByidGetList(response.data.order.id));
            await dispatch(orderstatusGetFinish(true));
            await dispatch(saveordersFinish(content));
            await AsyncStorage.setItem('groupon_cart', "");
            return content;
        }
        else if (response.data.status == "success") {
            var content = [];
            var content = response.data.order ? response.data.order : [];
            await dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
            await dispatch(orederByidGetList(response.data.order.id));
            await dispatch(orderstatusGetFinish(true));
            await dispatch(saveordersFinish(content));
            await AsyncStorage.setItem('groupon_cart', "");
            return content;
        } else {
            var content = [];
            dispatch({ type: 'TOAST_SHOW', options: { type: 'danger', text: response.data.message } });
            await dispatch(orderstatusGetFinish(false));
            return content;
        }
    };
}

export const paymentStart = () => {
    return {
        type: 'PAYMENT_START',
    }
}

export const paymentFinish = () => {
    return {
        type: 'PAYMENT_FINISH',
    }
}

export const paymentError = (error) => {
    return {
        type: 'PAYMENT_ERROR',
        error
    }
}

export const orderpayment = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(paymentStart());
        try {
            var response = await axios.post('/payments', data);
        } catch (error) {
            alert(JSON.stringify(error))
            dispatch(paymentError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        dispatch(paymentFinish());
        return [];
    };
}