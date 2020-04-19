import React from "react";
import { Row, Col, Page } from "../../components/ui/Layout";
import { withRouter } from "react-router";
import Input from "../../components/ui/Input";
import Select from "react-select";
import ReactModal from "react-modal";

import APIAction from "../../services/APIAction";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "100%",
    maxWidth: "500px"
  }
};

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
const CREATE_CHANNEL_API = "private/channel";

class CreateChannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      channel_name: "",
      description: "",
      app_id: "",
      app_name: "",
      app_bundle: "",
      app_url: "",
      rate_cpm: 0,
      contenttype_list: [],
      demandtype_list: [],
      vasttype_list: [],
      language_list: [],
      iab_category_list: [],
      user_agent_type_list: [],
      user_agent_system_list: [],
      selectedOptionLanguage: "",
      selectedOptionContentType: "",
      selectedOptionDemandType: "",
      selectedOptionVASTType: "",
      selectedOptionIABCategory: "",
      selectedOptionUserAgentType: "",
      selectedOptionUserAgentOperatingSystem: "",
      selectedOptionContinent: "",
      selectedOptionCountry: "",
      selectedOptionState: "",
      selectedOptionCity: "",
      selectedOptionDMA: "",
      selectedOptionGeolocation: "",
      continent_list: [],
      country_list: [],
      state_list: [],
      city_list: [],
      showAlert: false,
      showAlertText: "",
      isHidden: false,
      showModal: false,
      isDisabled: false
    };

    this.onSave = this.onSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleAppId = this.handleAppId.bind(this);
    this.handleAppName = this.handleAppName.bind(this);
    this.handleAppBundle = this.handleAppBundle.bind(this);
    this.handleAppURL = this.handleAppURL.bind(this);
    this.handleContentTypeChange = this.handleContentTypeChange.bind(this);
    this.handleDemandTypeChange = this.handleDemandTypeChange.bind(this);
    this.handleVASTTypeChange = this.handleVASTTypeChange.bind(this);
    this.handleUserAgentTypeChange = this.handleUserAgentTypeChange.bind(this);
    this.handleUserAgentOperatingSystemChange = this.handleUserAgentOperatingSystemChange.bind(this);
    this.handleChannelStatus = this.handleChannelStatus.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSaveModal = this.handleSaveModal.bind(this);
  }

  // This function will check if any user is already logged in or not
  componentWillMount() {
    this.reloadEnvironmentTypes();
    this.reloadDemandTypes();
    this.reloadVastTypes();
    this.reloadLanguages();
    this.reloadCategories();
    this.reloadUserAgentTypes();
    this.reloadUserAgentOperatingSystems();
    this.reloadContinents();
  }

  reloadEnvironmentTypes() {
    APIAction.getData("private/content_environment_types", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ contenttype_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadDemandTypes() {
    APIAction.getData("private/content_demand_types", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ demandtype_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadVastTypes() {
    APIAction.getData("private/content_vast_types", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ vasttype_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadLanguages() {
    APIAction.getData("private/languages", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ language_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadCategories() {
    APIAction.getData("private/iabcategories", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ iab_category_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadUserAgentTypes() {
    APIAction.getData("private/user_agent_types", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        this.setState({ user_agent_type_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadUserAgentOperatingSystems() {
    APIAction.getData("private/user_agent_systems", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        this.setState({ user_agent_system_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadContinents() {
    APIAction.getData("private/continents", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ continent_list: response.data });
      })
      .catch(err => console.error(err));
  }

  reloadCountries(continentID) {
    APIAction.getData("private/countries?continent=" + continentID, true)
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
    APIAction.getData("private/states?country=" + countryID, true)
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
    APIAction.getData("private/cities?state=" + stateID, true)
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

  toggleHidden() {
    this.setState({
      isHidden: !this.state.isHidden
    });
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({
      selectedOptionContinent: null,
      selectedOptionCountry: null,
      selectedOptionState: null,
      selectedOptionCity: null,
      selectedOptionDMA: "",
      isHidden: false,
      showModal: false
    });
  }

  handleSaveModal() {
    var selOptCon = "";
    var selOptConnm = "";
    if (this.state.selectedOptionContinent) {
      var selOptCon = this.state.selectedOptionContinent.id;
      var selOptConnm = this.state.selectedOptionContinent.name + " ";
    }
    var selOptCou = "";
    var selOptCounm = "";
    if (this.state.selectedOptionCountry) {
      var selOptCou = this.state.selectedOptionCountry.id;
      var selOptCounm = this.state.selectedOptionCountry.name + " ";
    }

    var selOptSta = "";
    var selOptStanm = "";
    if (this.state.selectedOptionState) {
      var selOptSta = this.state.selectedOptionState.id;
      var selOptStanm = this.state.selectedOptionState.name + " ";
    }

    var selOptCit = "";
    var selOptCitnm = "";
    if (this.state.selectedOptionCity) {
      var selOptCit = this.state.selectedOptionCity.id;
      var selOptCitnm = this.state.selectedOptionCity.name + " ";
    }

    var selOptDMA = "";
    if (this.state.selectedOptionDMA) {
      var selOptDMA = this.state.selectedOptionDMA;
    }

    if (this.state.selectedOptionGeolocation) {
      var newgeo = [
        {
          id: [selOptCon, selOptCou, selOptSta, selOptCit],
          name: [selOptConnm, selOptCounm, selOptStanm, selOptCitnm, selOptDMA],
          dma: selOptDMA
        }
      ];
      for (var i = 0; i < this.state.selectedOptionGeolocation.length; i++) {
        newgeo.push(this.state.selectedOptionGeolocation[i]);
      }
    } else {
      var newgeo = [
        {
          id: [selOptCon, selOptCou, selOptSta, selOptCit],
          name: [selOptConnm, selOptCounm, selOptStanm, selOptCitnm, selOptDMA],
          dma: selOptDMA
        }
      ];
    }

    this.setState({
      selectedOptionGeolocation: newgeo,
      selectedOptionContinent: null,
      selectedOptionCountry: null,
      selectedOptionState: null,
      selectedOptionCity: null,
      selectedOptionDMA: "",
      showModal: false
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  handleName(e) {
    this.setState({ channel_name: e.target.value });
  }

  handleDescription(e) {
    this.setState({ description: e.target.value });
  }

  handleAppId(e) {
    this.setState({ app_id: e.target.value });
  }

  handleAppName(e) {
    this.setState({ app_name: e.target.value });
  }

  handleAppBundle(e) {
    this.setState({ app_bundle: e.target.value });
  }

  handleAppURL(e) {
    this.setState({ app_url: e.target.value });
  }

  handleRateCPM(e) {
    this.setState({ rate_cpm: e.target.value });
  }

  handleContentTypeChange = selectedOptionContentType => {
    this.setState({ selectedOptionContentType });
  };

  handleDemandTypeChange = selectedOptionDemandType => {
    this.setState({ selectedOptionDemandType });
  };

  handleVASTTypeChange = selectedOptionVASTType => {
    this.setState({ selectedOptionVASTType });
  };

  handleLanguageChange = selectedOptionLanguage => {
    this.setState({ selectedOptionLanguage });
  };

  handleIABCategoryChange = selectedOptionIABCategory => {
    this.setState({ selectedOptionIABCategory });
  };

  handleUserAgentTypeChange = selectedOptionUserAgentType => {
    this.setState({ selectedOptionUserAgentType });
  };

  handleUserAgentOperatingSystemChange = selectedOptionUserAgentOperatingSystem => {
    this.setState({ selectedOptionUserAgentOperatingSystem });
  };

  handleGeolocationChange = selectedOptionGeolocation => {
    this.setState({ selectedOptionGeolocation });
  };

  handleContinentChange = selectedOptionContinent => {
    this.setState({
      selectedOptionCountry: null,
      selectedOptionState: null,
      selectedOptionCity: null,
      selectedOptionDMA: "",
      country_list: [],
      state_list: [],
      city_list: []
    });
    this.setState({ selectedOptionContinent });
    this.reloadCountries(selectedOptionContinent.id);
  };

  handleCountryChange = selectedOptionCountry => {
    this.setState({
      selectedOptionState: null,
      selectedOptionCity: null,
      selectedOptionDMA: "",
      state_list: [],
      city_list: []
    });
    this.setState({ selectedOptionCountry });
    if (selectedOptionCountry.name === "United States") {
      this.state.isHidden = true;
    } else {
      this.state.isHidden = false;
    }
    this.reloadStates(selectedOptionCountry.id);
  };

  handleStateChange = selectedOptionState => {
    this.setState({
      selectedOptionCity: null,
      selectedOptionDMA: "",
      city_list: []
    });
    this.setState({ selectedOptionState });
    this.reloadCities(selectedOptionState.id);
  };

  handleCityChange = selectedOptionCity => {
    this.setState({
      selectedOptionDMA: ""
    });
    this.setState({ selectedOptionCity });
  };

  handleDMAChange(e) {
    this.setState({ selectedOptionDMA: e.target.value });
  }

  handleContinent(e) {
    this.setState({ geolocation: e.target.value });
    this.reloadCountries(e.target.value);
  }

  handleCountry(e) {
    var oldgeo = this.state.geolocation;
    this.setState({ geolocation: oldgeo + e.target.value });
    this.reloadStates(e.target.value);
  }

  handleState(e) {
    APIAction.getData("private/cities?state=" + e.target.value, true)
      .then(data => {
        this.setState({ city_list: data });
      })
      .catch(err => console.error(err));
  }

  handleChannelStatus(e) {
    this.setState({ channel_status: !this.state.channel_status });
  }

  companyChange(e) {
    this.setState({ company: e.target.value.trim() });
  }

  resetError() {
    this.setState({ showAlert: false, showAlertText: "" });
  }

  onSave(e) {
    let me = this;
    e.preventDefault();
    this.resetError();

    if (this.state.channel_name === "") {
      this.setState({
        showAlert: true,
        showAlertText: "Channel name cannot be empty"
      });
      return;
    }

    if (
      this.state.rate_cpm === undefined ||
      this.state.rate_cpm <= 0 ||
      this.state.rate_cpm === ""
    ) {
      this.setState({
        showAlert: true,
        showAlertText: "Rate CPM cannot be empty"
      });
      return;
    }

    if (
      this.state.selectedOptionContentType.id === undefined ||
      this.state.selectedOptionContentType.id <= 0 ||
      this.state.selectedOptionContentType.id === ""
    ) {
      this.setState({
        showAlert: true,
        showAlertText: "Content Type cannot be empty"
      });
      return;
    }
    if (
      this.state.selectedOptionDemandType.id === undefined ||
      this.state.selectedOptionDemandType.id <= 0 ||
      this.state.selectedOptionDemandType.id === ""
    ) {
      this.setState({
        showAlert: true,
        showAlertText: "Demand Type cannot be empty"
      });
      return;
    }
    if (
      this.state.selectedOptionVASTType.id === undefined ||
      this.state.selectedOptionVASTType.id <= 0 ||
      this.state.selectedOptionVASTType.id === ""
    ) {
      this.setState({
        showAlert: true,
        showAlertText: "VAST Type cannot be empty"
      });
      return;
    }

    this.setState({ isDisabled: true });

    // languages
    var lang_id = [];
    if (this.state.selectedOptionLanguage) {
      for (var i = 0; i < this.state.selectedOptionLanguage.length; i++) {
        lang_id.push(this.state.selectedOptionLanguage[i].id);
      }
    }

    // IAB categories
    var iabcat_id = [];
    if (this.state.selectedOptionIABCategory) {
      for (var i = 0; i < this.state.selectedOptionIABCategory.length; i++) {
        iabcat_id.push(this.state.selectedOptionIABCategory[i].id);
      }
    }

    var user_agent_typ_id = [];
    if (this.state.selectedOptionUserAgentType) {
      for (var i = 0; i < this.state.selectedOptionUserAgentType.length; i++) {
        user_agent_typ_id.push(this.state.selectedOptionUserAgentType[i].id);
      }
    }

    var user_op_sys_typ_id = [];
    if (this.state.selectedOptionUserAgentOperatingSystem) {
      for (
        var i = 0;
        i < this.state.selectedOptionUserAgentOperatingSystem.length;
        i++
      ) {
        user_op_sys_typ_id.push(
          this.state.selectedOptionUserAgentOperatingSystem[i].id
        );
      }
    }

    // Geo-locations
    var geo_id = [];
    if (this.state.selectedOptionGeolocation) {
      for (var i = 0; i < this.state.selectedOptionGeolocation.length; i++) {
        var geo_loc = {};
        if (this.state.selectedOptionGeolocation[i].id[0]) {
          geo_loc["continentId"] = this.state.selectedOptionGeolocation[
            i
          ].id[0];
        }

        if (this.state.selectedOptionGeolocation[i].id[1]) {
          geo_loc["countryId"] = this.state.selectedOptionGeolocation[i].id[1];
        }

        if (this.state.selectedOptionGeolocation[i].id[2]) {
          geo_loc["stateId"] = this.state.selectedOptionGeolocation[i].id[2];
        }

        if (this.state.selectedOptionGeolocation[i].id[3]) {
          geo_loc["cityId"] = this.state.selectedOptionGeolocation[i].id[3];
        }

        if (this.state.selectedOptionGeolocation[i].dma) {
          geo_loc["dma"] = this.state.selectedOptionGeolocation[i].dma;
        }
        if (geo_loc) geo_id.push(geo_loc);
      }
    }

    var cnt_typ = 0;
    if (this.state.selectedOptionContentType.id)
      cnt_typ = this.state.selectedOptionContentType.id;

    var dmnd_typ = 0;
    if (this.state.selectedOptionDemandType.id)
      dmnd_typ = this.state.selectedOptionDemandType.id;

    var vst_typ = 0;
    if (this.state.selectedOptionVASTType.id)
      vst_typ = this.state.selectedOptionVASTType.id;

    var dataForm = {
      name: this.state.channel_name,
      description: this.state.description,
      appId: this.state.app_id,
      appName: this.state.app_name,
      appBundle: this.state.app_bundle,
      appURL: this.state.app_url,
      rateCPM: Number(this.state.rate_cpm),
      environmentTypeId: cnt_typ,
      demandTypeId: dmnd_typ,
      vastTypeId: vst_typ,
      languages: lang_id,
      categories: iabcat_id,
      useragentTypes: user_agent_typ_id,
      useragentOSs: user_op_sys_typ_id,
      geolocations: geo_id
    };

    APIAction.postData(CREATE_CHANNEL_API, JSON.stringify(dataForm), true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          console.log("Error creating channel: " + JSON.stringify(response));
          alert("Error creating channel: " + response.data.message);
          return;
        }
        me.props.history.push("/app/channels");
      })
      .catch(err => {
        console.error(err);
        this.setState({ isDisabled: false });
      });
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.history.push("/app/channels");
  }

  render() {
    const {
      selectedOptionLanguage,
      selectedOptionContentType,
      selectedOptionDemandType,
      selectedOptionVASTType,
      selectedOptionIABCategory,
      selectedOptionUserAgentType,
      selectedOptionUserAgentOperatingSystem,
      selectedOptionContinent,
      selectedOptionCountry,
      selectedOptionState,
      selectedOptionCity,
      selectedOptionDMA,
      selectedOptionGeolocation,
      isDisabled
    } = this.state;

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
                        <div className="col-sm-2 text-right">Channel Name*</div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleName(e)}
                            placeholder="Channel Name"
                            value={this.state.channel_name}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">Description</div>
                        <div className="col-sm-10">
                          <textarea
                            className="form-control"
                            onChange={e => this.handleDescription(e)}
                            value={this.state.description}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">App ID</div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleAppId(e)}
                            placeholder="App ID"
                            value={this.state.app_id}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">App Name</div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleAppName(e)}
                            placeholder="App Name"
                            value={this.state.app_name}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">App Bundle</div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleAppBundle(e)}
                            placeholder="App Bundle"
                            value={this.state.app_bundle}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">App URL</div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleAppURL(e)}
                            placeholder="App URL"
                            value={this.state.app_url}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">Rate CPM*</div>
                        <div className="col-sm-10">
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="form-control"
                            onChange={e => this.handleRateCPM(e)}
                            placeholder="Rate CPM"
                            value={this.state.rate_cpm}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">Content Type*</div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select Content Type --"
                            value={selectedOptionContentType}
                            onChange={this.handleContentTypeChange}
                            options={this.state.contenttype_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>Demand Type*</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select Demand Type --"
                            value={selectedOptionDemandType}
                            onChange={this.handleDemandTypeChange}
                            options={this.state.demandtype_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>VAST Type*</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select VAST Type --"
                            value={selectedOptionVASTType}
                            onChange={this.handleVASTTypeChange}
                            options={this.state.vasttype_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>Language</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select Language --"
                            value={selectedOptionLanguage}
                            onChange={this.handleLanguageChange}
                            options={this.state.language_list}
                            getOptionLabel={option =>
                              option.iso1 + " - " + option.name
                            }
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>IAB Category</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select IAB Category --"
                            value={selectedOptionIABCategory}
                            onChange={this.handleIABCategoryChange}
                            options={this.state.iab_category_list}
                            getOptionLabel={option =>
                              option.code + " - " + option.name
                            }
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>User Agent Types</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select User Agent Types --"
                            value={selectedOptionUserAgentType}
                            onChange={this.handleUserAgentTypeChange}
                            options={this.state.user_agent_type_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>User Agent Operating Systems</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            className="react-select-container"
                            classNamePrefix="react-select"
                            placeholder="-- Select User Agent Operating Systems --"
                            value={selectedOptionUserAgentOperatingSystem}
                            onChange={this.handleUserAgentOperatingSystemChange}
                            options={this.state.user_agent_system_list}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                            isMulti
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>Geolocation</label>
                        </div>
                        <div className="col-sm-10">
                          <Select
                            id="geolocation"
                            className="react-select-container m-b-md"
                            classNamePrefix="react-select"
                            placeholder=""
                            value={selectedOptionGeolocation}
                            onChange={this.handleGeolocationChange}
                            options={this.state.geolocation}
                            getOptionLabel={option => option.name}
                            getOptionValue={option => option.id}
                            styles={colourStyles}
                            isMulti
                          />
                          <textarea
                            className="form-control m-b hide"
                            value={this.state.geolocation}
                          />
                          <label className="m-b-sm hide">Continent</label>
                          <select
                            className="form-control m-b-md hide"
                            onChange={e => this.handleContinent(e)}
                          >
                            <option value="">--Select a Continent--</option>
                            {this.state.continent_list.map(function(item, key) {
                              return (
                                <option key={key} value={item.id}>
                                  {item.code} - {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <label className="m-b-sm hide">Country</label>
                          <select
                            className="form-control m-b-md hide"
                            onChange={e => this.handleCountry(e)}
                          >
                            <option value="">--Select a Country--</option>
                            {this.state.country_list.map(function(item, key) {
                              return (
                                <option key={key} value={item.id}>
                                  {item.code} - {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <label className="m-b-sm hide">State</label>
                          <select
                            className="form-control m-b-md hide"
                            onChange={e => this.handleState(e)}
                          >
                            <option value="">--Select a State--</option>
                            {this.state.state_list.map(function(item, key) {
                              return (
                                <option key={key} value={item.id}>
                                  {item.code} - {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <label className="m-b-sm hide">City</label>
                          <select
                            className="form-control m-b-md hide"
                            onChange={e => this.handleCity(e)}
                          >
                            <option value="">--Select a City--</option>
                            {this.state.city_list.map(function(item, key) {
                              return (
                                <option key={key} value={item.id}>
                                  {item.code} - {item.name}
                                </option>
                              );
                            })}
                          </select>
                          <button
                            className={"btn"}
                            type="button"
                            onClick={this.handleOpenModal}
                          >
                            Add Geolocation
                          </button>
                          <ReactModal
                            isOpen={this.state.showModal}
                            contentLabel="Minimal Modal Example"
                            onRequestClose={this.closeModal}
                            style={customStyles}
                          >
                            <div className="container full content-body">
                              <div className="row undefined ">
                                <div className="col-md-12 undefined ">
                                  <section className="panel panel-default m-t-md">
                                    <div className="panel-body">
                                      <form className="form-horizontal">
                                        <div className="form-group">
                                          <label
                                            className="m-b-sm"
                                            htmlFor="con"
                                          >
                                            Continent
                                          </label>
                                          <Select
                                            id="con"
                                            name="con"
                                            className="react-select-container m-b-md"
                                            classNamePrefix="react-select"
                                            placeholder="-- Select Continent --"
                                            value={selectedOptionContinent}
                                            onChange={
                                              this.handleContinentChange
                                            }
                                            options={this.state.continent_list}
                                            getOptionLabel={option =>
                                              option.name
                                            }
                                            getOptionValue={option => option.id}
                                            styles={colourStyles}
                                          />
                                          <select
                                            className="form-control m-b-md hide"
                                            onChange={e =>
                                              this.handleContinent(e)
                                            }
                                          >
                                            <option value="">
                                              --Select a Continent--
                                            </option>
                                            {this.state.continent_list.map(
                                              function(item, key) {
                                                return (
                                                  <option
                                                    key={key}
                                                    value={item.id}
                                                  >
                                                    {item.code} - {item.name}
                                                  </option>
                                                );
                                              }
                                            )}
                                          </select>
                                          <label className="m-b-sm">
                                            Country
                                          </label>
                                          <Select
                                            id="cou"
                                            className="react-select-container m-b-md"
                                            classNamePrefix="react-select"
                                            placeholder="-- Select Country --"
                                            value={selectedOptionCountry}
                                            onChange={this.handleCountryChange}
                                            options={this.state.country_list}
                                            getOptionLabel={option =>
                                              option.name
                                            }
                                            getOptionValue={option => option.id}
                                            styles={colourStyles}
                                          />
                                          <select
                                            className="form-control m-b-md hide"
                                            onChange={e =>
                                              this.handleCountry(e)
                                            }
                                          >
                                            <option value="">
                                              --Select a Country--
                                            </option>
                                            {this.state.country_list.map(
                                              function(item, key) {
                                                return (
                                                  <option
                                                    key={key}
                                                    value={item.id}
                                                  >
                                                    {item.code} - {item.name}
                                                  </option>
                                                );
                                              }
                                            )}
                                          </select>
                                          <label className="m-b-sm">
                                            State
                                          </label>
                                          <Select
                                            className="react-select-container m-b-md"
                                            classNamePrefix="react-select"
                                            placeholder="-- Select State --"
                                            value={selectedOptionState}
                                            onChange={this.handleStateChange}
                                            options={this.state.state_list}
                                            getOptionLabel={option =>
                                              option.name
                                            }
                                            getOptionValue={option => option.id}
                                            styles={colourStyles}
                                          />
                                          <select
                                            className="form-control m-b-md hide"
                                            onChange={e => this.handleState(e)}
                                          >
                                            <option value="">
                                              --Select a State--
                                            </option>
                                            {this.state.state_list.map(function(
                                              item,
                                              key
                                            ) {
                                              return (
                                                <option
                                                  key={key}
                                                  value={item.id}
                                                >
                                                  {item.code} - {item.name}
                                                </option>
                                              );
                                            })}
                                          </select>
                                          <label className="m-b-sm">City</label>
                                          <Select
                                            className="react-select-container m-b-md"
                                            classNamePrefix="react-select"
                                            placeholder="-- Select City --"
                                            value={selectedOptionCity}
                                            onChange={this.handleCityChange}
                                            options={this.state.city_list}
                                            getOptionLabel={option =>
                                              option.name
                                            }
                                            getOptionValue={option => option.id}
                                            styles={colourStyles}
                                          />
                                          <select
                                            className="form-control m-b-md hide"
                                            onChange={e => this.handleCity(e)}
                                          >
                                            <option value="">
                                              --Select a City--
                                            </option>
                                            {this.state.city_list.map(function(
                                              item,
                                              key
                                            ) {
                                              return (
                                                <option
                                                  key={key}
                                                  value={item.id}
                                                >
                                                  {item.code} - {item.name}
                                                </option>
                                              );
                                            })}
                                          </select>
                                          <div style={showhid}>
                                            <label className="m-b-sm">
                                              DMA
                                            </label>
                                            <Input
                                              classes={"m-b-md"}
                                              placeholder="DMA"
                                              type="text"
                                              onChange={e =>
                                                this.handleDMAChange(e)
                                              }
                                              value={
                                                this.state.selectedOptionDMA
                                              }
                                            />
                                          </div>
                                          <button
                                            type="button"
                                            className="btn btn-info"
                                            onClick={this.handleSaveModal}
                                          >
                                            Submit
                                          </button>{" "}
                                          <button
                                            type="button"
                                            className="btn"
                                            onClick={this.handleCloseModal}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </form>
                                    </div>
                                  </section>
                                </div>
                              </div>
                            </div>
                          </ReactModal>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-6 col-sm-offset-5">
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ marginRight: "2em" }}
                            onClick={e => this.onSave(e)}
                            disabled={isDisabled}
                          >
                            Create
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

export default withRouter(CreateChannel);
