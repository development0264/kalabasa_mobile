import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenAddress from '../../screen/SelectAddress';
import * as addressActions from '../../../redux/action/address';
import * as cartActions from '../../../redux/action/cart';

export default connect(
    state => {
        var { address } = state;
        return { address };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(cartActions, dispatch),
        bindActionCreators(addressActions, dispatch),
    )
)(ScreenAddress);