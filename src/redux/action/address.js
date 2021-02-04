import axios from '../axios';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';


export const addressGetListStart = () => {
    return {
        type: 'ADDRESS_GET_LIST_START',
    }
}

export const addressGetListFinish = (content) => {
    return {
        type: 'ADDRESS_GET_LIST_FINISH',
        content
    }
}

export const addressGetListError = (error) => {
    return {
        type: 'ADDRESS_GET_LIST_ERROR',
        error
    }
}

export const addressGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(addressGetListStart());
        try {
            var response = await axios.get('/addresses');
        } catch (error) {
            dispatch(addressGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.addresses) ? response.data.addresses : [];
        //console.log('content123', content)
        dispatch(addressGetListFinish(content));
        return content;
    };
}

export const addressSetViewing = (content) => {
    return {
        type: 'ADDRESS_SET_VIEWING',
        content
    }
}

export const addaddressStart = () => {
    return {
        type: 'ADD_ADDRESS_START',
    }
}

export const addaddressFinish = (content) => {
    return {
        type: 'ADD_ADDRESS_FINISH',
        content
    }
}

export const addaddressError = (error) => {
    return {
        type: 'ADD_ADDRESS_ERROR',
        error
    }
}

export const saveaddress = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(addaddressStart());
        try {
            // alert(JSON.stringify(data))
            var response = await axios.post('/Addaddress', data);
            //console.log('response', response)
        } catch (error) {
            dispatch(addaddressError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        dispatch(addaddressFinish(response.data));
        dispatch(addressGetList());
        return response.data;
    };
}

export const updateaddressStart = () => {
    return {
        type: 'UPDATE_ADDRESS_START',
    }
}

export const updateaddressFinish = (content) => {
    return {
        type: 'UPDATE_ADDRESS_FINISH',
        content
    }
}

export const updateaddressError = (error) => {
    return {
        type: 'UPDATE_ADDRESS_ERROR',
        error
    }
}

export const updateaddress = (data) => {
    //console.log(data, data.id)
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(updateaddressStart());
        try {
            var response = await axios.post('/Editaddress', data);
        } catch (error) {

            dispatch(updateaddressError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
        dispatch(updateaddressFinish(response.data));
        dispatch(addressGetList());
        return response.data;
    };
}
export const deleteaddressStart = () => {
    return {
        type: 'DELETE_ADDRESS_START',
    }
}

export const deleteaddressFinish = (content) => {
    return {
        type: 'DELETE_ADDRESS_FINISH',
        content
    }
}

export const deleteaddressError = (error) => {
    return {
        type: 'DELETE_ADDRESS_ERROR',
        error
    }
}

export const deleteaddress = (id) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(deleteaddressStart());
        try {
            var response = await axios.delete('/addresses/' + id + '');
        } catch (error) {
            //console.log(error)
            dispatch(deleteaddressError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        dispatch(deleteaddressFinish(response.data));
        dispatch(addressGetList());
        return response.data;
    };
}
