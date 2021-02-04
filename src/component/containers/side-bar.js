import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SideBar from '../side-bar';
import * as cartActions from '../../redux/action/cart';
import * as loginActions from '../../redux/action/login';
import * as accountActions from '../../redux/action/account';

export default connect(
	state => {
		const { cart, login, account, home } = state;
		return { cart, login, account, home };
	},
	dispatch => Object.assign(
		{},
		bindActionCreators(loginActions, dispatch),
		bindActionCreators(cartActions, dispatch),
		bindActionCreators(accountActions, dispatch)
	)
)(SideBar);
