import { Logout } from '../login';

export default function apiErrorHandler(error, dispatch, getState) {
	if (error.response && error.response.status === 401) {
		dispatch({ type: 'TOAST_SHOW', options: { type: 'danger', text: 'Authentication error' } });
		dispatch(Logout());
	}
}
