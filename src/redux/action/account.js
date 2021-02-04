import axios from '../axios';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';

export const accountGetStart = () => {
    return {
        type: 'ACCOUNT_GET_START',
    }
}

export const accountGetFinish = (content) => {
    return {
        type: 'ACCOUNT_GET_FINISH',
        content
    }
}

export const accountGetError = (error) => {
    return {
        type: 'ACCOUNT_GET_ERROR',
        error
    }
}

export const accountGet = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(accountGetStart());
        try {
            var response = await axios.get('/auth/customer');
        } catch (error) {
            dispatch(accountGetError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = response.data.customer ? response.data.customer : {};
        console.log("content", content)
        dispatch(accountGetFinish(content));
        return content;
    };
}

export const orderGetStart = () => {
    return {
        type: 'ORDER_GET_START',
    }
}

export const orderGetFinish = (content) => {
    return {
        type: 'ORDER_GET_FINISH',
        content
    }
}

export const orderGetError = (error) => {
    return {
        type: 'ORDER_GET_ERROR',
        error
    }
}

export const orederGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(orderGetStart());
        try {
            var response = await axios.get('/orders_history');
            //console.log("response", response.data.orders)
        } catch (error) {
            dispatch(orderGetError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.orders) ? response.data.orders : [];
        //console.log("content", content)
        dispatch(orderGetFinish(content));
        return content;
    };
}

export const orderByIdGetStart = () => {
    return {
        type: 'ORDERBYID_GET_START',
    }
}

export const orderByIdGetFinish = (content) => {
    return {
        type: 'ORDERBYID_GET_FINISH',
        content
    }
}

export const orderstatusGetFinish = (isoredersuccess) => {
    return {
        type: 'ORDERSTATUS_GET_FINISH',
        isoredersuccess
    }
}

export const orderByIdGetError = (error) => {
    return {
        type: 'ORDERBYID_GET_ERROR',
        error
    }
}

export const orederByidGetList = (id) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(orderByIdGetStart());
        try {
            var response = await axios.get('/orders/' + id);

        } catch (error) {
            dispatch(orderByIdGetError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = response.data.order ? response.data.order : {};
        dispatch(orderByIdGetFinish(content));
        return content;
    };
}

export const orderdetailsSetViewing = (content) => {
    return {
        type: 'ORDERDETAILS_SET_VIEWING',
        content
    }
}

export const notificationGetStart = () => {
    return {
        type: 'NOTIFICATION_GET_START',
    }
}

export const notificationGetFinish = (content) => {
    return {
        type: 'NOTIFICATION_GET_FINISH',
        content
    }
}

export const notificationGetError = (error) => {
    return {
        type: 'NOTIFICATION_GET_ERROR',
        error
    }
}

export const notificationGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        //dispatch(notificationGetStart());
        try {
            var response = await axios.get('/notifications');
            console.log("response", response.data.data)
        } catch (error) {
            dispatch(notificationGetError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        //console.log("content", content)
        dispatch(notificationGetFinish(content));
        return content;
    };
}

export const notificationDeleteStart = () => {
    return {
        type: 'NOTIFICATION_DELETE_START',
    }
}

export const notificationDeleteFinish = () => {
    return {
        type: 'NOTIFICATION_DELETE_FINISH'
    }
}



export const notificationDeleteError = (error) => {
    return {
        type: 'NOTIFICATION_DELETE_ERROR',
        error
    }
}

export const notificationDelete = (id) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(notificationDeleteStart());
        try {
            const data = new FormData();
            data.append("id", id)
            var response = await axios.post('/auth/deleteNotification', data);
            console.log("response", response.data.data)
        } catch (error) {
            dispatch(notificationDeleteError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        //var content = Array.isArray(response.data.data) ? response.data.data : [];
        //console.log("content", content)
        await dispatch(notificationDeleteFinish());
        await dispatch(notificationGetList());
        return content;
    };
}

export const requestmessagesGetStart = () => {
    return {
        type: 'REQUESTMESSAGES_GET_START',
    }
}

export const requestmessagesGetFinish = (content) => {
    return {
        type: 'REQUESTMESSAGES_GET_FINISH',
        content
    }
}



