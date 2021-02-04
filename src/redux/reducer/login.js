import LoadStatus from '../../lib/load-status';
import axios from '../axios';
import { navigation } from '../services';
//import { Actions } from 'react-native-router-flux';

const initState = (state) => {
	state = state ? { ...state } : {};
	state.loginOptions = state.loginOptions ? state.loginOptions : { successUrl: null, successScreen: null };
	state.login_details = state.login_details ? state.login_details : null;
	return state;
};

const reducer = (previousState, action) => {
	var state = previousState ? previousState : initState();
	//alert(action.type)
	switch (action.type) {
		case "persist/REHYDRATE":
			// For some reason I am yet to figure out - action.payload data for persist/REHYDRATE
			// has no constructors. Even though the store-transform is definitaly applying the constructors
			// using JsonTyped as we can see the objects have the correct constructors after hydration.
			// For no, I get around this by simply not using the constructor functions and accessing data directly
			// during rehydration. (kfoster: 2018-11-22)
			////console.log({
			//  'action.payload.member.member.value': action.payload.member.member.value,
			//  'action.payload.member.member.value.constructor.name': action.payload.member.member.value.constructor.name,
			//});
			//
			if (action.payload && action.payload.login && action.payload.login.login) {
				var member = action.payload.login.login.access_token;
				//console.log(member)
				if (member != undefined) {
					axios.defaults.headers.common.Authorization = member
					// setTimeout(function () {
					// 	navigation.navigate('Home');
					// })
				}
			}
			break;
		case 'NAV_APP_LOADED':
			state = initState(previousState);
			break;
		case 'LOGIN_START':
			state = Object.assign({}, state, {
				login_details: LoadStatus.createRunning()
			});
			break;
		case 'SAVE_LOGIN_DATA':
			//console.log(action)
			state = Object.assign({}, state, {
				login_details: LoadStatus.createDone(action.content)
			});
			break;
		case 'LOGIN_FINISH':
			//console.log('content', action.content)
			state = Object.assign({}, state, {
				login: (action.content)
			});
			break;
		case 'RENEW_AUTH_FINISH':
		case 'LOGIN_ERROR':
			state = Object.assign({}, state, {
				login: LoadStatus.createError(action.error)
			});
			break;
		case 'LOGIN_NOT_FOUND':
			state = Object.assign({}, state, {
				login: LoadStatus.createError('No account was found with that email / password'),
			});
			break;
		case 'LOGIN_INVALID':
			state = Object.assign({}, state, {
				login: LoadStatus.createError('No account was found with that email / password'),
			});
			break;
		case 'LOGOUT_START':
			state = Object.assign({}, state, {
				logout: LoadStatus.createRunning()
			});
			break;
		case 'LOGOUT_FINISH':
			state = Object.assign({}, state, {
				logout: LoadStatus.createDone(true),
				login: LoadStatus.createEmpty(),
				login_details: LoadStatus.createEmpty()
			});
			break;
		case 'LOGOUT_ERROR':
			state = Object.assign({}, state, {
				logout: LoadStatus.createError('There was a problem logging out of your account')
			});
			break;
		case 'PASSWORD_RESET_START':
			state = Object.assign({}, state, {
				passwordReset: LoadStatus.createRunning()
			});
			break;
		case 'PASSWORD_RESET_FINISH':
			state = Object.assign({}, state, {
				passwordReset: LoadStatus.createDone(true)
			});
			break;
		case 'PASSWORD_RESET_ERROR':
			state = Object.assign({}, state, {
				passwordReset: LoadStatus.createError('There was a problem updating your password')
			});
			break;
		case 'FCM_TOKEN_SET':
			state = Object.assign({}, state, {
				fcmToken: action.token
			});
			break;
		case 'PURGE':
			state = initState({});
			break;
		default:
			break;
	}
	return state;
}

export default reducer;
