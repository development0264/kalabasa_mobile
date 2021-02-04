import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import OrderSuccess from '../../screen/OrderSuccess';
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
)(OrderSuccess);