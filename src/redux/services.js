import Auth from './service/auth';
import authConfig from './auth-config';
import Navigation from './service/navigation';

export const navigation = new Navigation;
export const auth = new Auth(authConfig, navigation);
