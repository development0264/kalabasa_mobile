import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenEditAddress from '../../screen/EditAddress';
import * as loginActions from '../../../redux/action/login';
import * as addressActions from '../../../redux/action/address';

export default connect(
    state => {
        var { address, login, home } = state;
        return { address, login, home };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(loginActions, dispatch),
        bindActionCreators(addressActions, dispatch),
    )
)(ScreenEditAddress);