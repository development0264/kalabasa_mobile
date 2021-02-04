import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenAddRequest from '../../screen/AddRequest';
import * as accountActions from '../../../redux/action/account';

export default connect(
    state => {
        var { account } = state;
        return { account };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(accountActions, dispatch),
    )
)(ScreenAddRequest);