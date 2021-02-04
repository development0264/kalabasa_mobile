class Auth {
	constructor(config, navigation) {
		this.navigation = navigation ? navigation : {};
		this.config = config ? config : {};
	}

	getState() {
		return this.getReduxState ? this.getReduxState() : null;
	}

	getMember() {
		var state = this.getState();
		return state && state.member ? state.member.member : null;
	}

	getScreenConfig(screenName) {
		return this.config.screen[screenName];
	}

	isScreenProtected(screenName) {
		var result = this.getScreenConfig(screenName) !== undefined;
		return result;
	}

	isNavigationPermitted(screenName) {
		var result = true;
		if (this.isScreenProtected(screenName)) {
			result = false;
			var sceneConfig = this.getScreenConfig(screenName);
			if (typeof sceneConfig.permit == 'string') {
				//console.log(this.hasRole(sceneConfig.permit))
				if (sceneConfig.permit == '*' || this.hasRole(sceneConfig.permit)) result = true;
			}
		}
		return result;
	}

	handleNavigationAuthFailure(screenName, options) {
		options = options ? options : {};
		if (this.isScreenProtected(screenName)) {
			var sceneConfig = this.getScreenConfig(screenName);
			var onFail = sceneConfig.onFail ? sceneConfig.onFail : 'login';
			if (typeof onFail == 'string') {
				var successScreen = options.successScreen ? options.successScreen : null;
				switch (sceneConfig.onFail) {
					default:
					case 'login':
						this.navigation.navigate('Login', { successScreen });
						break;
				}
			} else if (typeof onFail == 'function') {
				onFail();
			}
		}
	}

	authNavigation(screenName, options) {
		//console.log(screenName, !this.isNavigationPermitted(screenName))
		if (!this.isNavigationPermitted(screenName)) {
			this.handleNavigationAuthFailure(screenName, options);
		}
	}

	hasRole(role) {
		var hasRole = false;
		switch (role) {
			case 'authed':
				hasRole = true
			default:
		}
		return hasRole;
	}
}

export default Auth;
