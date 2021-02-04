import LoadStatus from '../../lib/load-status';
import axios from '../axios';

const initState = (state) => {
    state = state ? { ...state } : {};
    state.category = state.category ? state.category : LoadStatus.createEmpty();
    state.cat_current_page = state.cat_current_page ? state.cat_current_page : 0;
    state.cat_last_page = state.cat_last_page ? state.cat_last_page : 0;
    state.subcategory = state.subcategory ? state.subcategory : LoadStatus.createEmpty();
    return state;
};

const reducer = (previousState, action) => {
    var state = previousState ? previousState : initState();
    switch (action.type) {
        case 'NAV_APP_LOADED':
            state = initState(previousState);
            break;
        case 'CATEGORIES_GET_LIST_START':
            state = Object.assign({}, state, {
                category: LoadStatus.createUpdating(state.category),
            });
            break;
        case 'CATEGORIES_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                category: LoadStatus.createDoneUpdating(action.content)
            });
            break;
        case 'CATEGORIES_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                category: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'CATEGORIES_SET_VIEWING':
            state = Object.assign({}, state, {
                viewcategory: action.content,
            });
            break;
        case 'SUBCATEGORIES_GET_LIST_START':
            state = Object.assign({}, state, {
                subcategory: LoadStatus.createUpdating(state.subcategory),
            });
            break;
        case 'SUBCATEGORIES_SET_PAGE':
            // alert(action.page)
            state = Object.assign({}, state, {
                cat_current_page: action.page,
            });
            break;
        case 'SUBCATEGORIES_SET_DATA':
            // alert(action.page)
            state = Object.assign({}, state, {
                subcategory: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'SUBCATEGORIES_GET_LIST_FINISH':
            var existingProduct = state.subcategory.hasValue() ? state.subcategory.getValue() : [];
            //alert(existingProduct.length)
            state = Object.assign({}, state, {
                subcategory: LoadStatus.createDoneUpdating(existingProduct.concat(action.content.data)),
                cat_last_page: action.content.last_page,
                cat_current_page: action.content.current_page + 1,
            });
            break;
        case 'SUBCATEGORIES_GET_NODATA_LIST_FINISH':
            var existingProduct = state.subcategory.hasValue() ? state.subcategory.getValue() : [];
            //alert(existingProduct.length)
            state = Object.assign({}, state, {
                subcategory: LoadStatus.createDoneLoading([]),
            });
            break;
        case 'SUBCATEGORIES_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                subcategory: LoadStatus.createErrorLoading(action.error)
            });
            break;
    }
    return state;
}
export default reducer;
