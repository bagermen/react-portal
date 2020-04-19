import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import withAuth from "../../services/auth/withAuth";
import { compose } from "redux";
import DataTable from "../../components/data/DataTable";
import { Panel } from "../../components/ui";
import { Row, Col, Page } from "../../components/ui/Layout";
import ReactPaginate from "react-paginate";
import APIAction from "../../services/APIAction";

const dataSchema = {
  name: "channels",
  updateName: "channels/update",
  statusChannel: "private/channels",
  description: "A simple messaging schema",
  fields: {
    modifiedAt: {
      type: "Date",
      reference: "",
      label: "Modified At"
    },
    createdAt: {
      type: "Date",
      reference: "",
      label: "Created At"
    },

    tagURL: {
      type: "String",
      reference: "",
      label: "Tag URL"
    },

    /*
    vastTypeName: {
      type: "String",
      reference: "",
      label: "VAST version"
    },
    demandTypeName: {
      type: "String",
      reference: "",
      label: "Demand Type"
    },
    */
    environmentTypeName: {
      type: "String",
      reference: "",
      label: "Content Type"
    },
    status: {
      type: "String",
      reference: "",
      label: "Status"
    },
    description: {
      type: "String",
      reference: "",
      label: "Description"
    },
    name: {
      type: "String",
      reference: "",
      label: "Name"
    }
  }
};

const GET_CHANNEL_API = "private/channels";
const DEL_CHANNEL_API = "private/channel/";
const ACTIVATE_STATUS_CHANNEL_API = "private/channel_activate/";
const DEACTIVATE_STATUS_CHANNEL_API = "private/channel_deactivate/";

const per_page = 10;

class Channels extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      channels: [],
      offset: 0,
      tot_cnt: 0,
      per_page: 10,
      pageCount: 0,
      end_cnt: 0,
      isDisabled: false
    };
  }

  // This function will check if any user is already logged in or not
  componentWillMount() {
    this.reloadChannelList();
  }

  handleItemDelete(id) {
    if (confirm("Are you sure you want to delete this channel?")) {
      APIAction.delData(DEL_CHANNEL_API + id, true)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            console.log("Error deleting channel: " + JSON.stringify(response));
            alert("Error deleting channel: " + response.data.message);
            return;
          }
          this.reloadChannelList();
        })
        .catch(err => console.error(err));
    }
  }

  handleItemStatus(id, status) {
    let STATUS_CHANNEL_API =
      status === "active"
        ? DEACTIVATE_STATUS_CHANNEL_API
        : ACTIVATE_STATUS_CHANNEL_API;

    APIAction.putData(STATUS_CHANNEL_API + id, "", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          console.log(
            "Error changing channel status: " + JSON.stringify(response)
          );
          alert("Error changing channel status: " + response.data.message);
          return;
        }
        this.reloadChannelList();
      })
      .catch(err => {
        console.error(err);
      });
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * per_page);
    this.setState({ offset: offset }, () => {
      this.reloadChannelList();
    });
  };

  reloadChannelList() {
    APIAction.getData(
      GET_CHANNEL_API + "?start=" + this.state.offset + "&count=" + per_page,
      true
    )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({
          channels: response.data.list,
          pageCount: Math.ceil(response.data.totalCount / per_page),
          tot_cnt: response.data.totalCount
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    let { channels } = this.state;
    if (!channels) return <div>Loading data...</div>;

    var ending_cnt = this.state.offset + per_page;
    if (ending_cnt > this.state.tot_cnt) ending_cnt = this.state.tot_cnt;
    this.state.end_cnt = ending_cnt;
    var dispfooter = {
      display: this.state.tot_cnt > 0 ? "block" : "none"
    };

    let refLink = "/app/channels/create";
    const { isMem } = this.props.user;

    return (
      <Page>
        <Row>
          <Col size={12}>
            <Panel>
              <DataTable
                pageSize={per_page}
                page={this.state.offset}
                totalRows={this.state.tot_cnt}
                schema={dataSchema}
                rows={channels}
                onDelete={id => this.handleItemDelete(id)}
                onStatus={(id, status) => this.handleItemStatus(id, status)}
                refLink={refLink}
                onPage={this.handlePageClick}
                onNext={this.handlePageClick}
                onPrevious={this.handlePageClick}
                statDisabled={isMem}
              />
              {
                <footer className="pull-right" style={dispfooter}>
                  <div className={`tbl-footer`}>
                    <div>
                      <div className="text-right m-t-lg">
                        Showing {this.state.offset + 1} to {this.state.end_cnt}{" "}
                        of {this.state.tot_cnt} entries
                      </div>
                    </div>

                    <div>
                      <div
                        className="dataTables_paginate paging_simple_numbers text-right"
                        id="DataTables_Table_1_paginate"
                      >
                        <ReactPaginate
                          previousLabel={"Previous"}
                          nextLabel={"Next"}
                          breakLabel={"..."}
                          breakClassName={"break-me"}
                          pageCount={this.state.pageCount}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={this.handlePageClick}
                          containerClassName={"pagination"}
                          subContainerClassName={"pages pagination"}
                          activeClassName={"active"}
                        />
                      </div>
                    </div>
                  </div>
                </footer>
              }
            </Panel>
          </Col>
        </Row>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    app: state.app,
    channels: state.channels
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(mapStateToProps)
)(Channels);
