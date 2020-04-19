import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from 'redux';
import { Row, Col, Page } from "../components/ui/Layout";
import { Panel } from "../components/ui/";

class Reports extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page>
        <Row>
          <Col size={12}>
            <Panel title="Reports">empty Reports</Panel>
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
)(Reports);
