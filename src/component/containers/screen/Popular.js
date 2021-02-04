import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenPopular from '../../screen/Popular';
import * as homeActions from '../../../redux/action/home';
import * as cartActions from '../../../redux/action/cart';
import * as productActions from '../../../redux/action/product';

export default connect(
    state => {
        var { home, cart, product } = state;
        return { home, cart, product };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(productActions, dispatch),
        bindActionCreators(homeActions, dispatch),
        bindActionCreators(cartActions, dispatch),
    )
)(ScreenPopular);