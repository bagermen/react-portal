import React from "react";
import { connect } from "react-redux";
import { Row, Col, Page } from "../../components/ui/Layout";
import Input from "../../components/ui/Input";
import { withRouter } from "react-router";
import withAuth from "../../services/auth/withAuth";
import { compose } from "redux";
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

var shallowCompare = require("react-addons-shallow-compare");
const UPDATE_CHANNEL_API = "private/channel/";
const GET_CHANNEL_API = "private/channel/";

const getValue = (opts, val) => opts.find(o => o.id === val);

class UpdateChannel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      channel_name: "",
      description: "",
      app_id: "",
      app_name: "",
      app_bundle: "",
      app_url: "",
      tagURL: "",
      rate_cpm: 0,
      contenttype_list: [],
      demandtype_list: [],
      vasttype_list: [],
      language_list: [],
      iab_category_list: [],
      user_agent_type_list: [],
      user_agent_system_list: [],
      selectedOptionLanguage: [],
      selectedOptionContentType: {},
      selectedOptionDemandType: {},
      selectedOptionVASTType: {},
      selectedOptionIABCategory: [],
      selectedOptionUserAgentType: "",
      selectedOptionUserAgentOperatingSystem: "",
      selectedOptionProperties: [],
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
      showModal: false,
      isHidden: false,
      showAlert: false,
      showAlertText: "",
      channel_languages: [],
      channel_categories: [],
      channel_user_agent_types: [],
      channel_user_agent_systems: [],
      channel_geolocations: [],
      channel_content_type: null,
      channel_demand_type: null,
      channel_vast_type: null,
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
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleSaveModal = this.handleSaveModal.bind(this);
  }

  // This function will check if any user is already logged in or not
  componentWillMount() {
    this.loadChannel();
  }

  loadChannel() {
    var channel_id = this.props.match.params.id;
    APIAction.getData(GET_CHANNEL_API + channel_id, true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }

        this.setState({
          id: channel_id,
          tagURL: response.data.tagURL,
          channel_name: response.data.name,
          selectedOptionContinent: null,
          selectedOptionCountry: null,
          selectedOptionState: null,
          selectedOptionCity: null,
          selectedOptionGeolocation: null,
          showModal: false,
          showAlert: false,
          showAlertText: "",
          channel_content_type: {
            id: response.data.environmentTypeId,
            name: response.data.environmentTypeName
          },
          channel_demand_type: {
            id: response.data.demandTypeId,
            name: response.data.demandTypeName
          },
          channel_vast_type: {
            id: response.data.vastTypeId,
            name: response.data.vastTypeName
          },
          channel_languages: response.data.languages,
          channel_categories: response.data.categories,
          channel_user_agent_types: response.data.useragentTypes,
          channel_user_agent_systems: response.data.useragentOSs,
          channel_geolocations: response.data.geolocations
        });
        if (response.data.description)
          this.setState({ description: response.data.description });
        if (response.data.appId) this.setState({ app_id: response.data.appId });
        if (response.data.appName)
          this.setState({ app_name: response.data.appName });
        if (response.data.appBundle)
          this.setState({ app_bundle: response.data.appBundle });
        if (response.data.appURL)
          this.setState({ app_url: response.data.appURL });
        if (response.data.rateCPM)
          this.setState({ rate_cpm: response.data.rateCPM });

        this.reloadContentTypes();
        this.reloadDemandTypes();
        this.reloadVastTypes();
        this.reloadLanguages();
        this.reloadCategories();
        this.reloadUserAgentTypes();
        this.reloadUserAgentOperatingSystems();
        this.reloadContinents();
      })
      .catch(err => console.error(err));
  }

  reloadContentTypes() {
    APIAction.getData("private/content_environment_types", true)
      .then(response => {
        if (response.status < 200 || response.status >= 300) {
          alert("Invalid response from back-end API: " + response.data.message);
          console.error("Back-end error: " + JSON.stringify(response));
          return;
        }
        this.setState({ contenttype_list: response.data });
        this.selectContentType();
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
        this.selectDemandType();
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
        this.selectVastType();
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
        var allLanguages = response.data;
        var languageList = [];
        for (var i = 0; i < allLanguages.length; i++) {
          languageList.push({
            id: allLanguages[i].id,
            iso1: allLanguages[i].iso1,
            name: allLanguages[i].name
          });
        }
        this.setState({ language_list: languageList });
        this.selectLanguages();
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
        var allCategories = response.data;
        var categoryList = [];
        for (var i = 0; i < allCategories.length; i++) {
          categoryList.push({
            id: allCategories[i].id,
            code: allCategories[i].code,
            name: allCategories[i].name
          });
        }
        this.setState({ iab_category_list: categoryList });
        this.selectCategories();
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
        this.selectUserAgentTypes();
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
        this.selectUserAgentOperatingSystems();
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
        this.selectGeolocations();
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

  selectContentType() {
    this.setState({
      selectedOptionContentType: this.state.channel_content_type
    });
  }

  selectDemandType() {
    this.setState({ selectedOptionDemandType: this.state.channel_demand_type });
  }

  selectVastType() {
    this.setState({ selectedOptionVASTType: this.state.channel_vast_type });
  }

  selectLanguages() {
    var selectedLanguages = [];
    if (this.state.channel_languages) {
      for (var i = 0; i < this.state.channel_languages.length; i++) {
        selectedLanguages.push(
          getValue(this.state.language_list, this.state.channel_languages[i])
        );
      }
    }
    this.setState({ selectedOptionLanguage: selectedLanguages });
  }

  selectCategories() {
    var selectedCategories = [];
    if (this.state.channel_categories) {
      for (var i = 0; i < this.state.channel_categories.length; i++) {
        selectedCategories.push(
          getValue(
            this.state.iab_category_list,
            this.state.channel_categories[i]
          )
        );
      }
    }
    this.setState({ selectedOptionIABCategory: selectedCategories });
  }

  selectUserAgentTypes() {
    var selectedUserAgentTypes = [];
    if (this.state.channel_user_agent_types) {
      for (var i = 0; i < this.state.channel_user_agent_types.length; i++) {
        selectedUserAgentTypes.push(
          getValue(
            this.state.user_agent_type_list,
            this.state.channel_user_agent_types[i]
          )
        );
      }
    }
    this.setState({ selectedOptionUserAgentType: selectedUserAgentTypes });
  }

  selectUserAgentOperatingSystems() {
    var selectedUserAgentOperatingSystems = [];
    if (this.state.channel_user_agent_systems) {
      for (var i = 0; i < this.state.channel_user_agent_systems.length; i++) {
        selectedUserAgentOperatingSystems.push(
          getValue(
            this.state.user_agent_system_list,
            this.state.channel_user_agent_systems[i]
          )
        );
      }
    }
    this.setState({
      selectedOptionUserAgentOperatingSystem: selectedUserAgentOperatingSystems
    });
  }

  selectGeolocations() {
    var channel_geo_id = [];
    if (this.state.channel_geolocations) {
      for (var i = 0; i < this.state.channel_geolocations.length; i++) {
        var location = this.state.channel_geolocations[i];

        var continentID = "";
        var continentLabel = "";
        if (location.continentId) {
          continentID = location.continentId;
          continentLabel = location.continentName + " ";
        }
        var countryID = "";
        var countryLabel = "";
        if (location.countryId) {
          countryID = location.countryId;
          countryLabel = location.countryName + " ";
        }
        var stateID = "";
        var stateLabel = "";
        if (location.stateId) {
          stateID = location.stateId;
          stateLabel = location.stateName + " ";
        }
        var cityID = "";
        var cityLabel = "";
        if (location.cityId) {
          cityID = location.cityId;
          cityLabel = location.cityName + " ";
        }
        var DMA = "";
        if (location.dma != "") {
          DMA = location.dma;
        }
        var newgeo = {
          id: [continentID, countryID, stateID, cityID],
          name: [continentLabel, countryLabel, stateLabel, cityLabel],
          dma: DMA
        };
        if (channel_geo_id) channel_geo_id.push(newgeo);
      }
      this.setState({ selectedOptionGeolocation: channel_geo_id });
    }
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
          name: [selOptConnm, selOptCounm, selOptStanm, selOptCitnm],
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
          name: [selOptConnm, selOptCounm, selOptStanm, selOptCitnm],
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
    this.reloadCities(e.target.value);
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
    } else {
      let channel_id = this.state.id;

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

      // user_agent_types
      var user_agent_types_id = [];
      if (this.state.selectedOptionUserAgentType) {
        for (
          var i = 0;
          i < this.state.selectedOptionUserAgentType.length;
          i++
        ) {
          user_agent_types_id.push(
            this.state.selectedOptionUserAgentType[i].id
          );
        }
      }

      // user_agent_systems
      var user_agent_systems_id = [];
      if (this.state.selectedOptionUserAgentOperatingSystem) {
        for (
          var i = 0;
          i < this.state.selectedOptionUserAgentOperatingSystem.length;
          i++
        ) {
          user_agent_systems_id.push(
            this.state.selectedOptionUserAgentOperatingSystem[i].id
          );
        }
      }

      // Content properties
      var prop_id = [];
      if (this.state.selectedOptionProperties) {
        for (var i = 0; i < this.state.selectedOptionProperties.length; i++) {
          prop_id.push({
            propertyId: this.state.selectedOptionProperties[i].id
          });
        }
      }

      // Geo-locations
      var geo_id = [];
      if (this.state.selectedOptionGeolocation) {
        for (var i = 0; i < this.state.selectedOptionGeolocation.length; i++) {
          var selected = this.state.selectedOptionGeolocation[i];
          var geo_loc = {};
          if (selected.id[0]) {
            geo_loc["continentId"] = selected.id[0];
          }

          if (selected.id[1]) {
            geo_loc["countryId"] = selected.id[1];
          }

          if (selected.id[2]) {
            geo_loc["stateId"] = selected.id[2];
          }

          if (selected.id[3]) {
            geo_loc["cityId"] = selected.id[3];
          }

          if (selected.dma) {
            geo_loc["dma"] = selected.dma;
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
        environmentTypeId: this.state.selectedOptionContentType.id,
        demandTypeId: this.state.selectedOptionDemandType.id,
        vastTypeId: this.state.selectedOptionVASTType.id,
        languages: lang_id,
        categories: iabcat_id,
        useragentTypes: user_agent_types_id,
        useragentOSs: user_agent_systems_id,
        geolocations: geo_id
      };
      APIAction.putData(UPDATE_CHANNEL_API + channel_id, dataForm, true)
        .then(response => {
          if (response.status < 200 || response.status >= 300) {
            console.log("Error updating channel: " + JSON.stringify(response));
            alert("Error updating channel: " + response.data.message);
            return;
          }
          me.props.history.push("/app/channels");
        })
        .catch(err => {
          console.error(err);
          this.setState({ isDisabled: false });
        });
    }
  }

  handleCancel(e) {
    e.preventDefault();
    this.props.history.push("/app/channels");
  }

  render() {
    if (this.state.id == null) return <div>Loading data...</div>; //Check if channel is loaded or not

    var showhid = {
      display: this.state.isHidden ? "block" : "none"
    };

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

    var but_hid = {
      display: this.props.user.isMem ? "none" : "inline"
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
                        <div className="col-sm-2 text-right">
                          <label>Tag URL</label>
                        </div>
                        <div className="col-sm-10">
                          <div className="alert alert-warning" role="alert">
                            <p className="login-alert">{this.state.tagURL}</p>
                          </div>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>Channel Name*</label>
                        </div>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={e => this.handleName(e)}
                            placeholder="Channel Name"
                            value={this.state.channel_name}
                            disabled={this.props.user.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>Description</label>
                        </div>
                        <div className="col-sm-10">
                          <textarea
                            className="form-control"
                            onChange={e => this.handleDescription(e)}
                            value={this.state.description}
                            disabled={this.props.user.isMem}
                            style={{ resize: "none" }}
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
                            disabled={this.props.user.isMem}
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
                            disabled={this.props.user.isMem}
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
                            disabled={this.props.user.isMem}
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
                            disabled={this.props.user.isMem}
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
                            disabled={this.props.user.isMem}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="col-sm-2 text-right">
                          <label>Content Type*</label>
                        </div>
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
                            isDisabled={this.props.user.isMem}
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
                            isDisabled={this.props.user.isMem}
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
                            isDisabled={this.props.user.isMem}
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
                            isDisabled={this.props.user.isMem}
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
                            isDisabled={this.props.user.isMem}
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
                            isDisabled={this.props.user.isMem}
                          />

                          <button
                            className={"btn"}
                            type="button"
                            onClick={this.handleOpenModal}
                            disabled={this.props.user.isMem}
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
                                          <label className="m-b-sm">
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
                                          />{" "}
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
                          <div style={but_hid}>
                            <button
                              type="submit"
                              className="btn btn-primary"
                              style={{ marginRight: "2em" }}
                              onClick={e => this.onSave(e)}
                              disabled={isDisabled}
                            >
                              Save changes
                            </button>
                          </div>
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
)(UpdateChannel);
