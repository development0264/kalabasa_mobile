import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenCartItem from '../../screen/CartItem';
import * as cartActions from '../../../redux/action/cart';
import * as addressActions from '../../../redux/action/address';
import * as productActions from '../../../redux/action/product';

export default connect(
    state => {
        var { cart, address } = state;
        return { cart, address };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(productActions, dispatch),
        bindActionCreators(addressActions, dispatch),
        bindActionCreators(cartActions, dispatch),
    )
)(ScreenCartItem);