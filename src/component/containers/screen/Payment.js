import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenPayment from '../../screen/Payment';
import * as cartActions from '../../../redux/action/cart';
import * as addressActions from '../../../redux/action/address';
import * as loginActions from '../../../redux/action/login';
import * as productActions from '../../../redux/action/product';

export default connect(
    state => {
        var { cart, address, login, product } = state;
        return { cart, address, login, product };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(productActions, dispatch),
        bindActionCreators(loginActions, dispatch),
        bindActionCreators(addressActions, dispatch),
        bindActionCreators(cartActions, dispatch),
    )
)(ScreenPayment);