export const requestmessagesGetError = (error) => {
    return {
        type: 'REQUESTMESSAGES_GET_ERROR',
        error
    }
}

export const requestmessagesGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(requestmessagesGetStart());
        try {
            var response = await axios.get('/order/orderRequest/' + state.account.orderdetails.id);
        } catch (error) {
            dispatch(requestmessagesGetError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = response.data.data ? response.data.data : null;
        //console.log("content", content)
        dispatch(requestmessagesGetFinish(content));
        return content;
    };
}

export const requestmessagesInsertStart = () => {
    return {
        type: 'REQUESTMESSAGES_INSERT_START',
    }
}

export const requestmessagesInsertFinish = (content) => {
    return {
        type: 'REQUESTMESSAGES_INSERT_FINISH',
        content
    }
}

export const requestmessagesInsertError = (error) => {
    return {
        type: 'REQUESTMESSAGES_INSERT_ERROR',
        error
    }
}

export const requestmessagesInsert = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(requestmessagesInsertStart());
        try {
            var response = await axios.post('/order/orderRequestinsert', data);
        } catch (error) {
            dispatch(requestmessagesInsertError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(requestmessagesInsertFinish(content));
        await dispatch(requestmessagesGetList())
        return content;
    };
}

export const orderstatusGetStart = () => {
    return {
        type: 'ORDERSTATUSDATA_GET_START',
    }
}

export const orderstatusdataGetFinish = (content) => {
    return {
        type: 'ORDERSTATUSDATA_GET_FINISH',
        content
    }
}


export const orderstatusGetError = (error) => {
    return {
        type: 'ORDERSTATUSDATA_GET_ERROR',
        error
    }
}

export const orederstatus = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(orderstatusGetStart());
        try {
            var response = await axios.get('/OrderStatusList');
        } catch (error) {
            dispatch(orderstatusGetError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(orderstatusdataGetFinish(content));
        return content;
    };
}


export const customerupdateStart = () => {
    return {
        type: 'CUSTOMER_UPDATE_START',
    }
}

export const customerupdateFinish = (content) => {
    return {
        type: 'CUSTOMER_UPDATE_FINISH',
        content
    }
}

export const customerupdateError = (error) => {
    return {
        type: 'CUSTOMER_UPDATE_ERROR',
        error
    }
}

export const customerupdate = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(customerupdateStart());
        try {
            var response = await axios.post('/auth/updateProfile', data);
        } catch (error) {
            dispatch(customerupdateError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(customerupdateFinish(content));
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        await dispatch(accountGet());
        return content;
    };
}


export const notificationReadStart = () => {
    return {
        type: 'NOTIFICATION_READ_START',
    }
}

export const notificationReadFinish = (content) => {
    return {
        type: 'NOTIFICATION_READ_FINISH',
        content
    }
}

export const notificationReadError = (error) => {
    return {
        type: 'NOTIFICATION_READ_ERROR',
        error
    }
}

export const notificationRead = (id) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(notificationReadStart());
        try {
            const data = new FormData();
            data.append("id", id)
            var response = await axios.post('/auth/readNotification', data);
            console.log("response", response.data)
        } catch (error) {
            dispatch(notificationReadError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        // var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        //await dispatch(notificationReadFinish(content));      
        return null;
    };
}

export const unreadNotificationStart = () => {
    return {
        type: 'UNREADNOTIFICATION_GET_START',
    }
}

export const unreadNotificationFinish = (content) => {
    return {
        type: 'UNREADNOTIFICATION_GET_FINISH',
        content
    }
}

export const unreadNotificationError = (error) => {
    return {
        type: 'AUNREADNOTIFICATION_GET_ERROR',
        error
    }
}

export const unreadNotification = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(unreadNotificationStart());
        try {
            var response = await axios.get('/auth/unreadNotification');
            //alert(JSON.stringify(response.data.data))
        } catch (error) {
            dispatch(unreadNotificationError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = response.data.data.length > 0 ? response.data.data.length : 0;
        //alert(content)
        await dispatch(unreadNotificationFinish(content));
        return content;
    };
}