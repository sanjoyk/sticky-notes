import { connect } from 'react-redux';
import { setVisibilityFilter } from '../actions';
import Link from '../components/link';
const mapStateToLinkProps = (state, ownProps) => {
    console.log('state.visibilityFilter', state.visibilityFilter);
    return {
        active: ownProps.filter === state.visibilityFilter
    };
};
const mapDispatchToLinkProps = dispatch => {
    return {
        onFilterClick: filter => {
            console.log('filter in the filterlink', filter);
            dispatch(setVisibilityFilter(filter));
        }
    };
};
const FilterLink = connect(mapStateToLinkProps, mapDispatchToLinkProps)(Link);

export default FilterLink;
