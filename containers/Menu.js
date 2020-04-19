import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

import MenuItem from "../components/widgets/MenuItem";
import SubMenuItem from "../components/widgets/SubMenuItem";

class Menu extends PureComponent {
  static propTypes = {
    match: PropTypes.object,
    showInventory: PropTypes.bool,
    showDemands: PropTypes.bool
  };

  static defaultProps = {
    showInventory: true,
    showDemands: false
  };
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  toggleShowHide() {
    this.setState({ open: !this.state.open });
  }

  render() {
    var classes = "bg-black aside-md hidden-print";
    var navClasses = "nav-primary";
    if (!this.state.open) {
      classes += " nav-xs";
      navClasses += " hidden-xs";
    }

    return (
      <aside className={classes} id="nav">
        <section className="vbox">
          <header className="header bg-danger brand-header lock-header pos-stat clearfix">
            <a
              className="btn btn-link visible-xs"
              onClick={() => this.toggleShowHide()}
              data-toggle="class:nav-off-screen,open"
              data-target="#nav,html"
            >
              <i className="fa fa-bars" />
            </a>
            <div className="text-center tophead">
              <img style={{ width: "80px" }} src="/dist/images/logo.png" />
            </div>
          </header>
          <section className="w-f scrollable">
            <div className="slimScrollDiv">
              <div
                className="slim-scroll"
                data-height="auto"
                data-disable-fade-out="true"
                data-distance="0"
                data-size="5px"
                data-color="#333333"
              >
                <nav className={navClasses}>
                  <ul className="nav">
                    <MenuItem
                      link={"/app/dashboard"}
                      icon="fa-pie-chart"
                      color="bg-danger"
                      linkText="Dashboard"
                    />
                    <MenuItem
                      link={"/app/company"}
                      icon="fa-university"
                      color="bg-danger"
                      linkText="Company"
                    >
                      <SubMenuItem link={"/app/company/main"} linkText="Main" />
                      <SubMenuItem
                        link={"/app/company/contacts"}
                        linkText="Contacts"
                      />
                      <SubMenuItem
                        link={"/app/company/agreements"}
                        linkText="Agreements"
                      />
                    </MenuItem>
                    {this.props.showInventory ? (
                      <MenuItem
                        link={"/app/channels"}
                        icon="fa-video-camera"
                        color="bg-danger"
                        linkText="Inventory"
                      />
                    ) : null}
                    {this.props.showDemands ? (
                      <MenuItem
                        link={"/"}
                        icon="fa-handshake-o"
                        color="bg-danger"
                        linkText="Demands"
                      />
                    ) : null}
                    <MenuItem
                      link={"/app/reports"}
                      icon="fa-line-chart"
                      color="bg-danger"
                      linkText="Reports"
                    />
                    <MenuItem
                      link={"/app/accounting"}
                      icon="fa-balance-scale"
                      color="bg-danger"
                      linkText="Accounting"
                    />
                  </ul>
                </nav>
              </div>
              <div className="slimScrollBar scrollBar" />
              <div className="slimScrollRail scrollRail" />
            </div>
          </section>
        </section>
      </aside>
    );
  }
}

export default withRouter(Menu);
