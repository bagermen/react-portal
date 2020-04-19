import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import withAuth from "../../services/auth/withAuth";
import { compose } from "redux";
import { Row, Col, Page } from "../../components/ui/Layout";
import Select from "react-select";
import ReactModal from "react-modal";

import APIAction from "../../services/APIAction";
import S3Service from '../../services/S3Service.js';

const s3 = new S3Service();

const colourStyles = {
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#3399ff" : "#293a47",
    ":hover": {
      backgroundColor: "#3399ff"
    }
  })
};

ReactModal.setAppElement(document.getElementById("wrapperContainer"));
var shallowCompare = require("react-addons-shallow-compare");
const UPDATE_AGREEMENT_API = "private/agreement/";
const GET_AGREEMENT_API = "private/agreement/";

const getValue = (opts, val) => opts.find(o => o.id === val);

class AgreementDetail extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      selectedOptionType: "",
      status: "",
      validity_from: "",
      validity_to: "",
      notes: "",
      customer_contact: "",
      customer_signed_at: "",
      customer_initial_payment: "",
      customer_periodicpaymentsfee: "",
      customer_periodicpaymentspercent: "",
      vidillion_contact: "",
      vidillion_signed_at: "",
      vidillion_initial_payment: "",
      vidillion_periodicpaymentsfee: "",
      vidillion_periodicpaymentspercent: "",
      selectedOptionType: 0,
      type_list: [],
      documentation: "",
      isMem: true,
      showAlert: false,
      showAlertText: "",
      url: ""
    };

    this.onSave = this.onSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleFirstName = this.handleFirstName.bind(this);
    this.handleLastName = this.handleLastName.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.handleMessaging = this.handleMessaging.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleTimeZoneChange = this.handleTimeZoneChange.bind(this);
  }

  // This function will check if any user is already logged in or not
  componentDidMount() {
    this.reloadTypes();
    this.loadAgreement();
  }

  loadAgreement() {
    var agreement_id = this.props.match.params.id;

    APIAction.getData(GET_AGREEMENT_API + agreement_id, true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        /* console.log(
          GET_AGREEMENT_API + agreement_id + JSON.stringify(response)
        );*/

        this.setState({
          id: agreement_id,
          type_id: response.data.typeId,
          name: response.data.name,
          status: response.data.status,
          validity_from: response.data.startingAt,
          validity_to: response.data.endingAt,
          notes: response.data.notes,
          customer_contact: response.data.companyContactName,
          customer_signed_at: response.data.companySignedAt,
          customer_initial_payment: response.data.companyInitialFee,
          customer_periodicpaymentsfee: response.data.companyPeriodicFee,
          customer_periodicpaymentspercent:
            response.data.companyPeriodicPercent,
          vidillion_contact: response.data.vidillionContactName,
          vidillion_signed_at: response.data.vidillionSignedAt,
          vidillion_initial_payment: response.data.vidillionInitialFee,
          vidillion_periodicpaymentsfee: response.data.vidillionPeriodicFee,
          vidillion_periodicpaymentspercent:
            response.data.vidillionPeriodicPercent,
          documentation: response.data.documentation
        });

        this.reloadTypes();
      })
      .catch(err => console.error(err));
  }

  reloadTypes() {
    APIAction.getData("private/agreementtypes", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        //console.log("type_list" + JSON.stringify(response));
        this.setState({ type_list: response.data });
        this.selectType();
      })
      .catch(err => console.error(err));
  }

  selectType() {
    var selectedType = [];
    if (this.state.type_id) {
      selectedType.push(getValue(this.state.type_list, this.state.type_id));
    }
    this.setState({ selectedOptionType: selectedType });
  }

  loadAgreementFile() {
    const myKey = this.state.documentation;
    const signedUrlExpireSeconds = 60 * 15; // your expiry time in seconds.
    const url = s3.getSignedUrl(myKey, signedUrlExpireSeconds);

    this.setState({ url: url });
    window.open(url);
  }

  handleFirstName(e) {
    this.setState({ first_name: e.target.value });
  }

  handleLastName(e) {
    this.setState({ last_name: e.target.value });
  }

  handleTitle(e) {
    this.setState({ title: e.target.value });
  }

  handleEmail(e) {
    this.setState({ email: e.target.value });
  }

  handlePhone(e) {
    this.setState({ phone: e.target.value });
  }

  handleMessaging(e) {
    this.setState({ messaging: e.target.value });
  }

  handleTypeChange = selectedOptionType => {
    this.setState({ selectedOptionType });
  };

  handleTimeZoneChange = selectedOptionTimezone => {
    this.setState({ selectedOptionTimezone });
  };

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  onSave(docu) {
    this.loadAgreementFile();
    //this.props.history.push(docu);
    //window.open(docu, "Data");
    /* let me = this;
    e.preventDefault();
    this.resetError();

    if (this.state.first_name === "") {
      this.setState({
        showAlert: true,
        showAlertText: "First name cannot be empty"
      });
      return;
    }

    if (this.state.last_name === "") {
      this.setState({
        showAlert: true,
        showAlertText: "Last name cannot be empty"
      });
      return;
    }

    if (this.state.email === "") {
      this.setState({
        showAlert: true,
        showAlertText: "Email cannot be empty"
      });
      return;
    }
    //console.log("gg" + JSON.stringify(this.state.selectedOptionType[0].id));

    var opttype_id = 0;
    if (this.state.selectedOptionType[0].id)
      opttype_id = this.state.selectedOptionType[0].id;
    else if (this.state.selectedOptionType[0].id)
      opttype_id = this.state.selectedOptionType.id;

    if (opttype_id === undefined || opttype_id <= 0 || opttype_id === "") {
      this.setState({
        showAlert: true,
        showAlertText: "Type cannot be empty"
      });
      return;
    }

    // Validate e-mail
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(this.state.email)) {
      this.handleError("Enter a valid email address.");
      return;
    }

    var cnt_timezone = 0;
    if (this.state.selectedOptionTimezone.id)
      cnt_timezone = this.state.selectedOptionTimezone.id;
    else if (this.state.selectedOptionTimezone[0])
      cnt_timezone = this.state.selectedOptionTimezone[0].id;

    var dataForm = {
      firstName: this.state.first_name,
      lastName: this.state.last_name,
      title: this.state.title,
      typeId: opttype_id,
      email: this.state.email,
      phone: this.state.phone,
      messaging: this.state.messaging,
      timezoneId: cnt_timezone,
      companyId: Number(sessionStorage.getItem("company_id"))
    };

    console.log(
      UPDATE_AGREEMENT_API + this.state.id + JSON.stringify(dataForm)
    );

    APIAction.putData(
      UPDATE_AGREEMENT_API + this.state.id,
      JSON.stringify(dataForm),
      true
    )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          console.log("Error creating agreement: " + JSON.stringify(response));
          alert("Error creating agreement: " + response.data.message);
          return;
        }
        me.props.history.push("/app/company/agreements");
      })
      .catch(err => console.error(err));*/
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.history.push("/app/company/agreements");
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("-");
  }

  render() {
    const { selectedOptionType } = this.state;

    var showhid = {
      display: this.state.isHidden ? "block" : "none"
    };

    return (
      <Page>
        <Row>
          <Col size={12}>
            <section className="panel panel-default m-t-md">
              <Row>
                <center>
                  <h2>Agreement Information</h2>
                </center>
                <Col size={2}> </Col>
                <Col size={8}>
                  <div className="panel-body">
                    {this.state.showAlert ? (
                      <div className="alert alert-danger" role="alert">
                        <p className="login-alert">
                          {this.state.showAlertText}
                        </p>
                      </div>
                    ) : null}
                    <form className="form-horizontal">
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Name</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleName(e)}
                            placeholder="-"
                            value={this.state.name}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Type</label>

                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder=""
                            value={selectedOptionType}
                            onChange={this.handleTypeChange}
                            options={this.state.type_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                            isDisabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Status</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleStatus(e)}
                            placeholder="-"
                            value={this.state.status}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Validity
                        </label>
                        <div className="col-sm-10">
                          <div className="col-sm-1 control-label">From</div>
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              onChange={e => this.handleValidityFrom(e)}
                              placeholder="-"
                              value={
                                this.state.validity_from
                                  ? this.formatDate(this.state.validity_from)
                                  : ""
                              }
                              disabled={this.state.isMem}
                            />
                          </div>
                          <div className="col-sm-1 control-label">To</div>
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              onChange={e => this.handleValidityTo(e)}
                              placeholder="-"
                              value={
                                this.state.validity_to
                                  ? Date(this.state.validity_to)
                                  : ""
                              }
                              disabled={this.state.isMem}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">Notes</label>
                        <div className="col-sm-10">
                          <textarea
                            className="form-control"
                            onChange={e => this.handleNotes(e)}
                            value={this.state.notes || ""}
                            disabled={this.state.isMem}
                            style={{ resize: "none" }}
                          />
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                      <center>
                        <h4>Customer Information</h4>
                      </center>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Contact
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleCustomerContact(e)}
                            placeholder="-"
                            value={this.state.customer_contact}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Signed At
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleCustomerSignedAt(e)}
                            placeholder="-"
                            value={this.state.customer_signed_at || ""}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Initial Payment
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleCustomerInitialPayment(e)}
                            placeholder="-"
                            value={this.state.customer_initial_payment || ""}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Periodic Payments
                        </label>
                        <div className="col-sm-10">
                          <div className="col-sm-1 control-label">Fee</div>
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              onChange={e =>
                                this.handleCustomerPeriodicPaymentsFee(e)
                              }
                              placeholder="-"
                              value={
                                this.state.customer_periodicpaymentsfee || ""
                              }
                              disabled={this.state.isMem}
                            />
                          </div>
                          <div className="col-sm-1 control-label">Percent</div>
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              onChange={e =>
                                this.handleCustomerPeriodicPaymentsPercent(e)
                              }
                              placeholder="-"
                              value={
                                this.state.customer_periodicpaymentspercent ||
                                ""
                              }
                              disabled={this.state.isMem}
                            />
                          </div>
                        </div>
                      </div>
                      <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                      <center>
                        <h4>Vidillion Information</h4>
                      </center>

                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Contact
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleVidillionContact(e)}
                            placeholder="-"
                            value={this.state.vidillion_contact}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Signed At
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleVidillionSignedAt(e)}
                            placeholder="-"
                            value={this.state.vidillion_signed_at || ""}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Initial Payment
                        </label>

                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e =>
                              this.handleVidillionInitialPayment(e)
                            }
                            placeholder="-"
                            value={this.state.vidillion_initial_payment || ""}
                            disabled={this.state.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Periodic Payments
                        </label>
                        <div className="col-sm-10">
                          <div className="col-sm-1 control-label">Fee</div>
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              onChange={e =>
                                this.handleVidillionPeriodicPaymentsFee(e)
                              }
                              placeholder="-"
                              value={
                                this.state.vidillion_periodicpaymentsfee || ""
                              }
                              disabled={this.state.isMem}
                            />
                          </div>
                          <div className="col-sm-1 control-label">Percent</div>
                          <div className="col-sm-5">
                            <input
                              type="text"
                              className="form-control"
                              onChange={e =>
                                this.handleVidillionPeriodicPaymentsPercent(e)
                              }
                              placeholder="-"
                              value={
                                this.state.vidillion_periodicpaymentspercent ||
                                ""
                              }
                              disabled={this.state.isMem}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-6 col-sm-offset-5">
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ marginRight: "2em" }}
                            onClick={e => this.onSave(this.state.documentation)}
                          >
                            Download
                          </button>
                          <button
                            type="submit"
                            className="btn btn-default m-r-sm"
                            onClick={e => this.handleCancel(e)}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Col>
              </Row>
            </section>
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
)(AgreementDetail);
