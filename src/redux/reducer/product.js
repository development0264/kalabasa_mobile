import LoadStatus from '../../lib/load-status';
import axios from '../axios';

const initState = (state) => {
    state = state ? { ...state } : {};
    state.realtedcategory = state.realtedcategory ? state.realtedcategory : LoadStatus.createEmpty();
    state.product = state.product ? state.product : LoadStatus.createEmpty();
    state.favouriteproduct = state.favouriteproduct ? state.favouriteproduct : LoadStatus.createEmpty();
    state.grouponproduct = state.grouponproduct ? state.grouponproduct : LoadStatus.createEmpty();
    return state;
};

const reducer = (previousState, action) => {
    var state = previousState ? previousState : initState();
    switch (action.type) {
        case 'NAV_APP_LOADED':
            state = initState(previousState);
            break;
        case 'PRODUCT_GET_LIST_START':
            state = Object.assign({}, state, {
                product: LoadStatus.createLoading(),
            });
            break;
        case 'PRODUCT_GET_LIST_FINISH':
            //console.log('PRODUCT_GET_LIST_FINISH', action.content)
            state = Object.assign({}, state, {
                product: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'PRODUCT_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                product: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'PRODUCT_TYPE':
            state = Object.assign({}, state, {
                productType: action.content
            });
            break;
        case 'FAVORITEPRODUCT_GET_LIST_START':
            //console.log('PRODUCT_GET_LIST_FINISH', action.content)
            state = Object.assign({}, state, {
                favouriteproduct: LoadStatus.createLoading(),
            });
            break;
        case 'FAVORITEPRODUCT_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                favouriteproduct: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'FAVORITEPRODUCT_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                favouriteproduct: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'RELATEDCATEGORY_GET_LIST_START':
            state = Object.assign({}, state, {
                realtedcategory: LoadStatus.createLoading(),
            });
            break;
        case 'RELATEDCATEGORY_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                realtedcategory: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'RELATEDCATEGORY_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                realtedcategory: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'GROUPON_GET_LIST_START':
            state = Object.assign({}, state, {
                grouponproduct: LoadStatus.createLoading(),
            });
            break;
        case 'GROUPON_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                grouponproduct: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'GROUPON_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                grouponproduct: LoadStatus.createDoneLoading(action.content)
            });
            break;
    }
    return state;
}
export default reducer;