import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { auth } from '../redux/services';

export default class Auth extends React.PureComponent {
	static propTypes = {
		onFail: PropTypes.string,
		permit: PropTypes.string,
		targetScreen: PropTypes.string
	};

	constructor(props) {
		super(props);
		this.state = { authed: false };
	}

	componentDidMount() {
		this.setState({ authed: this.authorize() });
	}

	componentWillReceiveProps() {
		this.setState({ authed: this.authorize() });
	}

	authorize() {
		// If a route has an auth setting then we must authenticate, so authed default switches to false
		var authed = false;
		var onFail = this.props['onFail'] ? this.props['onFail'] : 'hide';
		var permit = this.props['permit'] ? this.props['permit'] : 'authed';
		var targetScreen = this.props['targetScreen'] ? this.props['targetScreen'] : null;

		if (targetScreen && !auth.isNavigationPermitted(targetScreen)) {
			authed = false;
		} else {
			var permitRoles = Array.isArray(this.props['permit']) ? this.props['permit'] : [permit];
			console.log('permitRoles', permitRoles)
			permitRoles.forEach((permitRole) => {
				if (auth.hasRole(permitRole)) authed = true;
			});
		}
		if (authed === false) {
			var failType = typeof onFail;
			if (failType === 'string') {
				switch (onFail) {
					default:
					case 'hide':
						break;
				}
			} else if (failType === 'function') {
				onFail();
			}
		}

		return authed;
	}

	render() {
		return (this.state.authed) ? this.props['children'] : null;
	}
}
