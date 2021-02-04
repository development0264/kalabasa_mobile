import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenGroupon from '../../screen/Groupon';
import * as categoriesActions from '../../../redux/action/categories';
import * as cartActions from '../../../redux/action/cart';
import * as productActions from '../../../redux/action/product';

export default connect(
    state => {
        var { categories, cart, product, login } = state;
        return { categories, cart, product, login };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(productActions, dispatch),
        bindActionCreators(cartActions, dispatch),
        bindActionCreators(categoriesActions, dispatch),
    )
)(ScreenGroupon);