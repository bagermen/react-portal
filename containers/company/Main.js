import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose } from "redux";
import { Row, Col, Page } from "../../components/ui/Layout";
import { Button, Panel } from "../../components/ui/";
import Select from "react-select";
import Input from "../../components/ui/Input";
import APIAction from "../../services/APIAction";
import withAuth from "../../services/auth/withAuth";

const colourStyles = {
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#3399ff" : "#293a47",
    ":hover": {
      backgroundColor: "#3399ff"
    }
  })
};

const UPDATE_COMPANY_API = "private/company/";
const GET_COMPANY_API = "private/company/";

const getValue = (opts, val) => opts.find(o => o.id === val);

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company_id: 0,
      type_id: 0,
      company_name: "",
      company_description: "",
      selectedOptionCountry: "",
      selectedOptionState: 0,
      selectedOptionCity: 0,
      country_list: [],
      state_list: [],
      city_list: [],
      company_country_id: 0,
      company_state_id: 0,
      company_city_id: 0,
      company_address: "",
      company_zipcode: "",
      company_email: "",
      company_phone: "",
      selectedOptionCompanyLegalType: 0,
      companylegaltype_list: [],
      legalname: "",
      legaltype_extra: "",
      legaltax_id: "",
      legal_comments: "",
      bankname: "",
      routingnumber: "",
      accountnumber: "",
      paypalemail: "",
      account_type: "",
      showAlert: false,
      showAlertText: "",
      showSuccess: false,
      showSuccessText: "",
      isDisabled: false
    };

    this.companynameChange = this.companynameChange.bind(this);
    this.handleCompanyDescription = this.handleCompanyDescription.bind(this);
    this.companyaddressChange = this.companyaddressChange.bind(this);
    this.companyzipcodeChange = this.companyzipcodeChange.bind(this);
    this.companyemailChange = this.companyemailChange.bind(this);
    this.companyphoneChange = this.companyphoneChange.bind(this);

    this.legalnameChange = this.legalnameChange.bind(this);
    this.legaltypeextraChange = this.legaltypeextraChange.bind(this);
    this.legaltaxidChange = this.legaltaxidChange.bind(this);
    this.legalcommentsChange = this.legalcommentsChange.bind(this);

    this.banknameChange = this.banknameChange.bind(this);
    this.routingnumberChange = this.routingnumberChange.bind(this);
    this.accountnumberChange = this.accountnumberChange.bind(this);
    this.paypalemailChange = this.paypalemailChange.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.bankaccountChange = this.bankaccountChange.bind(this);
    this.paypalChange = this.paypalChange.bind(this);
  }

  componentDidMount() {
    this.loadCompany(this.props.company_id);
  }

  loadCompany(company_id) {
    APIAction.getData(GET_COMPANY_API + company_id, true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        this.setState({
          id: company_id,
          type_id: response.data.typeId,
          company_name: response.data.name,
          company_country_id: response.data.countryId,
          company_address: response.data.address,
          legalname: response.data.legalName,
          legal_type_id: response.data.legalTypeId
        });

        if (response.data.stateId)
          this.setState({ company_state_id: response.data.stateId });

        if (response.data.cityId)
          this.setState({ company_city_id: response.data.cityId });

        if (response.data.zipcode)
          this.setState({ company_zipcode: response.data.cityId });

        if (response.data.email)
          this.setState({ company_email: response.data.email });

        if (response.data.phone)
          this.setState({ company_phone: response.data.phone });

        if (response.data.description)
          this.setState({ company_description: response.data.description });

        if (response.data.legalTypeExtra)
          this.setState({ legaltype_extra: response.data.legalTypeExtra });

        if (response.data.legalComments)
          this.setState({ legal_comments: response.data.legalComments });

        if (response.data.legalTaxId)
          this.setState({ legaltax_id: response.data.legalTaxId });

        if (response.data.paypalEmail)
          this.setState({ paypalemail: response.data.paypalEmail });

        if (response.data.bankName)
          this.setState({ bankname: response.data.bankName });

        if (response.data.bankRoutingNumber)
          this.setState({ routingnumber: response.data.bankRoutingNumber });

        if (response.data.bankAccountNumber)
          this.setState({ accountnumber: response.data.bankAccountNumber });

        if (response.data.accountTypeId === 1)
          this.setState({ account_type: "paypal" });
        else if (response.data.accountTypeId === 2)
          this.setState({ account_type: "bank_account" });

        this.reloadCountries();
        this.reloadStates(this.state.company_country_id);
        this.reloadCities(this.state.company_state_id);
        this.reloadLegalTypes();
      })
      .catch(err => console.error(err));
  }

  reloadCountries() {
    APIAction.getData("public/countries", false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ country_list: response.data });
        this.selectCountries();
      })
      .catch(err => console.error(err));
  }

  selectCountries() {
    this.setState({
      selectedOptionCountry: getValue(
        this.state.country_list,
        this.state.company_country_id
      )
    });
  }

  reloadStates(countryID) {
    APIAction.getData("public/states?country=" + countryID, false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ state_list: response.data });
        this.selectStates();
      })
      .catch(err => console.error(err));
  }

  selectStates() {
    this.setState({
      selectedOptionState: getValue(
        this.state.state_list,
        this.state.company_state_id
      )
    });
  }

  reloadCities(stateID) {
    if (stateID > 0) {
      APIAction.getData("public/cities?state=" + stateID, false)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            alert("Invalid response from back-end API: " + response.data.message);
            console.error("Back-end error: " + JSON.stringify(response));
            return;
          }
          this.setState({ city_list: response.data });
          this.selectCities();
        })
        .catch(err => console.error(err));
      }
  }

  selectCities() {
    this.setState({
      selectedOptionCity: getValue(
        this.state.city_list,
        this.state.company_city_id
      )
    });
  }

  reloadLegalTypes() {
    APIAction.getData("public/company-legal-types", false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ companylegaltype_list: response.data });
        this.selectLegalType();
      })
      .catch(err => console.error(err));
  }

  selectLegalType() {
    this.setState({
      selectedOptionCompanyLegalType: getValue(
        this.state.companylegaltype_list,
        this.state.legal_type_id
      )
    });
  }

  companynameChange(e) {
    this.setState({ company_name: e.target.value });
  }

  handleCompanyDescription(e) {
    this.setState({ company_description: e.target.value });
  }

  handleCountryChange = selectedOptionCountry => {
    this.setState({
      selectedOptionState: 0,
      selectedOptionCity: 0,
      state_list: [],
      city_list: []
    });
    this.setState({ selectedOptionCountry });
    this.reloadStates(selectedOptionCountry.id);
  };

  handleStateChange = selectedOptionState => {
    this.setState({
      selectedOptionCity: 0,
      city_list: []
    });
    this.setState({ selectedOptionState });
    this.reloadCities(selectedOptionState.id);
  };

  handleCityChange = selectedOptionCity => {
    this.setState({ selectedOptionCity });
  };

  companyaddressChange(e) {
    this.setState({ company_address: e.target.value });
  }

  companyzipcodeChange(e) {
    this.setState({ company_zipcode: e.target.value.trim() });
  }

  companyemailChange(e) {
    this.setState({ company_email: e.target.value.trim() });
  }

  companyphoneChange(e) {
    this.setState({ company_phone: e.target.value });
  }

  handleCompanyLegalTypeChange = selectedOptionCompanyLegalType => {
    this.setState({ selectedOptionCompanyLegalType });
  };

  legalnameChange(e) {
    this.setState({ legalname: e.target.value });
  }

  legaltypeextraChange(e) {
    this.setState({ legaltype_extra: e.target.value });
  }

  legaltaxidChange(e) {
    this.setState({ legaltax_id: e.target.value });
  }

  legalcommentsChange(e) {
    this.setState({ legal_comments: e.target.value });
  }

  banknameChange(e) {
    this.setState({ bankname: e.target.value });
  }

  routingnumberChange(e) {
    this.setState({ routingnumber: e.target.value.trim() });
  }

  accountnumberChange(e) {
    this.setState({ accountnumber: e.target.value.trim() });
  }

  paypalemailChange(e) {
    this.setState({ paypalemail: e.target.value.trim() });
  }

  bankaccountChange(e) {
    this.setState({ account_type: "bank_account" });
  }

  paypalChange(e) {
    this.setState({ account_type: "paypal" });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.resetError();
    if (this.state.company_name.trim() === "") {
      this.handleError(
        "Company Name cannot be empty. Please, enter Company Name."
      );
      return;
    }
    if (
      this.state.selectedOptionCountry.id === undefined ||
      this.state.selectedOptionCountry.id <= 0 ||
      this.state.selectedOptionCountry.id === ""
    ) {
      this.handleError("Country cannot be empty. Please, select Country.");
      return;
    }
    if (this.state.company_address.trim() === "") {
      this.handleError(
        "Company Address cannot be empty. Please, enter Company Address."
      );
      return;
    }

    if (
      this.state.selectedOptionCompanyLegalType.id === undefined ||
      this.state.selectedOptionCompanyLegalType.id <= 0 ||
      this.state.selectedOptionCompanyLegalType.id === ""
    ) {
      this.handleError(
        "Legal Type cannot be empty. Please, select Legal Type."
      );
      return;
    }

    if (this.state.legalname.trim() === "") {
      this.handleError("Legal Name cannot be empty. Please, enter Legal Name.");
      return;
    }

    if (this.state.legaltax_id.trim() === "") {
      this.handleError(
        "Legal Tax Id cannot be empty. Please, enter Legal Tax Id."
      );
      return;
    }

    if (this.state.account_type.trim() === "") {
      this.handleError(
        "Account Information cannot be empty. Please, select Account Information."
      );
      return;
    }
    if (this.state.account_type === "bank_account") {
      if (this.state.bankname.trim() === "") {
        this.handleError("Bank Name cannot be empty. Please, enter Bank Name.");
        return;
      }
      if (this.state.accountnumber.trim() === "") {
        this.handleError(
          "Account Number cannot be empty. Please, enter Account Number."
        );
        return;
      }
      this.setState({ paypalemail: "" });
    } else if (this.state.account_type === "paypal") {
      if (this.state.paypalemail.trim() === "") {
        this.handleError(
          "Paypal Email cannot be empty. Please, enter Paypal Email."
        );
        return;
      }
      this.setState({ bankname: "", routingnumber: "", accountnumber: "" });
    }

    if (this.state.company_email) {
      // Validate e-mail
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(this.state.company_email)) {
        this.handleError("Enter a valid email address.");
        return;
      }
    }

    this.setState({ isDisabled: true });

    var cmp_ctry = 0;
    if (this.state.selectedOptionCountry.id)
      cmp_ctry = this.state.selectedOptionCountry.id;

    var cmp_stat = 0;
    if (this.state.selectedOptionState && this.state.selectedOptionState.id)
      cmp_stat = this.state.selectedOptionState.id;

    var cmp_city = 0;
    if (this.state.selectedOptionCity && this.state.selectedOptionCity.id)
      cmp_city = this.state.selectedOptionCity.id;

    var cmp_legl_typ = 0;
    if (this.state.selectedOptionCompanyLegalType.id)
      cmp_legl_typ = this.state.selectedOptionCompanyLegalType.id;

    var cmp_accnt_typ = 1;
    if (this.state.account_type === "bank_account") cmp_accnt_typ = 2;

    var dataForm = {
      typeId: this.state.type_id,
      name: this.state.company_name,
      description: this.state.company_description,
      countryId: cmp_ctry,
      stateId: cmp_stat,
      cityId: cmp_city,
      address: this.state.company_address,
      zipcode: Number(this.state.company_zipcode),
      email: this.state.company_email,
      phone: this.state.company_phone,
      legalName: this.state.legalname,
      legalComments: this.state.legal_comments,
      legalTypeId: cmp_legl_typ,
      legalTypeExtra: this.state.legaltype_extra,
      legalTaxId: this.state.legaltax_id,
      accountTypeId: cmp_accnt_typ,
      paypalEmail: this.state.paypalemail,
      bankName: this.state.bankname,
      bankRoutingNumber: this.state.routingnumber,
      bankAccountNumber: this.state.accountnumber
    };

    APIAction.putData(
      UPDATE_COMPANY_API + this.state.id,
      JSON.stringify(dataForm),
      true
    )
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          if (response.data.message) {
            this.handleError(response.data.message)
          } else {
            this.handleError("Error while cancelling company registration (" + response.status + ")")
          }
          return
        }

        this.setState({
          showSuccess: true,
          showSuccessText: "Company info successfully updated"
        });
        window.scrollTo(0, 0);
      })
      .catch(err => {
        console.error(err);
        this.setState({ isDisabled: false });
      });
  }

  handleCancel() {
    this.props.history.push("/");
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    console.log("ERROR: " + err);
    window.scrollTo(0, 0);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  render() {
    const {
      selectedOptionCountry,
      selectedOptionState,
      selectedOptionCity,
      selectedOptionCompanyLegalType,
      isDisabled
    } = this.state;

    var bankaccnt_hid = {
      display: "none"
    };

    var paypal_hid = {
      display: "none"
    };

    if (this.state.account_type === "bank_account") {
      var bankaccnt_hid = {
        display: "block"
      };
    } else if (this.state.account_type === "paypal") {
      var paypal_hid = {
        display: "block"
      };
    }

    var but_hid = {
      display: this.props.isMem ? "none" : "block"
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
                    {this.state.showSuccess ? (
                    <div className="alert alert-success" role="alert">
                      <p className="login-alert">{this.state.showSuccessText}</p>
                    </div>
                    ) : null}
                    <form role="form" className="form-horizontal">
                    <center>
                      <h3>Basic Information</h3>
                    </center>
                    <div className="form-group">
                      <label className="control-label col-sm-2">
                        Company Name*
                      </label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          onChange={this.companynameChange}
                          value={this.state.company_name}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Description</label>
                      <div className="col-sm-10">
                        <textarea
                          className="form-control"
                          onChange={e => this.handleCompanyDescription(e)}
                          value={this.state.company_description}
                          disabled={this.props.isMem}
                          style={{ resize: "none" }}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Country*</label>
                      <div className="col-sm-10">
                        <Select
                          id="cou"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="-- Select Country --"
                          value={selectedOptionCountry}
                          onChange={this.handleCountryChange}
                          options={this.state.country_list}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          styles={colourStyles}
                          isDisabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">State</label>
                      <div className="col-sm-10">
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="-- Select State --"
                          value={selectedOptionState}
                          onChange={this.handleStateChange}
                          options={this.state.state_list}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          styles={colourStyles}
                          isDisabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">City</label>
                      <div className="col-sm-10">
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="-- Select City --"
                          value={selectedOptionCity}
                          onChange={this.handleCityChange}
                          options={this.state.city_list}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          styles={colourStyles}
                          isDisabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Address*</label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          disabled={this.props.isMem}
                          onChange={this.companyaddressChange}
                          value={this.state.company_address}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">ZIP Code</label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="number"
                          onChange={this.companyzipcodeChange}
                          value={this.state.company_zipcode || ""}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">
                        Company E-mail
                      </label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="email"
                          onChange={this.companyemailChange}
                          value={this.state.company_email}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">
                        Company Phone
                      </label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          onChange={this.companyphoneChange}
                          value={this.state.company_phone}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                    <center>
                      <h3>Legal Information (based on W-9 form or similar)</h3>
                    </center>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Legal Type*</label>
                      <div className="col-sm-10">
                        <Select
                          id="cou"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          placeholder="-- Select Company Type --"
                          value={selectedOptionCompanyLegalType}
                          onChange={this.handleCompanyLegalTypeChange}
                          options={this.state.companylegaltype_list}
                          getOptionLabel={option => option.name}
                          getOptionValue={option => option.id}
                          styles={colourStyles}
                          isDisabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Legal Name*</label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          onChange={this.legalnameChange}
                          value={this.state.legalname}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">
                        Legal Type Extra
                      </label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          onChange={this.legaltypeextraChange}
                          value={this.state.legaltype_extra}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">
                        Legal Tax Id*
                      </label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          onChange={this.legaltaxidChange}
                          value={this.state.legaltax_id}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">
                        Legal Comments
                      </label>
                      <div className="col-sm-10">
                        <Input
                          placeholder=""
                          type="text"
                          onChange={this.legalcommentsChange}
                          value={this.state.legal_comments}
                          disabled={this.props.isMem}
                        />
                      </div>
                    </div>
                    <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                    <center>
                      <h3>Accounting Information</h3>
                    </center>
                    <div className="form-group">
                      <div className="col-sm-6 text-right">
                        <input
                          type="radio"
                          name="accnt_typ"
                          checked={
                            this.state.account_type === "bank_account"
                              ? true
                              : false
                          }
                          onChange={this.bankaccountChange}
                          disabled={this.props.isMem}
                        />{" "}
                        Bank Account
                      </div>
                      <div className="col-sm-6 text-left">
                        <input
                          type="radio"
                          name="accnt_typ"
                          checked={
                            this.state.account_type === "paypal" ? true : false
                          }
                          onChange={this.paypalChange}
                          disabled={this.props.isMem}
                        />{" "}
                        Paypal
                      </div>
                    </div>
                    <div style={bankaccnt_hid}>
                      <div className="form-group">
                        <label className="control-label col-sm-2">Bank Name*</label>
                        <div className="col-sm-10">
                          <Input
                            placeholder=""
                            type="text"
                            onChange={this.banknameChange}
                            value={this.state.bankname}
                            disabled={this.props.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="control-label col-sm-2">
                          Routing Number*
                        </label>
                        <div className="col-sm-10">
                          <Input
                            placeholder=""
                            type="text"
                            onChange={this.routingnumberChange}
                            value={this.state.routingnumber}
                            disabled={this.props.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="control-label col-sm-2">
                          Account Number*
                        </label>
                        <div className="col-sm-10">
                          <Input
                            placeholder=""
                            type="text"
                            onChange={this.accountnumberChange}
                            value={this.state.accountnumber}
                            disabled={this.props.isMem}
                          />
                        </div>
                      </div>
                    </div>
                    <div style={paypal_hid}>
                      <div className="form-group">
                        <label className="control-label col-sm-2">
                          Paypal Email
                        </label>
                        <div className="col-sm-10">
                          <Input
                            placeholder=""
                            type="email"
                            onChange={this.paypalemailChange}
                            value={this.state.paypalemail}
                            disabled={this.props.isMem}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group" style={but_hid}>
                      <div className="col-sm-12 text-center">
                        <Button
                          label="Save changes"
                          style={{ marginRight: "2em" }}
                          color="btn-info"
                          onClick={this.handleSubmit}
                          disabled={isDisabled}
                        />
                        <Button label="Cancel" onClick={this.handleCancel} />
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
    company_id: state.user['custom:company_id'],
    isMem: state.user.isMem
  };
}

export default compose(
  withRouter,
  withAuth,
  connect(mapStateToProps)
)(Main);
