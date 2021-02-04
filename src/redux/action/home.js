import axios from '../axios';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';

export const homecontentGetListStart = () => {
    return {
        type: 'HOMECONTENT_GET_LIST_START',
    }
}

export const homecontentGetListFinishbanner = (content) => {
    return {
        type: 'HOMECONTENT_GET_LIST_FINISH_BANNERS',
        content
    }
}

export const homecontentGetListFinishcategories = (content) => {
    return {
        type: 'HOMECONTENT_GET_LIST_FINISH_CATEGORIES',
        content
    }
}

export const homecontentGetListError = (error) => {
    return {
        type: 'HOMECONTENT_GET_LIST_ERROR',
        error
    }
}

export const homecontentGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(homecontentGetListStart());
        try {
            var response = await axios.get('/home-content');
        } catch (error) {
            dispatch(homecontentGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.banners) ? response.data.banners : [];
        dispatch(homecontentGetListFinishbanner(content));
        var content = Array.isArray(response.data.categories) ? response.data.categories : [];
        dispatch(homecontentGetListFinishcategories(content));
        return content;
    };
}

export const popularproductshomeGetListStart = (content) => {
    return {
        type: 'POPULARPRODUCTSHOME_GET_LIST_START',
    }
}

export const popularproductshomeGetListFinish = (content) => {
    return {
        type: 'POPULARPRODUCTSHOME_GET_LIST_FINISH',
        content
    }
}

export const popularproductshomeGetListError = (error) => {
    return {
        type: 'POPULARPRODUCTSHOME_GET_LIST_ERROR',
        error
    }
}

export const popularproducts = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(popularproductshomeGetListStart());
        try {
            var response = await axios.get('/popular-products?count=10');
        } catch (error) {
            dispatch(popularproductshomeGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.products) ? response.data.products : [];
        dispatch(popularproductshomeGetListFinish(content));
        return content;
    };
}

export const popularproductsGetListStart = (content) => {
    return {
        type: 'POPULARPRODUCTS_GET_LIST_START',
    }
}

export const popularproductsGetListFinish = (content) => {
    return {
        type: 'POPULARPRODUCTS_GET_LIST_FINISH',
        content
    }
}

export const productstypeGetListFinish = (content) => {
    return {
        type: 'PRODUCTSTYPE_GET_LIST_FINISH',
        content
    }
}

export const popularproductsGetListError = (error) => {
    return {
        type: 'POPULARPRODUCTS_GET_LIST_ERROR',
        error
    }
}

export const popularproductssetListPage = (page) => {
    return {
        type: 'POPULARPRODUCTS_SET_PAGE',
        page
    }
}

export const popularproductSetData = (content) => {
    return {
        type: 'POPULARPRODUCTS_SET_DATA',
        content
    }
}

export const popularproductsAll = (type) => {
    return async (dispatch, getState) => {
        var state = getState();
        var page = state.home.popular_current_page > 1 ? state.home.popular_current_page : 1;
        //alert(state.home.popular_last_page)

        if (page == 1 || state.home.popular_last_page >= page) {
            dispatch(popularproductsGetListStart());
            try {
                var response = [];
                var response = await axios.get('/new-popular-products?count=' + page);
            } catch (error) {
                dispatch(popularproductsGetListError(error));
                apiErrorHandler(error, dispatch, getState);
                throw error;
            }
            var content = Array.isArray(response.data.products.data) ? response.data.products : [];
            dispatch(popularproductsGetListFinish(content));
            await dispatch(productstypeGetListFinish(type));
            return content;
        }
    };
}

export const newproductsAll = (type) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(popularproductsGetListStart());
        try {
            var response = await axios.get('/new-products');
        } catch (error) {
            dispatch(popularproductsGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.products) ? response.data.products : [];
        content["data"] = content
        dispatch(popularproductsGetListFinish(content));
        await dispatch(productstypeGetListFinish(type));
        return content;
    };
}

export const offerproductsAll = (data, type) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(popularproductsGetListStart());
        try {
            var response = await axios.post('/offers', data);
        } catch (error) {
            dispatch(popularproductsGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(popularproductsGetListFinish(content));
        await dispatch(productstypeGetListFinish(type));
        return content;
    };
}

