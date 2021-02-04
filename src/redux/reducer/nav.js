import { Toast } from 'native-base';
import { navigation } from '../services';
import LoadStatus from '../../lib/load-status';

const reducer = (state = {}, action) => {
	state.passwordReset = state.passwordReset ? state.passwordReset : null;
	//alert(action.type)
	switch (action.type) {
		case 'NAV_APP_LOADED':
			break;
		case 'NAV_LOGIN_SET_OPTIONS':
			if (action.options) {
				state.passwordReset = action.options;
			}
			break;
		case 'LOGIN_FINISH':
			var successScreen = state.loginOptions && state.loginOptions.successScreen ?
				state.loginOptions.successScreen : 'Home';
			//console.log('navigation', successScreen)
			// This is a hack - we need to figure out a way to trigger redux actions sequentially
			// When the user logs in or signs up, we set the user data to the store to record this
			// - The data must be set before we redirect to the successScreen, which may require authentication
			// - but redux does not guarantee that the state is updated before the next action is dispatched
			// - If we attempt to redirect the user too soon the redirect may fail authentication
			setTimeout(() => {
				navigation.navigate(successScreen, { islogin: true });
			}, 300);
			break;
		case 'LOGOUT_FINISH':
			state = Object.assign({}, state, {
				logout: LoadStatus.createDone(true),
				login: LoadStatus.createEmpty(),
				login_details: LoadStatus.createEmpty()
			});
			setTimeout(() => {
				navigation.navigate('Login');
			}, 300);
			break;
		case 'PURGE':
			state = {};
			break;
		default:
			break;
	}

	return state;
}

export default reducer;
