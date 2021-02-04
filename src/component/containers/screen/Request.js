import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenRequest from '../../screen/Request';
import * as accountActions from '../../../redux/action/account';

export default connect(
    state => {
        var { login, account } = state;
        return { login, account };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(accountActions, dispatch),
    )
)(ScreenRequest);