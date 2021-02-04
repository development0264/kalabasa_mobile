import axios from '../axios';
import { Platform } from 'react-native';
import { toastShow } from './toast';
import apiErrorHandler from './helper/api-error-handler';
import { homecontentGetList, popularproducts } from './home';
import { cartGetList, cartGetListFinish, cartproductFinish } from './cart';
import { addressGetList } from './address';
import AsyncStorage from '@react-native-community/async-storage';

export const LoginStart = () => {
	return {
		type: 'LOGIN_START'
	}
}

export const LoginCancel = () => {
	return {
		type: 'LOGIN_CANCEL'
	}
}

export const LoginFinish = (content) => {
	return {
		type: 'LOGIN_FINISH',
		content
	}
}

export const LoginError = (error) => {
	return {
		type: 'LOGIN_ERROR',
		error
	}
}

export const LoginNotFound = (error) => {
	return {
		type: 'LOGIN_NOT_FOUND',
		error
	}
}

export const LoginInvalid = (error) => {
	return {
		type: 'LOGIN_INVALID',
		error
	}
}

export const navLoginSetOptions = (options) => {
	return {
		type: 'NAV_LOGIN_SET_OPTIONS', // This is hanlded by the client specific NAV reducer
		options
	}
}

export const SaveLoginData = (content) => {
	return {
		type: 'SAVE_LOGIN_DATA',
		content
	}
}

export const Login = (data, options) => {
	return async (dispatch) => {
		dispatch(LoginStart());
		dispatch(navLoginSetOptions(options));
		try {
			var response = await axios.post('/auth/login', data);
			//console.log(response)
		} catch (error) {
			//console.log(error)			
			if (error.response && error.response.status === 404) {
				dispatch(toastShow({ text: 'No account was found with that email and password', type: 'danger' }));
				dispatch(LoginNotFound(error));
				return;
			} else if (error.response && error.response.status === 401) {
				dispatch(toastShow({ text: 'No account was found with that email and password', type: 'danger' }));
				dispatch(LoginInvalid(error));
				return;
			} else {
				dispatch(toastShow({ text: 'There was a problem when logging in', type: 'danger' }));
				dispatch(LoginError(error));
				throw error;
			}
			return;
		}
		AuthTokenSet(response.data.access_token);
		//storeData(response.data.customer);

		//alert(JSON.stringify(response.data.customer.cover))
		let obj = {
			id: response.data.customer.id,
			email: response.data.customer.email,
			mobile: response.data.customer.mobile,
			name: response.data.customer.name,
			access_token: response.data.access_token,
			cover: response.data.customer.cover,
		}
		await dispatch(SaveLoginData(obj));
		await dispatch(LoginFinish(response.data));
		return response.data;
	};
}

export const LoginGuest = (data, options) => {
	//alert(JSON.stringify(data))
	return async (dispatch) => {
		await dispatch(cartGetListFinish([]));
		await dispatch(cartproductFinish(0));
		await dispatch(SaveLoginData({}));
		await dispatch(SaveLoginData({}));
		await dispatch(LoginStart());
		await dispatch(navLoginSetOptions(options));
		await dispatch(LoginFinish(null));
		return null;
	};
}

export const LogoutStart = () => {
	return {
		type: 'LOGOUT_START'
	}
}

export const LogoutFinish = () => {
	return {
		type: 'LOGOUT_FINISH'
	}
}

export const LogoutError = (error) => {
	return {
		type: 'LOGOUT_ERROR',
		error
	}
}

export const Logout = () => {
	return async (dispatch) => {
		dispatch(LogoutStart());
		try {
			await axios.post('/auth/logout');
		} catch (error) {
			//console.log("error", error)
			// Even if there was a error we still finish the logout action
			// - because we must discard the local token even if we were not able to delete the remote token
			if (error.response && error.response.status === 401) {
				// Auth token not found
			}
			AuthTokenUnset();
			await AsyncStorage.setItem('groupon_cart', "");
			dispatch(LogoutFinish());
			return;
		}
		AuthTokenUnset();
		await AsyncStorage.setItem('groupon_cart', "");
		dispatch(LogoutFinish());
		dispatch({ type: 'PURGE' });
	};
}

const createFormData = (photo) => {
	const data = new FormData();

	data.append("cover", {
		name: (photo.fileName != null && photo.fileName != "") ? photo.fileName : "Image.jpg",//photo.fileName,
		type: photo.type,
		uri:
			Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
	});
	console.log(data)
	return data;
};

export const SaveImageStart = () => {
	return {
		type: 'SAVEIMAGE_START'
	}
}

export const SaveImageFinish = () => {
	return {
		type: 'SAVEIMAGE_FINISH'
	}
}

export const SaveImageError = (error) => {
	return {
		type: 'SAVEIMAGE_ERROR',
		error
	}
}

export const SaveImage = (photo) => {
	return async (dispatch, getState) => {
		var state = getState();
		dispatch(SaveImageStart());
		try {
			var response = await axios.post('/auth/uploadCover', createFormData(photo));
			//alert(JSON.stringify(response))
		} catch (error) {
			dispatch({ type: 'TOAST_SHOW', options: { type: 'danger', text: error.message } });
			dispatch(SaveImageError());
			apiErrorHandler(error, dispatch, getState);
			throw error;
		}
		// console.log(response.data.path)

		var content = state.login.login_details.getValue();
		content.cover = response.data.path;

		// console.log("content", content)
		dispatch({ type: 'TOAST_SHOW', options: { type: 'success', text: response.data.message } });
		await dispatch(SaveLoginData(content));
		await dispatch(SaveImageFinish());
		return content;
	};
}

export const AuthTokenSet = (token) => {
	axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

export const AuthTokenUnset = () => {
	axios.defaults.headers.common['Authorization'] = undefined;
}
export const FcmTokenset = (token) => {
	return {
		type: 'FCM_TOKEN_SET',
		token
	}
}

export const FcmToken = (token) => {
	return async (dispatch) => {
		await dispatch(FcmTokenset(token));
	}
}

storeData = async (data) => {
	//console.log()
	let obj = {
		id: data.id,
		email: data.email,
		mobile: data.mobile,
		name: data.name,
	}

	try {
		await AsyncStorage.setItem('login_details', JSON.stringify(obj));
	} catch (e) {
	}
}
