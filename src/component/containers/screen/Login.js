import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenLogin from '../../screen/Login';
import * as loginActions from '../../../redux/action/login';

export default connect(
	state => {
		var { login } = state;
		return { login };
	},
	dispatch => Object.assign(
		{},
		bindActionCreators(loginActions, dispatch),
	)
)(ScreenLogin);
