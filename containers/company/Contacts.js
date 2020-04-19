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

const dataSchema = {
  name: "contacts",
  updateName: "company/contacts/update",
  description: "A simple messaging schema",
  fields: {
    messaging: {
      type: "String",
      reference: "",
      label: "Messaging"
    },

    phone: {
      type: "String",
      reference: "",
      label: "Phone"
    },
    email: {
      type: "String",
      reference: "",
      label: "Email"
    },
    typeName: {
      type: "String",
      reference: "",
      label: "Type"
    },
    title: {
      type: "String",
      reference: "",
      label: "Title"
    },
    lastName: {
      type: "String",
      reference: "",
      label: "Last Name"
    },
    firstName: {
      type: "String",
      reference: "",
      label: "First Name"
    }
  }
};

const GET_CONTACT_API = "private/contacts";
const DEL_CONTACT_API = "private/contact/";

const per_page = 10;

const getValue = (opts, val) => opts.find(o => o.id === val);

class Contacts extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      offset: 0,
      tot_cnt: 0,
      per_page: 10,
      pageCount: 0,
      end_cnt: 0
    };
  }

  // This function will check if any user is already logged in or not
  componentDidMount() {
    this.reloadTypes();
    this.reloadContactList();
  }

  reloadTypes() {
    APIAction.getData("public/contacttypes", false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ type_list: response.data });
      })
      .catch(err => console.error(err));
  }

  handleItemDelete(id) {
    if (confirm("Are you sure you want to delete this contact?")) {
      APIAction.delData(DEL_CONTACT_API + id, true)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            console.log("Error deleting contact: " + JSON.stringify(response));
            alert("Error deleting contact: " + response.data.message);
            return;
          }
          this.reloadContactList();
        })
        .catch(err => console.error(err));
    }
  }

  handlePageClick = data => {
    let selected = data.selected;
    let offset = Math.ceil(selected * per_page);
    this.setState({ offset: offset }, () => {
      this.reloadContactList();
    });
  };

  reloadContactList() {
    APIAction.getData(
      GET_CONTACT_API + "?start=" + this.state.offset + "&count=" + per_page,
      true
    )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        this.setState({
          contacts: response.data.list,
          pageCount: Math.ceil(response.data.totalCount / per_page),
          tot_cnt: response.data.totalCount
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    let { contacts } = this.state;
    if (!contacts) return <div>Loading data...</div>;

    var ending_cnt = this.state.offset + per_page;
    if (ending_cnt > this.state.tot_cnt) ending_cnt = this.state.tot_cnt;
    this.state.end_cnt = ending_cnt;
    var dispfooter = {
      display: this.state.tot_cnt > 0 ? "block" : "none"
    };

    let refLink = "/app/company/contacts/create";

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
                rows={contacts}
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
    contacts: state.contacts
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(mapStateToProps)
)(Contacts);
