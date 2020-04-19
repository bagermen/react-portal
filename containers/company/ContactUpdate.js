import React from "react";
import { Row, Col, Page } from "../../components/ui/Layout";
import { withRouter } from "react-router";
import Input from "../../components/ui/Input";
import Select from "react-select";
import ReactModal from "react-modal";

import APIAction from "../../services/APIAction";

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
const UPDATE_CONTACT_API = "private/contact/";
const GET_CONTACT_API = "private/contact/";

const getValue = (opts, val) => opts.find(o => o.id === val);

class UpdateContact extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      title: "",
      email: "",
      phone: "",
      messaging: "",
      selectedOptionType: 0,
      type_list: [],
      timezone_list: [],
      selectedOptionTimezone: 0,
      type_id: 0,
      timezone_id: 0,
      showAlert: false,
      showAlertText: ""
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
    this.reloadTimezones();
    this.loadContact();
  }

  loadContact() {
    var contact_id = this.props.match.params.id;

    APIAction.getData(GET_CONTACT_API + contact_id, true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        console.log(GET_CONTACT_API + contact_id + JSON.stringify(response));

        this.setState({
          id: contact_id,
          type_id: response.data.typeId,
          first_name: response.data.firstName,
          last_name: response.data.lastName,
          title: response.data.title,
          email: response.data.email,
          phone: response.data.phone,
          messaging: response.data.messaging,
          timezone_id: response.data.timezoneId
        });

        this.reloadTypes();
        this.reloadTimezones();
      })
      .catch(err => console.error(err));
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

  reloadTimezones() {
    APIAction.getData("public/timezones", false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ timezone_list: response.data });
        this.selectTimezone();
      })
      .catch(err => console.error(err));
  }

  selectTimezone() {
    var selectedTimezone = [];
    if (this.state.timezone_id) {
      selectedTimezone.push(
        getValue(this.state.timezone_list, this.state.timezone_id)
      );
    }
    this.setState({ selectedOptionTimezone: selectedTimezone });
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

  onSave(e) {
    let me = this;
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

    console.log(UPDATE_CONTACT_API + this.state.id + JSON.stringify(dataForm));

    APIAction.putData(
      UPDATE_CONTACT_API + this.state.id,
      JSON.stringify(dataForm),
      true
    )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          console.log("Error creating contact: " + JSON.stringify(response));
          alert("Error creating contact: " + response.data.message);
          return;
        }
        me.props.history.push("/app/company/contacts");
      })
      .catch(err => console.error(err));
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.history.push("/app/company/contacts");
  }

  render() {
    const { selectedOptionType, selectedOptionTimezone } = this.state;

    var showhid = {
      display: this.state.isHidden ? "block" : "none"
    };

    return (
      <Page>
        <Row>
          <Col size={12}>
            <section className="panel panel-default m-t-md">
              <Row>
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
                        <label className="col-sm-2 control-label">
                          First Name*
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleFirstName(e)}
                            placeholder="First Name"
                            value={this.state.first_name}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Last Name*
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleLastName(e)}
                            placeholder="Last Name"
                            value={this.state.last_name}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Title</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleTitle(e)}
                            placeholder="Title"
                            value={this.state.title || ""}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Type*</label>

                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select Type --"
                            value={selectedOptionType}
                            onChange={this.handleTypeChange}
                            options={this.state.type_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Email*</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleEmail(e)}
                            placeholder="Email"
                            value={this.state.email}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">Phone</label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handlePhone(e)}
                            placeholder="Phone"
                            value={this.state.phone || ""}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Messaging
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleMessaging(e)}
                            placeholder="Messaging"
                            value={this.state.messaging || ""}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="col-sm-2 control-label">
                          Timezone
                        </label>

                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select Timezone --"
                            value={selectedOptionTimezone}
                            onChange={this.handleTimeZoneChange}
                            options={this.state.timezone_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-6 col-sm-offset-5">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginRight: "2em" }}
                            onClick={e => this.onSave(e)}
                          >
                            Save changes
                          </button>
                          <button
                            type="submit"
                            className="btn btn-default m-r-sm"
                            onClick={e => this.handleCancel(e)}
                          >
                            Cancel
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

export default withRouter(UpdateContact);
