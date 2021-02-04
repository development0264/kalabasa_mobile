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
        case 'ACCOUNT_GET_START':
            state = Object.assign({}, state, {
                account: LoadStatus.createLoading(),
            });
            break;
        case 'ACCOUNT_GET_FINISH':
            state = Object.assign({}, state, {
                account: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'ACCOUNT_GET_ERROR':
            state = Object.assign({}, state, {
                account: LoadStatus.createErrorLoading(action.error)
            });
        case 'ORDER_GET_START':
            state = Object.assign({}, state, {
                orederList: LoadStatus.createLoading(),
            });
            break;
        case 'ORDER_GET_FINISH':
            state = Object.assign({}, state, {
                orederList: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'ORDER_GET_ERROR':
            state = Object.assign({}, state, {
                orederList: LoadStatus.createErrorLoading(action.error)
            });
        case 'ORDERBYID_GET_START':
            state = Object.assign({}, state, {
                order: LoadStatus.createLoading(),
            });
            break;
        case 'ORDERBYID_GET_FINISH':
            state = Object.assign({}, state, {
                order: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'ORDERBYID_GET_ERROR':
            state = Object.assign({}, state, {
                order: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'ORDERSTATUS_GET_FINISH':
            state = Object.assign({}, state, {
                IsOrederSuccess: action.isoredersuccess
            });
            break;
        case 'ORDERDETAILS_SET_VIEWING':
            state = Object.assign({}, state, {
                orderdetails: action.content
            });
            break;
        case 'NOTIFICATION_GET_START':
            state = Object.assign({}, state, {
                notificationList: LoadStatus.createLoading(),
            });
            break;
        case 'NOTIFICATION_GET_FINISH':
            state = Object.assign({}, state, {
                notificationList: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'NOTIFICATION_GET_ERROR':
            state = Object.assign({}, state, {
                notificationList: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'REQUESTMESSAGES_GET_START':
            state = Object.assign({}, state, {
                requestmessages: LoadStatus.createLoading(),
            });
            break;
        case 'REQUESTMESSAGES_GET_FINISH':
            state = Object.assign({}, state, {
                requestmessages: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'REQUESTMESSAGES_GET_ERROR':
            state = Object.assign({}, state, {
                requestmessages: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'REQUESTMESSAGES_INSERT_START':
            state = Object.assign({}, state, {
                insertrequest: LoadStatus.createLoading(),
            });
            break;
        case 'REQUESTMESSAGES_INSERT_FINISH':
            state = Object.assign({}, state, {
                insertrequest: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'REQUESTMESSAGES_INSERT_ERROR':
            state = Object.assign({}, state, {
                insertrequest: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'ORDERSTATUSDATA_GET_START':
            state = Object.assign({}, state, {
                orderstatus: LoadStatus.createLoading(),
            });
            break;
        case 'ORDERSTATUSDATA_GET_FINISH':
            state = Object.assign({}, state, {
                orderstatus: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'ORDERSTATUSDATA_GET_ERROR':
            state = Object.assign({}, state, {
                orderstatus: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'CUSTOMER_UPDATE_START':
            state = Object.assign({}, state, {
                account: LoadStatus.createLoading(),
            });
            break;
        case 'CUSTOMER_UPDATE_FINISH':
            state = Object.assign({}, state, {
                account: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'CUSTOMER_UPDATE_ERROR':
            state = Object.assign({}, state, {
                account: LoadStatus.createErrorLoading(action.error)
            });
        case 'UNREADNOTIFICATION_GET_START':
            state = Object.assign({}, state, {
                unreadcount: LoadStatus.createLoading(),
            });
            break;
        case 'UNREADNOTIFICATION_GET_FINISH':
            state = Object.assign({}, state, {
                unreadcount: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'UNREADNOTIFICATION_GET_ERROR':
            state = Object.assign({}, state, {
                unreadcount: LoadStatus.createErrorLoading(action.error)
            });
            break;
        case 'NOTIFICATION_READ_START':
            state = Object.assign({}, state, {
                notificationList: LoadStatus.createLoading(),
            });
            break;
        case 'NOTIFICATION_READ_FINISH':
            state = Object.assign({}, state, {
                notificationList: LoadStatus.createDoneLoading(action.content)
            });
            break;
        case 'NOTIFICATION_READ_ERROR':
            state = Object.assign({}, state, {
                notificationList: LoadStatus.createErrorLoading(action.error)
            });
            break;
    }
    return state;
}
export default reducer;