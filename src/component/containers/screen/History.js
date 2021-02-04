import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenHistory from '../../screen/History';
import * as accountActions from '../../../redux/action/account';

export default connect(
    state => {
        var { account, home } = state;
        return { account, home };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(accountActions, dispatch),
    )
)(ScreenHistory);