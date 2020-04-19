import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import withAuth from "../../services/auth/withAuth";
import { compose } from "redux";
import { Row, Col, Page } from "../../components/ui/Layout";
import { Panel } from "../../components/ui/";
import DataTable from "../../components/data/DataTable";
import ReactPaginate from "react-paginate";
import APIAction from "../../services/APIAction";
import S3Service from '../../services/S3Service.js';

const s3 = new S3Service();

const dataSchema = {
  name: "agreements",
  updateName: "company/agreement/detail",
  pdf: "yes ",
  description: "A simple messaging schema",
  fields: {
    vidillionSignedAt: {
      type: "Date",
      reference: "",
      label: "Signed At"
    },
    status: {
      type: "String",
      reference: "",
      label: "Status"
    },
    endingAt: {
      type: "Date",
      reference: "",
      label: "Ending At"
    },
    startingAt: {
      type: "Date",
      reference: "",
      label: "Starting At"
    },
    typeName: {
      type: "String",
      reference: "",
      label: "Type"
    },
    name: {
      type: "String",
      reference: "",
      label: "Name"
    }
  }
};

const GET_AGREEMENT_API = "private/agreements";
const DEL_AGREEMENT_API = "private/agreement/";

const per_page = 10;

const getValue = (opts, val) => opts.find(o => o.id === val);

class Agreements extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      agreements: [],
      offset: 0,
      tot_cnt: 0,
      per_page: 10,
      pageCount: 0,
      end_cnt: 0
    };
  }

  // This function will check if any user is already logged in or not
  componentDidMount() {
    this.reloadAgreementList();
  }

  handleItemDelete(id) {
    if (confirm("Are you sure you want to delete this agreement?")) {
      APIAction.delData(DEL_AGREEMENT_API + id, true)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            console.log(
              "Error deleting agreement: " + JSON.stringify(response)
            );
            alert("Error deleting agreement: " + response.data.message);
            return;
          }
          this.reloadAgreementList();
        })
        .catch(err => console.error(err));
    }
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * per_page);
    this.setState({ offset: offset }, () => {
      this.reloadAgreementList();
    });
  };

  reloadAgreementList() {
    APIAction.getData(
      GET_AGREEMENT_API + "?start=" + this.state.offset + "&count=" + per_page,
      true
    )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({
          agreements: response.data.list,
          pageCount: Math.ceil(response.data.totalCount / per_page),
          tot_cnt: response.data.totalCount
        });
      })
      .catch(err => console.error(err));
  }

  loadAgreementFile(docfile) {
    const myKey = docfile;
    const signedUrlExpireSeconds = 60 * 15; // your expiry time in seconds.
    const url = s3.getSignedUrl(myKey, signedUrlExpireSeconds);
    this.setState({ url: url });
    window.open(url);
  }

  render() {
    let { agreements } = this.state;
    if (!agreements) return <div>Loading data...</div>;

    var ending_cnt = this.state.offset + per_page;
    if (ending_cnt > this.state.tot_cnt) ending_cnt = this.state.tot_cnt;
    this.state.end_cnt = ending_cnt;
    var dispfooter = {
      display: this.state.tot_cnt > 0 ? "block" : "none"
    };

    let refLink = "/app/company/agreements/create";

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
                rows={agreements}
                onDelete={id => this.handleItemDelete(id)}
                refLink={refLink}
                onPage={this.handlePageClick}
                onNext={this.handlePageClick}
                onPrevious={this.handlePageClick}
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
    agreements: state.agreements
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(mapStateToProps)
)(Agreements);
