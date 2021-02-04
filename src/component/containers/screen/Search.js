import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenSearch from '../../screen/Search';
import * as categoriesActions from '../../../redux/action/categories';
import * as productActions from '../../../redux/action/product';
import * as homeActions from '../../../redux/action/home';

export default connect(
    state => {
        var { categories, cart, product, home } = state;
        return { categories, cart, product, home };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(productActions, dispatch),
        bindActionCreators(categoriesActions, dispatch),
        bindActionCreators(homeActions, dispatch),
    )
)(ScreenSearch);