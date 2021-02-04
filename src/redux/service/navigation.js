import type, { NavigationActions, NavigationParams, NavigationRoute, StackActions } from 'react-navigation';

class Navigation {
	setContainer(container: Object) {
		this.container = container;
	}

	reset(routeName: string, params?: NavigationParams) {
		if (this.container) {
			this.container.dispatch(
				StackActions.reset({
					index: 0,
					actions: [
						NavigationActions.navigate({
							type: 'Navigation/NAVIGATE',
							routeName,
							params,
						}),
					],
				}),
			);
		}
	}

	navigate(routeName: string, params?: NavigationParams) {
		if (this.container) {
			this.container.dispatch(
				NavigationActions.navigate({
					type: 'Navigation/NAVIGATE',
					routeName,
					params,
				}),
			);
		}
	}

	goBack() {
		if (this.container) {
			this.container.dispatch(
				NavigationActions.navigate({
					type: 'Navigation/BACK'
				}),
			);
		}
	}

	navigateDeep(actions: { routeName: string, params?: NavigationParams }[]) {
		if (this.container) {
			this.container.dispatch(
				actions.reduceRight(
					(prevAction, action): any =>
						NavigationActions.navigate({
							type: 'Navigation/NAVIGATE',
							routeName: action.routeName,
							params: action.params,
							action: prevAction,
						}),
					undefined,
				),
			);
		}
	}

	getCurrentRoute() {
		if (!this.container || !this.container.state.nav) {
			return null;
		}

		return this.container.state.nav.routes[this.container.state.nav.index] || null;
	}
}

export default Navigation;
