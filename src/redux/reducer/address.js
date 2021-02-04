import LoadStatus from '../../lib/load-status';
import axios from '../axios';

const initState = (state) => {
    state = state ? { ...state } : {};
    return state;
};

const reducer = (previousState, action) => {
    var state = previousState ? previousState : initState();
    switch (action.type) {
        case 'NAV_APP_LOADED':
            state = initState(previousState);
            break;
        case 'ADDRESS_GET_LIST_START':
            state = Object.assign({}, state, {
                address: LoadStatus.createLoading(),
            });
            break;
        case 'ADDRESS_GET_LIST_FINISH':
            state = Object.assign({}, state, {
                address: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'ADDRESS_GET_LIST_ERROR':
            state = Object.assign({}, state, {
                address: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'ADDRESS_SET_VIEWING':
            state = Object.assign({}, state, {
                viewaddress: action.content,
            });
            break;
        case 'ADD_ADDRESS_START':
            state = Object.assign({}, state, {
                address: LoadStatus.createLoading(),
            });
            break;
        case 'ADD_ADDRESS_FINISH':
            state = Object.assign({}, state, {
                address: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'ADD_ADDRESS_ERROR':
            state = Object.assign({}, state, {
                address: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'UPDATE_ADDRESS_START':
            state = Object.assign({}, state, {
                address: LoadStatus.createLoading(),
            });
            break;
        case 'UPDATE_ADDRESS_FINISH':
            state = Object.assign({}, state, {
                address: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'UPDATE_ADDRESS_ERROR':
            state = Object.assign({}, state, {
                address: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'DELETE_ADDRESS_START':
            state = Object.assign({}, state, {
                address: LoadStatus.createLoading(),
            });
            break;
        case 'DELETE_ADDRESS_FINISH':
            state = Object.assign({}, state, {
                address: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'DELETE_ADDRESS_ERROR':
            state = Object.assign({}, state, {
                address: LoadStatus.createErrorLoading(action.error)
            });
            break;
    }
    return state;
}
export default reducer;
