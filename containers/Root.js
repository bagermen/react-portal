import React, { PureComponent } from "react";
import axios from "axios";
import { hot } from "react-hot-loader";
import { Provider } from "react-redux";
import { Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import configureStore, { AppHistory } from "../store/configureStore";
import Route from "./RouteRedux";
import RouteProtected from "./RouteProtected";
import UserContextProvider from "../services/auth/AuthContextProvider";
import Loader from './Loader';

import ModalFromFactory from "../components/modals/factory";
import AlertWin from '../components/modals/Alert';
import {WIN_ALERT_WINDOW} from "../constants/windows";
import { setLoadingState } from '../actions/index';

const Factory = ModalFromFactory.modalFromFactory;

import App from "./App";

// Access
import Login from "./access/Login";
import Logout from "./access/Logout";
import ForgotPassword from "./access/ForgotPassword";

// Sign Up
import SignUp from "./SignUp/index";
import SignUpConfirmation from "./SignUp/Confirmation";
import VerificationCode from "./SignUp/VerificationCode";

// Profile
import Profile from "./Profile/index";
import ChangePassword from "./Profile/ChangePassword";

// Dashboard
import Dashboard from "./Dashboard/index";

// Company
import CompanyMain from "./company/Main";
import CompanyContacts from "./company/Contacts";
import CreateContact from "./company/ContactCreate";
import UpdateContact from "./company/ContactUpdate";
import CompanyAgreements from "./company/Agreements";
import AgreementDetail from "./company/AgreementDetail";
import RegisterVSP from "./company/RegisterVSP";

// Channels
import Channels from "./inventory/ChannelList";
import CreateChannel from "./inventory/ChannelCreate";
import UpdateChannel from "./inventory/ChannelUpdate";

// Others
import Accounting from "./Accounting.js";
import Reports from "./Reports.js";


export const store = configureStore();

class Root extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  componentDidMount() {
    axios.interceptors.request.use((config) => {
      store.dispatch(setLoadingState(true));
      return config;
    }, (error) => {
      store.dispatch(setLoadingState(false));
      return Promise.reject(error);
    });

    axios.interceptors.response.use((response) => {
      store.dispatch(setLoadingState(false));
      return response;
    }, (error) => {
      store.dispatch(setLoadingState(false));
      return Promise.reject(error);
    });
  }

  render() {
    return (
      <UserContextProvider store={store}>
        <Provider store={store}>
          <Router history={AppHistory}>
            <Switch>
              <Route path="/" component={Login} exact />
              <Route path="/forgotpassword" component={ForgotPassword} />
              <Route path="/changepassword" component={ChangePassword} />
              <Route path="/verificationcode" component={VerificationCode} />
              <Route path="/signup" component={SignUp} />
              <Route
                path="/signupconfirmation"
                component={SignUpConfirmation}
              />
              <Route path="/registervsp" component={RegisterVSP} />
              <Route path="/logout" component={Logout} />
              <RouteProtected
                path="/app"
                loginPath="/"
                render={({ match: { path } }) => (
                  <App>
                    <Switch>
                      <Route
                        path={`${path}/profile`}
                        component={Profile}
                        pageName="Profile"
                        pageDescription="Manage your profile"
                      />
                      <Route
                        path={`${path}/dashboard`}
                        exact
                        component={Dashboard}
                        pageName="Dashboard"
                        pageDescription="User Dashboard."
                      />
                      <Route
                        path={`${path}/company`}
                        pageName="Company"
                        render={({ match: { path } }) => (
                          <Switch>
                            <Route
                              path={`${path}/main`}
                              component={CompanyMain}
                              pageName="Company/Main"
                              pageDescription="Company/Main"
                            />
                            <Route
                              path={`${path}/contacts`}
                              exact
                              component={CompanyContacts}
                              pageName="Company/Contacts"
                              pageDescription="Company/Contacts"
                            />
                            <Route
                              path={`${path}/contacts/create`}
                              exact
                              component={CreateContact}
                              pageName="Company/Create Contact"
                              pageDescription="Company/Contact Create"
                            />
                            <Route
                              path={`${path}/contacts/update/:id`}
                              exact
                              component={UpdateContact}
                              pageName="Company/Update Contact"
                              pageDescription="Company/Contact Update"
                            />
                            <Route
                              path={`${path}/agreements`}
                              component={CompanyAgreements}
                              pageName="Company/Agreements"
                              pageDescription="Company/Agreements"
                            />
                            <Route
                              path={`${path}/agreement/detail/:id`}
                              component={AgreementDetail}
                              pageName="Company/AgreementDetail"
                              pageDescription="Company/AgreementDetail"
                            />
                          </Switch>
                        )}
                      />
                      <Route
                        path={`${path}/channels`}
                        render={({ match: { path } }) => (
                          <Switch>
                            <Route
                              path={path}
                              exact
                              component={Channels}
                              pageName="Channels"
                              pageDescription="Data regarding channels"
                            />
                            <Route
                              path={`${path}/create`}
                              component={CreateChannel}
                              pageName="Create Channel"
                              pageDescription="Create new channel"
                            />
                            <Route
                              path={`${path}/update/:id`}
                              component={UpdateChannel}
                              pageName="Update Channel"
                              pageDescription="Update channel"
                            />
                          </Switch>
                        )}
                      />
                      <Route
                        path={`${path}/reports`}
                        component={Reports}
                        pageName="Reports"
                        pageDescription="User Reports."
                      />
                      <Route
                        path={`${path}/accounting`}
                        component={Accounting}
                        pageName="Accounting"
                        pageDescription="User Accounting."
                      />
                    </Switch>
                  </App>
                )}
              />
            </Switch>
          </Router>
          <Loader color='#f3498a'/>
          <Factory
            modalref={WIN_ALERT_WINDOW}
            title={store.getState().popup_alert.title}
            factory={AlertWin}
          />
        </Provider>
      </UserContextProvider>
    );
  }
}

export default hot(module)(Root);
