import React, {Component} from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Alert extends Component {
    /* jshint ignore:start */
  static propTypes = {
    title: PropTypes.string,
    body: PropTypes.string
  }
  static defaultProps = {
    title: '',
    body: '',
  };
  /* jshint ignore:end */

  render() {
      const { body } = this.props;
      return (
          <div>{body}</div>
      )
  }
}

function mapStateToProps(state) {
  return {
      title: state.popup_alert.title,
      body: state.popup_alert.body
  };
}

export default connect(mapStateToProps)(Alert);