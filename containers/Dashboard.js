import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from 'redux';
import { Row, Col, Page } from "../components/ui/Layout";
import { Panel } from "../components/ui/";

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <Row>
          <Col size={12}>
            <Panel title="Dashboard">User Dashboard</Panel>
          </Col>
        </Row>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Dashboard);