import LoadStatus from '../../lib/load-status';
import axios from '../axios';

const initState = (state) => {
    state = state ? { ...state } : {};
    state.category = state.category ? state.category : LoadStatus.createEmpty();
    state.banners = state.banners ? state.banners : LoadStatus.createEmpty();
    state.searchproduct = state.searchproduct ? state.searchproduct : LoadStatus.createEmpty();
    state.popularproducts = state.popularproducts ? state.popularproducts : LoadStatus.createEmpty();
    state.current_page = state.current_page ? state.current_page : 1;
    state.last_page = state.last_page ? state.last_page : 0;
    state.popular_current_page = state.popular_current_page ? state.popular_current_page : 0;
    state.popular_last_page = state.popular_last_page ? state.popular_last_page : 0;
    return state;
};

const reducer = (previousState, action) => {
    var state = previousState ? previousState : initState();
    switch (action.type) {
        case 'NAV_APP_LOADED':
            state = initState(previousState);
            break;
        case 'HOMECONTENT_GET_LIST_START':
            state = Object.assign({}, state, {
                category: LoadStatus.createLoading(),
            });
            break;
        case 'HOMECONTENT_GET_LIST_FINISH_BANNERS':
            state = Object.assign({}, state, {
                banners: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'HOMECONTENT_GET_LIST_FINISH_CATEGORIES':
            state = Object.assign({}, state, {
                category: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'HOMECONTENT_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                category: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'POPULARPRODUCTS_GET_LIST_START':
            state = Object.assign({}, state, {
                popularproducts: LoadStatus.createUpdating(state.popularproducts),
            });
            break;
        case 'POPULARPRODUCTS_GET_LIST_FINISH':
            var existingProduct = state.popularproducts.hasValue() ? state.popularproducts.getValue() : [];
            //alert(action.content.last_page)
            state = Object.assign({}, state, {
                popularproducts: LoadStatus.createDoneUpdating(existingProduct.concat(action.content.data)),
                popular_last_page: action.content.last_page,
                popular_current_page: action.content.current_page + 1,
            });
            break;
        case 'POPULARPRODUCTS_SET_PAGE':
            // alert(action.page)
            state = Object.assign({}, state, {
                popular_current_page: action.page,
            });
            break;
        case 'POPULARPRODUCTS_SET_DATA':
            // alert(action.page)
            state = Object.assign({}, state, {
                popularproducts: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'PRODUCTSTYPE_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                producttype: action.content
            });
            break;
        case 'POPULARPRODUCTS_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                popularproducts: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'POPULARPRODUCTSHOME_GET_LIST_START':
            state = Object.assign({}, state, {
                popularhomeproducts: LoadStatus.createLoading(),
            });
            break;
        case 'POPULARPRODUCTSHOME_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                popularhomeproducts: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'POPULARPRODUCTSHOME_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                popularhomeproducts: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'OFFERPRODUCTS_GET_LIST_START':
            state = Object.assign({}, state, {
                offerproducts: LoadStatus.createLoading(),
            });
            break;
        case 'OFFERPRODUCTS_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                offerproducts: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'OFFERPRODUCTS_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                offerproducts: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'NEWPRODUCTS_GET_LIST_START':
            state = Object.assign({}, state, {
                newproducts: LoadStatus.createLoading(),
            });
            break;
        case 'NEWPRODUCTS_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                newproducts: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'NEWPRODUCTS_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                newproducts: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'COUNTRY_GET_LIST_START':
            state = Object.assign({}, state, {
                country: LoadStatus.createLoading(),
            });
            break;
        case 'COUNTRY_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                country: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'COUNTRY_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                country: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'SEARCHPRODUCT_GET_LIST_START':
            state = Object.assign({}, state, {
                searchproduct: LoadStatus.createLoading(),
            });
            break;
        case 'SEARCHPRODUCT_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                searchproduct: LoadStatus.createDoneUpdating(action.content.data),
                last_page: action.content.last_page,
                current_page: action.content.current_page,
            });
            break;
        case 'SEARCHPRODUCT_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                searchproduct: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'SEARCHPRODUCTMORE_GET_LIST_START':
            state = Object.assign({}, state, {
                searchproduct: LoadStatus.createUpdating(state.searchproduct),
            });
            break;
        case 'SEARCHPRODUCTMORE_GET_LIST_FINISH':
            //console.log("callll-state", state)
            var existingProduct = state.searchproduct.hasValue() ? state.searchproduct.getValue() : [];
            //console.log("callll", existingProduct.length)
            state = Object.assign({}, state, {
                searchproduct: LoadStatus.createDoneUpdating(existingProduct.concat(action.content.data)),
                last_page: action.content.last_page,
                current_page: action.content.current_page,
            });
            break;
        case 'SEARCHPRODUCTMORE_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                searchproduct: LoadStatus.createErrorLoading(action.error)
            });
            break;
    }
    return state;
}
export default reducer;