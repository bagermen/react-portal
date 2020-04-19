import React from "react";
import { Button, Panel } from "../../components/ui";
import { Row, Page } from "../../components/ui/Layout";
import Input from "../../components/ui/Input";
import { withRouter } from "react-router";
import Select from "react-select";
import ReCAPTCHA from "react-google-recaptcha";
import APIAction from "../../services/APIAction";
import { compose } from "redux";
import withAuth from '../../services/auth/withAuth';

const colourStyles = {
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? "#3399ff" : "#293a47",
    ":hover": {
      backgroundColor: "#3399ff"
    }
  })
};

const CREATE_COMPANY_API = "public/company-new-vsp";

class RegisterVSP extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      company_name: "",
      company_description: "",
      selectedOptionCountry: "",
      selectedOptionState: 0,
      selectedOptionCity: 0,
      country_list: [],
      state_list: [],
      city_list: [],
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
      account_type: "bank_account",
      recaptcha_token: "",
      showAlert: false,
      showAlertText: "",
      isDisabled: false
    };

    this.companyNameChange = this.companyNameChange.bind(this);
    this.companyDescriptionChange = this.companyDescriptionChange.bind(this);
    this.companyAddressChange = this.companyAddressChange.bind(this);
    this.companyZipcodeChange = this.companyZipcodeChange.bind(this);
    this.companyEmailChange = this.companyEmailChange.bind(this);
    this.companyPhoneChange = this.companyPhoneChange.bind(this);
    this.companyCountryChange = this.companyCountryChange.bind(this);
    this.companyStateChange = this.companyStateChange.bind(this);
    this.companyCityChange = this.companyCityChange.bind(this);

    this.legalNameChange = this.legalNameChange.bind(this);
    this.legalTypeChange = this.legalTypeChange.bind(this);
    this.legalTypeExtraChange = this.legalTypeExtraChange.bind(this);
    this.legalTaxIdChange = this.legalTaxIdChange.bind(this);
    this.legalCommentsChange = this.legalCommentsChange.bind(this);

    this.bankAccountChange = this.bankAccountChange.bind(this);
    this.bankNameChange = this.bankNameChange.bind(this);
    this.bankRoutingNumberChange = this.bankRoutingNumberChange.bind(this);
    this.bankAccountNumberChange = this.bankAccountNumberChange.bind(this);
    this.paypalChange = this.paypalChange.bind(this);
    this.paypalEmailChange = this.paypalEmailChange.bind(this);

    this.recaptchaChange = this.recaptchaChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleError = this.handleError.bind(this);
    this.resetError = this.resetError.bind(this);
    this.onError = this.onError.bind(this);
  }

  // This function will check if any user is already logged in or not
  componentWillMount() {
    this.reloadCountries();
    this.reloadLegalTypes();
    this.reloadContactTypes();
    this.reloadTimezones();
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
      })
      .catch(err => console.error(err));
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
      })
      .catch(err => console.error(err));
  }

  reloadCities(stateID) {
    APIAction.getData("public/cities?state=" + stateID, false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ city_list: response.data });
      })
      .catch(err => console.error(err));
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
      })
      .catch(err => console.error(err));
  }

  reloadContactTypes() {
    APIAction.getData("public/contacttypes", false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ positiontype_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadTimezones() {
    APIAction.getData("public/timezones", false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ timezonetype_list: response.data });
      })
      .catch(err => console.error(err));
  }

  companyNameChange(e) {
    this.setState({ company_name: e.target.value });
  }

  companyDescriptionChange(e) {
    this.setState({ company_description: e.target.value });
  }

  companyCountryChange = selectedOptionCountry => {
    this.setState({
      selectedOptionState: 0,
      selectedOptionCity: 0,
      state_list: [],
      city_list: []
    });
    this.setState({ selectedOptionCountry });
    this.reloadStates(selectedOptionCountry.id);
  };

  companyStateChange = selectedOptionState => {
    this.setState({
      selectedOptionCity: 0,
      city_list: []
    });
    this.setState({ selectedOptionState });
    this.reloadCities(selectedOptionState.id);
  };

  companyCityChange = selectedOptionCity => {
    this.setState({
      selectedOptionDMA: ""
    });
    this.setState({ selectedOptionCity });
  };

  companyAddressChange(e) {
    this.setState({ company_address: e.target.value });
  }

  companyZipcodeChange(e) {
    this.setState({ company_zipcode: e.target.value.trim() });
  }

  companyEmailChange(e) {
    this.setState({ company_email: e.target.value.trim() });
  }

  companyPhoneChange(e) {
    this.setState({ company_phone: e.target.value });
  }

  legalTypeChange = selectedOptionCompanyLegalType => {
    this.setState({ selectedOptionCompanyLegalType });
  };

  legalNameChange(e) {
    this.setState({ legalname: e.target.value });
  }

  legalTypeExtraChange(e) {
    this.setState({ legaltype_extra: e.target.value });
  }

  legalTaxIdChange(e) {
    this.setState({ legaltax_id: e.target.value });
  }

  legalCommentsChange(e) {
    this.setState({ legal_comments: e.target.value });
  }

  bankAccountChange(e) {
    this.setState({ account_type: "bank_account" });
  }

  bankNameChange(e) {
    this.setState({ bankname: e.target.value });
  }

  bankRoutingNumberChange(e) {
    this.setState({ routingnumber: e.target.value.trim() });
  }

  bankAccountNumberChange(e) {
    this.setState({ accountnumber: e.target.value.trim() });
  }

  paypalChange(e) {
    this.setState({ account_type: "paypal" });
  }

  paypalEmailChange(e) {
    this.setState({ paypalemail: e.target.value.trim() });
  }

  recaptchaChange(value) {
    this.setState({ recaptcha_token: value });
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

    if (this.state.recaptcha_token === "") {
      this.handleError("Please validate that you are not a robot.");
      return;
    }

    this.setState({ isDisabled: true });

    var cmp_ctry = 0;
    if (this.state.selectedOptionCountry.id)
      cmp_ctry = this.state.selectedOptionCountry.id;

    var cmp_stat = 0;
    if (this.state.selectedOptionState.id)
      cmp_stat = this.state.selectedOptionState.id;

    var cmp_city = 0;
    if (this.state.selectedOptionCity.id)
      cmp_city = this.state.selectedOptionCity.id;

    var cmp_legl_typ = 0;
    if (this.state.selectedOptionCompanyLegalType.id)
      cmp_legl_typ = this.state.selectedOptionCompanyLegalType.id;

    var cmp_accnt_typ = 1;
    if (this.state.account_type === "bank_account") cmp_accnt_typ = 2;

    var dataForm = {
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
      bankAccountNumber: this.state.accountnumber,
    };
    APIAction.postData(CREATE_COMPANY_API, JSON.stringify(dataForm), false)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          if (response.data.message) {
            this.handleError("Error while registering VSP: " + response.data.message)
          } else {
            this.handleError("Error while registering VSP (" + response.status + ")")
          }
          return;
        }
        console.log("New VSP registered: " + response.data.id)
        this.props.history.push({
          pathname: "/signup",
          search: "",
          state: { companyId: response.data.id }
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isDisabled: false });
        this.handleError(err)
      });
  }

  handleCancel() {
    this.props.history.push("/");
  }

  handleError(err) {
    this.setState({ showAlert: true, showAlertText: "" + err });
    window.scrollTo(0, 0);
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  onError(err) {
    if (err) {
      if (err.message) {
        this.handleError(err.message);
      } else {
        this.handleError(
          "Unable to sign up. Please, try again later or contact an administrator."
        );
      }
    }
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

    return (
      <Page>
        <Row>
          <div className="col-md-3" />

          <div className="col-md-6" style={{ marginTop: "30px" }}>
            <Panel className="rounded">
              <center>
                <h1>Step 1: Register a new VSP Company</h1>
              </center>
              <hr style={{ borderTop: "1px solid #FFFFFF" }} />
              {this.state.showAlert ? (
                <div className="alert alert-danger" role="alert">
                  <p className="login-alert">{this.state.showAlertText}</p>
                </div>
              ) : null}

              <form role="form" className="form-horizontal">
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Company Name*
                  </label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.companyNameChange}
                      value={this.state.company_name}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Description</label>
                  <div className="col-sm-9">
                    <textarea
                      className="form-control"
                      onChange={e => this.companyDescriptionChange(e)}
                      value={this.state.company_description}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Country*</label>
                  <div className="col-sm-9">
                    <Select
                      id="cou"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="-- Select Country --"
                      value={selectedOptionCountry}
                      onChange={this.companyCountryChange}
                      options={this.state.country_list}
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.id}
                      styles={colourStyles}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">State</label>
                  <div className="col-sm-9">
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="-- Select State --"
                      value={selectedOptionState}
                      onChange={this.companyStateChange}
                      options={this.state.state_list}
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.id}
                      styles={colourStyles}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">City</label>
                  <div className="col-sm-9">
                    <Select
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="-- Select City --"
                      value={selectedOptionCity}
                      onChange={this.companyCityChange}
                      options={this.state.city_list}
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.id}
                      styles={colourStyles}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Address*</label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.companyAddressChange}
                      value={this.state.company_address}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">ZIP Code</label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.companyZipcodeChange}
                      value={this.state.company_zipcode}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Company E-mail
                  </label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="email"
                      onChange={this.companyEmailChange}
                      value={this.state.company_email}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Company Phone
                  </label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.companyPhoneChange}
                      value={this.state.company_phone}
                    />
                  </div>
                </div>
                <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                <center>
                  <h4>Legal Information (based on W-9 form or similar)</h4>
                </center>
                <div className="form-group">
                  <label className="control-label col-sm-3">Legal Type*</label>
                  <div className="col-sm-9">
                    <Select
                      id="cou"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      placeholder="-- Select Company Type --"
                      value={selectedOptionCompanyLegalType}
                      onChange={this.legalTypeChange}
                      options={this.state.companylegaltype_list}
                      getOptionLabel={option => option.name}
                      getOptionValue={option => option.id}
                      styles={colourStyles}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">Legal Name*</label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.legalNameChange}
                      value={this.state.legalname}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Legal Type Extra
                  </label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.legalTypeExtraChange}
                      value={this.state.legaltype_extra}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Legal Tax Id*
                  </label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.legalTaxIdChange}
                      value={this.state.legaltax_id}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="control-label col-sm-3">
                    Legal Comments
                  </label>
                  <div className="col-sm-9">
                    <Input
                      placeholder=""
                      type="text"
                      onChange={this.legalCommentsChange}
                      value={this.state.legal_comments}
                    />
                  </div>
                </div>
                <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                <center>
                  <h4>Accounting Information</h4>
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
                      onChange={this.bankAccountChange}
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
                    />{" "}
                    Paypal
                  </div>
                </div>
                <div style={bankaccnt_hid}>
                  <div className="form-group">
                    <label className="control-label col-sm-3">Bank Name*</label>
                    <div className="col-sm-9">
                      <Input
                        placeholder=""
                        type="text"
                        onChange={this.bankNameChange}
                        value={this.state.bankname}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-3">
                      Routing Number
                    </label>
                    <div className="col-sm-9">
                      <Input
                        placeholder=""
                        type="text"
                        onChange={this.bankRoutingNumberChange}
                        value={this.state.routingnumber}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="control-label col-sm-3">
                      Account Number*
                    </label>
                    <div className="col-sm-9">
                      <Input
                        placeholder=""
                        type="text"
                        onChange={this.bankAccountNumberChange}
                        value={this.state.accountnumber}
                      />
                    </div>
                  </div>
                </div>
                <div style={paypal_hid}>
                  <div className="form-group">
                    <label className="control-label col-sm-3">
                      Paypal Email
                    </label>
                    <div className="col-sm-9">
                      <Input
                        placeholder=""
                        type="email"
                        onChange={this.paypalEmailChange}
                        value={this.state.paypalemail}
                      />
                    </div>
                  </div>
                </div>
                <hr style={{ borderTop: "1px solid #FFFFFF" }} />
                <div className="form-group">
                  <div id="cap_div" className="col-sm-12 text-center">
                    <ReCAPTCHA
                      sitekey="6LdS0psUAAAAAMDbypHsLShk-Zp6omR0gUSsng87"
                      badge="bottomleft"
                      onChange={this.recaptchaChange}
                    />
                  </div>
                </div>

                <div className="form-group" />

                <div className="form-group">
                  <div className="col-sm-12 text-center">
                    <button
                      label="Register"
                      style={{ marginRight: "2em" }}
                      className="btn btn-info"
                      onClick={this.handleSubmit}
                      disabled={isDisabled}
                    >
                      Accept
                    </button>
                    <Button label="Cancel" onClick={this.handleCancel} />
                  </div>
                </div>
              </form>
            </Panel>
          </div>
          <div className="col-md-3" />
        </Row>
      </Page>
    );
  }
}

export default compose(
  withRouter,
  withAuth
)(RegisterVSP);