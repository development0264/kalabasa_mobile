import Qs from 'qs';
import axios from 'axios';
import Config from 'react-native-config';

var instance = axios.create({
	baseURL: Config.API_BASE_URL,
	timeout: 30000,
	paramsSerializer: function (params) {
		return Qs.stringify(params, { arrayFormat: 'brackets' });
	}
});

export default instance;
