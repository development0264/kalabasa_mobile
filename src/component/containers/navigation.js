import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Navigation from '../navigation';
import * as navActions from '../../redux/action/nav';
import * as loginActions from '../../redux/action/login';

export default connect(
	state => {
		var { login } = state;
		return { login };
	},
	dispatch => Object.assign(
		{},
		bindActionCreators(navActions, dispatch),
		bindActionCreators(loginActions, dispatch)
	)
)(Navigation);
