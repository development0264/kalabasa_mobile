import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ScreenMyFavourite from '../../screen/MyFavourite';
import * as accountActions from '../../../redux/action/account';
import * as productActions from '../../../redux/action/product';
import * as homeActions from '../../../redux/action/home';

export default connect(
    state => {
        var { product, home } = state;
        return { product, home };
    },
    dispatch => Object.assign(
        {},
        bindActionCreators(homeActions, dispatch),
        bindActionCreators(productActions, dispatch),
    )
)(ScreenMyFavourite);