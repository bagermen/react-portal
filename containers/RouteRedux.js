import { Route } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updatePageName, updatePageDescription } from '../actions/page';

/**
 * Bind Route and place pageName and pageDescription into Redux page
 */
class RouteRedux extends Route {
  /* jshint ignore:start */
  static propTypes = {
    pageName: PropTypes.string,
    pageDescription: PropTypes.string,
    updatePageName: PropTypes.func.isRequired,
    updatePageDescription: PropTypes.func.isRequired
  }

  static defaultProps = {
    pageName: '',
    pageDescription: ''
  }
  /* jshint ignore:end */

  constructor() {
    super(...arguments);
    this.syncProps = this.syncProps.bind(this);
    this.syncProps(this.props.pageName, this.props.pageDescription);
  }

  shouldComponentUpdate(nextProps) {
    let update = false;

    if (this.props.pageName != nextProps.pageName || this.props.pageDescription != nextProps.pageDescription) {
      this.syncProps(nextProps.pageName, nextProps.pageDescription);
      update = true;
    }

    return update;
  }

  syncProps(name, description) {
    this.props.updatePageName(name);
    this.props.updatePageDescription(description);
  }
}

function mapDispatchToProps(dispatch) {
  return {
      ...bindActionCreators({
        updatePageName,
        updatePageDescription
      }, dispatch)
  };
}

export default connect(
  null,
  mapDispatchToProps
)(RouteRedux);