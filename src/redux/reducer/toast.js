import { Toast } from 'native-base';

const reducer = (state = {}, action) => {
	switch (action.type) {
		case 'TOAST_SHOW':
			var defaultOptions = {
				text: '',
				buttonText: 'OK',
				type: 'success',
				position: 'bottom',
				duration: 5000
			};
			Toast.show({...defaultOptions, ...action.options});
		break;
		default:
		break;
	}

	return state;
}

export default reducer;
