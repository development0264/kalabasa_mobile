import axios from '../axios';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';


export const categoriesGetListStart = () => {
    return {
        type: 'CATEGORIES_GET_LIST_START',
    }
}

export const categoriesGetListFinish = (content) => {
    return {
        type: 'CATEGORIES_GET_LIST_FINISH',
        content
    }
}

export const categoriesGetListError = (error) => {
    return {
        type: 'CATEGORIES_GET_LIST_ERROR',
        error
    }
}

export const categoriesGetList = () => {
    return async (dispatch, getState) => {
        var state = getState();
        dispatch(categoriesGetListStart());
        try {
            var response = await axios.get('/categories_list');
        } catch (error) {
            dispatch(categoriesGetListError(error));
            apiErrorHandler(error, dispatch, getState);
            throw error;
        }
        var content = Array.isArray(response.data.category_list) ? response.data.category_list : [];
        dispatch(categoriesGetListFinish(content));
        return content;
    };
}

export const categorySetViewing = (content) => {
    return {
        type: 'CATEGORIES_SET_VIEWING',
        content
    }
}

export const subcategoriesSetData = (content) => {
    return {
        type: 'SUBCATEGORIES_SET_DATA',
        content
    }
}

export const subcategoriesSetPage = (page) => {
    return {
        type: 'SUBCATEGORIES_SET_PAGE',
        page
    }
}

export const subcategoriesGetListStart = () => {
    return {
        type: 'SUBCATEGORIES_GET_LIST_START',
    }
}

export const subcategoriesGetListFinish = (content) => {
    return {
        type: 'SUBCATEGORIES_GET_LIST_FINISH',
        content
    }
}

export const subcategoriesGetNoDataListFinish = (content) => {
    return {
        type: 'SUBCATEGORIES_GET_NODATA_LIST_FINISH',
        content
    }
}

export const subcategoriesGetListError = (error) => {
    return {
        type: 'SUBCATEGORIES_GET_LIST_ERROR',
        error
    }
}

export const subcategoriesGetList = (id) => {
    return async (dispatch, getState) => {
        var state = getState();
        var page = state.categories.cat_current_page > 1 ? state.categories.cat_current_page : 1;
        var userid = state.login.login_details.hasValue() ? state.login.login_details.getValue().id : null;
        //alert(userid)
        if (page == 1 || state.categories.cat_last_page >= page) {
            dispatch(subcategoriesGetListStart());
            try {
                var response = [];
                if (userid == null) {
                    response = await axios.get('/list-category-products/' + id + "?page=" + page);
                } else {
                    response = await axios.get('/list-category-products-bycountry/' + id + "/" + userid + "?page=" + page);
                }
            } catch (error) {
                //alert(JSON.stringify(error))
                dispatch(subcategoriesGetListError(error));
                apiErrorHandler(error, dispatch, getState);
                throw error;
            }
            var content = Array.isArray(response.data.products.data) ? response.data.products : [];
            //await dispatch(subcategoriesSetPage(content.current_page + 1))
            await dispatch(subcategoriesGetListFinish(content));
            return content;
        }
    };

    // var page = state.home.current_page >= 1 ? state.home.current_page + 1 : 1;
    // if (state.home.last_page > page) {
    //     dispatch(productGetListMoreStart(page));
    //     try {
    //         var response = await getProduct(text, page);
    //         //console.log(response.data.products)
    //     } catch (error) {
    //         dispatch(productGetListMoreError(error));
    //         apiErrorHandler(error, dispatch, getState);
    //         throw error;
    //     }

    //     var content = Array.isArray(response.data.products.data) ? response.data.products : [];
    //     dispatch(productGetListMoreFinish(content));
    //     return content;
    // }
}


