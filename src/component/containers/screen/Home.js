import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenHome from '../../screen/Home';
import * as homeActions from '../../../redux/action/home';
import * as cartActions from '../../../redux/action/cart';
import * as categoriesActions from '../../../redux/action/categories';
import * as productActions from '../../../redux/action/product';
import * as accountActions from '../../../redux/action/account';

export default connect(
    state => {
        var { login, home, cart, account, product, categories } = state;
        return { login, home, cart, account, product, categories };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(accountActions, dispatch),
        bindActionCreators(productActions, dispatch),
        bindActionCreators(categoriesActions, dispatch),
        bindActionCreators(homeActions, dispatch),
        bindActionCreators(cartActions, dispatch),

    )
)(ScreenHome);