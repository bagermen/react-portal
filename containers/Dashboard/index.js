import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { compose, bindActionCreators } from "redux";
import { Row, Col, Page } from "../../components/ui/Layout";
import { Panel, Button } from "../../components/ui/";
import DashboardTopPanel from '../../components/widgets/DashboardTopPanel/index';
import DateRangePicker from '../../components/widgets/DashboardFilter/DateRange/index';
import {
  updateDateRange,
  updateCommonData,
  addFilter,
  removeFilterValue,
  loadDashboard
} from '../../actions/dashboard';
import FilterChooser from '../../components/widgets/DashboardFilter/FilterChooser/index';
import ControlPanel from '../../components/ui/ControlPanel/index';
import Fieldset from '../../components/ui/Fieldset/index';
import GeoFilter from '../../components/widgets/DashboardFilter/Geo/index';
import SelectedFilters from '../../components/widgets/DashboardFilter/SelectedFilters/index';
import ChartWrapper from '../../components/widgets/DashboardCharts/ChartWrapper';
import MultiBarChart from '../../components/widgets/DashboardCharts/MultiBarChart';
import PieChart from '../../components/widgets/DashboardCharts/PieChart';

class Dashboard extends PureComponent {
  state = {
    filterType: 'geo',
    value: '',
    serverValue: {},
    userValue: '',
    color: 'grey',
    allowMany: true
  };
  constructor(props) {
    super(props);
    const me = this;

    me.addFilter = me.addFilter.bind(me);
    me.removeFilter = me.removeFilter.bind(me);
    me.loadDashboard = me.loadDashboard.bind(me);
  }

  componentDidMount() {
    this.loadDashboard();
  }

  addFilter(e) {
    const me = this,
      filters = me.props.filters;

    e.preventDefault();

    if (filters.findIndex((v) => me.state.filterType == v.filterType && me.state.value == v.value) > -1) {
      return;
    }

    if (!me.state.allowMany) {
      (filters.filter((v) => me.state.filterType == v.filterType) || []).forEach((filter => me.props.removeFilterValue(filter.filterId)));
    }

    me.props.addFilter({
      filterType: me.state.filterType,
      value: me.state.value,
      serverValue: me.state.serverValue,
      userValue: me.state.userValue,
      color: me.state.color
    });
  }

  removeFilter(filterId) {
    const me = this;

    me.props.removeFilterValue(filterId);
  }

  loadDashboard() {
    const me = this;

    me.props.loadDashboard({
      period: me.props.period,
      tz: me.props.tz,
      startDate: me.props.startDate,
      endDate: me.props.endDate,
      filters: me.props.filters
    });
  }

  render() {
    const me = this;
    const {
      startDate,
      endDate,
      period,
      tz,
      filters,
      updateDateRange,
      active,
      total,
      opportunities,
      impressions,
      completions,
      fillRate,
      revenue,
      charts
    } = this.props;

    const {
      filterType,
      value: filterValue
    } = this.state;

    return (
      <Page>
        <Row>
          <Col size={12}>
            <Panel title="Dashboard" classes={"user-dashboard"}>
                <ControlPanel>
                  <DashboardTopPanel
                    active={active}
                    total={total}
                    opportunities={opportunities}
                    impressions={impressions}
                    completions={completions}
                    fillRate={fillRate}
                    revenue={revenue}
                  >
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      period={period}
                      tz={tz}
                      updateRange={updateDateRange}
                    />
                  </DashboardTopPanel>
                </ControlPanel>
                <ControlPanel headerText="Filters" className={"dashboard-filter-panel-wrapper"}>
                  <FilterChooser
                    filterType={filterType}
                    onChange={(v, data) => {
                      me.setState({filterType: v, allowMany: data.allowMany, color: data.color});
                    }}
                    filterValue={filterValue}
                    onFilterValueChange={({value, serverValue, userValue}) => this.setState({value, serverValue, userValue})}
                  >
                    <GeoFilter/>
                  </FilterChooser>
                  <div>
                    <Button disabled={!filterValue} label="+ Add Filter" color="btn-info" onClick={me.addFilter}/>
                  </div>
                  <div className="user-dashboard__selected-filters">
                    <Fieldset headerText="Current Filters">
                        <SelectedFilters filters={filters} onRemove={me.removeFilter}/>
                    </Fieldset>
                    <Button label="Submit" color="btn-primary" onClick={me.loadDashboard}/>
                  </div>
                </ControlPanel>
                <ControlPanel headerText="Opportunities (Ad requests)" className="user-dashboard__charts-layout">
                  <ChartWrapper title="Total">
                    <MultiBarChart datum={charts.opportunities.histogram} />
                  </ChartWrapper>
                  <ChartWrapper title="Per Channel">
                    <PieChart datum={charts.opportunities.byChannel}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Country">
                    <PieChart datum={charts.opportunities.byCountry}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Environment Type">
                    <PieChart datum={charts.opportunities.byEnvType}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Demand Type">
                    <PieChart datum={charts.opportunities.perDemand}/>
                  </ChartWrapper>
                </ControlPanel>
                <ControlPanel headerText="Impressions" className="user-dashboard__charts-layout">
                  <ChartWrapper title="Total">
                    <MultiBarChart datum={charts.impressions.histogram} />
                  </ChartWrapper>
                  <ChartWrapper title="Per Channel">
                    <PieChart datum={charts.impressions.byChannel}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Country">
                    <PieChart datum={charts.impressions.byCountry}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Environment Type">
                    <PieChart datum={charts.impressions.byEnvType}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Demand Type">
                    <PieChart datum={charts.impressions.perDemand}/>
                  </ChartWrapper>
                </ControlPanel>
                <ControlPanel headerText="Completions" className="user-dashboard__charts-layout">
                  <ChartWrapper title="Total">
                    <MultiBarChart datum={charts.completions.histogram} />
                  </ChartWrapper>
                  <ChartWrapper title="Per Channel">
                    <PieChart datum={charts.completions.byChannel}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Country">
                    <PieChart datum={charts.completions.byCountry}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Environment Type">
                    <PieChart datum={charts.completions.byEnvType}/>
                  </ChartWrapper>
                  <ChartWrapper title="Per Demand Type">
                    <PieChart datum={charts.completions.perDemand}/>
                  </ChartWrapper>
                </ControlPanel>
            </Panel>
          </Col>
        </Row>
      </Page>
    );
  }
}

function mapStateToProps(state) {
  return {
// date range
    tz: state.dashboard_filter.tz,
    startDate: state.dashboard_filter.startDate,
    endDate: state.dashboard_filter.endDate,
    period: state.dashboard_filter.period,
// filter
    filters: state.dashboard_filter.filters,

// common data
    active: state.dashboard.active,
    total: state.dashboard.total,
    opportunities: state.dashboard.opportunities,
    impressions: state.dashboard.impressions,
    completions: state.dashboard.completions,
    fillRate:  state.dashboard.fillRate,
    revenue: state.dashboard.revenue,
// charts
    charts: state.dashboard.charts
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {
        updateDateRange,
        updateCommonData,
        addFilter,
        removeFilterValue,
        loadDashboard
      },
      dispatch
    )
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(Dashboard);