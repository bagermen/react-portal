import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import { compose } from 'redux';
import PropTypes from "prop-types";

import Header from './Header';
import Menu from './Menu';
import Login from './access/Login';
import SignUp from './SignUp/index';
import ModalFromFactory from "../components/modals/factory";
import PasswChange from '../components/modals/PasswChange';
import {WIN_CHANGE_PASSWORD} from "../constants/windows";

const Factory = ModalFromFactory.modalFromFactory;

class App extends PureComponent {
  /* jshint ignore:start */
  static propTypes = {
    user: PropTypes.object,
    page: PropTypes.object
  }
  static defaultProps = {
    page: {},
    user: {}
  }
  /* jshint ignore:end */

  render() {

    const { match, children, user, page } = this.props;
    const value = match.path.substring(1);

    return (
      <>
        <section className="vbox">
          <section>
              <section className="hbox stretch">
                  <Menu user={user}
                    currentPage={value} />
                  <section id="content">
                    <Header user={user} name={page.name} description={page.description} />
                    {children}
                  </section>
              </section>
          </section>
        </section>
        <Factory
          modalref={WIN_CHANGE_PASSWORD}
          title="Change Password"
          factory={PasswChange}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    page: state.page
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(App);
