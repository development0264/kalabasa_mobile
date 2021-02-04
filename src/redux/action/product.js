import axios from '../axios';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';
import { subcategoriesGetListFinish } from './categories';

export const productGetListStart = () => {
    return {
        type: 'PRODUCT_GET_LIST_START',
    }
}

export const productetListFinish = (content) => {
    return {
        type: 'PRODUCT_GET_LIST_FINISH',
        content
    }
}

export const productGetListError = (error) => {
    return {
        type: 'PRODUCT_GET_LIST_ERROR',
        error
    }
}

export const productgetType = (content) => {
    return {
        type: 'PRODUCT_TYPE',
        content
    }
}

export const productGetList = (id, type) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(productGetListStart());
        try {
            var response = null
            if (type == "Groupon") {
                response = await axios.get('/group_show/' + id + '');
            } else {
                response = await axios.get('/product_show/' + id + '');


            }
        } catch (error) {
            dispatch(productGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        // alert(JSON.stringify(response.data.product))
        if (response.data.product != null) {
            var content = response.data.product;
            await dispatch(productgetType(type));
            await dispatch(productetListFinish(content));
            await dispatch(productgetType(type));
            await dispatch(relatedcategoryListFinsih([]));
            await dispatch(subcategoriesGetListFinish([]));
            return content;
        } else {
            dispatch({ type: 'TOAST_SHOW', options: { type: 'warning', text: response.data.message } });
            return null;
        }
    };
}

export const favoriteproductetListStart = (content) => {
    return {
        type: 'FAVORITEPRODUCT_GET_LIST_START',
        content
    }
}

export const favoriteproductGetListError = (error) => {
    return {
        type: 'FAVORITEPRODUCT_GET_LIST_ERROR',
        error
    }
}

export const favoriteproductgetListFinsih = (content) => {
    return {
        type: 'FAVORITEPRODUCT_GET_LIST_FINISH',
        content
    }
}

export const favoriteproductGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(favoriteproductetListStart());
        try {
            var response = await axios.get('/product/like');
        } catch (error) {
            dispatch(favoriteproductGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = response.data.data;
        dispatch(favoriteproductgetListFinsih(content));
        return content;
    };
}


export const favoriteproductetAddStart = () => {
    return {
        type: 'FAVORITEPRODUCT_ADD_START',
    }
}

export const favoriteproductGetAddError = (error) => {
    return {
        type: 'FAVORITEPRODUCT_ADD_ERROR',
        error
    }
}

export const favoriteproductgetAddFinsih = (content) => {
    return {
        type: 'FAVORITEPRODUCT_ADD_FINISH',
        content
    }
}

export const addfavourite = (data) => {
    return async (dispatch, getState) => {
        try {
            var response = await axios.post('/product/likeinsert', data);
            console.log("response", response)
        } catch (error) {
            dispatch(favoriteproductGetAddError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = response.data.data;
        return content;
    };
}

export const relatedcategoryListStart = () => {
    return {
        type: 'RELATEDCATEGORY_GET_LIST_START',
    }
}

export const relatedcategoryListError = (error) => {
    return {
        type: 'RELATEDCATEGORY_GET_LIST_ERROR',
        error
    }
}

export const relatedcategoryListFinsih = (content) => {
    return {
        type: 'RELATEDCATEGORY_GET_LIST_FINISH',
        content
    }
}

export const relatedcategoryGetList = (id) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(relatedcategoryListStart());
        try {
            var response = await axios.get('/product/latestproduct');
            console.log("response", response.data)
        } catch (error) {
            dispatch(relatedcategoryListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.product) ? response.data.product : [];
        dispatch(relatedcategoryListFinsih(content));
        return content;
    };
}

export const grouponaddcart = (message, type) => {
    return async (dispatch) => {
        dispatch({ type: 'TOAST_SHOW', options: { type: type, text: message } });
    };
}


export const grouponListStart = () => {
    return {
        type: 'GROUPON_GET_LIST_START',
    }
}

export const grouponListError = (error) => {
    return {
        type: 'GROUPON_GET_LIST_ERROR',
        error
    }
}

export const grouponListFinsih = (content) => {
    return {
        type: 'GROUPON_GET_LIST_FINISH',
        content
    }
}

export const grouponGetList = (data) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(grouponListStart());
        try {
            //alert(id)
            var response = await axios.post('/getDataGroup', data);
            //alert(JSON.stringify(response.data))
        } catch (error) {
            dispatch(grouponListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        //alert(response.data.products.data.length)
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(grouponListFinsih(content));
        return content;
    };
}