export const offerproductsGetListStart = (content) => {
    return {
        type: 'OFFERPRODUCTS_GET_LIST_START',
    }
}

export const offerproductsGetListFinish = (content) => {
    return {
        type: 'OFFERPRODUCTS_GET_LIST_FINISH',
        content
    }
}

export const offerproductsGetListError = (error) => {
    return {
        type: 'OFFERPRODUCTS_GET_LIST_ERROR',
        error
    }
}




export const offerproducts = (data, type) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(offerproductsGetListStart());
        try {
            var response = await axios.post('/offers', data);
        } catch (error) {
            dispatch(offerproductsGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(offerproductsGetListFinish(content));
        return content;
    };
}


export const newproductsGetListStart = (content) => {
    return {
        type: 'NEWPRODUCTS_GET_LIST_START',
    }
}

export const newproductsGetListFinish = (content) => {
    return {
        type: 'NEWPRODUCTS_GET_LIST_FINISH',
        content
    }
}

export const newproductsGetListError = (error) => {
    return {
        type: 'NEWPRODUCTS_GET_LIST_ERROR',
        error
    }
}

export const newproducts = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(newproductsGetListStart());
        try {
            var response = await axios.get('/new-products?count=10');
        } catch (error) {
            dispatch(newproductsGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.products) ? response.data.products : [];
        //console.log("content", content)
        dispatch(newproductsGetListFinish(content));
        return content;
    };
}

export const countryGetListStart = (content) => {
    return {
        type: 'COUNTRY_GET_LIST_START',
    }
}

export const countryGetListFinish = (content) => {
    return {
        type: 'COUNTRY_GET_LIST_FINISH',
        content
    }
}

export const countryGetListError = (error) => {
    return {
        type: 'COUNTRY_GET_LIST_ERROR',
        error
    }
}

export const country = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(countryGetListStart());
        try {
            var response = await axios.get('/country');
        } catch (error) {
            dispatch(countryGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.data) ? response.data.data : [];
        dispatch(countryGetListFinish(content));
        return content;
    };
}

export const searchproductGetListStart = (content) => {
    return {
        type: 'SEARCHPRODUCT_GET_LIST_START',
    }
}

export const searchproductGetListFinish = (content) => {
    return {
        type: 'SEARCHPRODUCT_GET_LIST_FINISH',
        content
    }
}

export const searchproductGetListError = (error) => {
    return {
        type: 'SEARCHPRODUCT_GET_LIST_ERROR',
        error
    }
}

const getProduct = async (text, page) => {
    //console.log("vgjkdfgdfk", text, page)
    return axios.get("/search-products?search_key=" + text + "&page=" + page + "");
}

export const searchproduct = (text) => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(searchproductGetListStart());
        try {
            var response = await getProduct(text, 1);
        } catch (error) {
            dispatch(searchproductGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.products.data) ? response.data.products : [];
        dispatch(searchproductGetListFinish(content));
        return content;
    };
}

export const productGetListMoreStart = (page) => {
    return {
        type: 'SEARCHPRODUCTMORE_GET_LIST_START',
        page
    }
}

export const productGetListMoreFinish = (content) => {
    return {
        type: 'SEARCHPRODUCTMORE_GET_LIST_FINISH',
        content
    }
}

export const productGetListMoreError = (error) => {
    return {
        type: 'SEARCHPRODUCTMORE_GET_LIST_ERROR',
        error
    }
}

export const productGetListMore = (text) => {
    return async (dispatch, getState) => {
        var state = getState();

        //console.log("78978979879797", state.home.current_page, state.home.last_page)
        var page = state.home.current_page >= 1 ? state.home.current_page + 1 : 1;
        if (state.home.last_page > page) {
            dispatch(productGetListMoreStart(page));
            try {
                var response = await getProduct(text, page);
                //console.log(response.data.products)
            } catch (error) {
                dispatch(productGetListMoreError(error));
                apiErrorHandler(error, dispatch, getState);
                throw error;
            }

            var content = Array.isArray(response.data.products.data) ? response.data.products : [];
            dispatch(productGetListMoreFinish(content));
            return content;
        }
    };
}
