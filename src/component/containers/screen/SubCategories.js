import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenSubCategories from '../../screen/SubCategory';
import * as categoriesActions from '../../../redux/action/categories';
import * as cartActions from '../../../redux/action/cart';
import * as productActions from '../../../redux/action/product';
import * as homeActions from '../../../redux/action/home';

export default connect(
    state => {
        var { categories, cart, home } = state;
        return { categories, cart, home };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(homeActions, dispatch),
        bindActionCreators(productActions, dispatch),
        bindActionCreators(cartActions, dispatch),
        bindActionCreators(categoriesActions, dispatch),
    )
)(ScreenSubCategories);