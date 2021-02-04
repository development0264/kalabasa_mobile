import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenProductDetail from '../../screen/ProductDetail';
import * as productActions from '../../../redux/action/product';
import * as cartActions from '../../../redux/action/cart';
import * as homeActions from '../../../redux/action/home';

export default connect(
    state => {
        var { product, cart, home, login } = state;
        return { product, cart, home, login };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(homeActions, dispatch),
        bindActionCreators(productActions, dispatch),
        bindActionCreators(cartActions, dispatch),
    )
)(ScreenProductDetail);