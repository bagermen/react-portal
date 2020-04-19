/**
 * Copyright 2015-present, Lights in the Sky (3273741 NS Ltd.)
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree. 
 * 
 * @providesModule Dashboard
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import Profile from '../components/widgets/Profile';

import { selectApp, logout } from '../actions';

import ReduxOutlet from '../outlets/ReduxOutlet';
import moment from 'moment-timezone';
import ModalFactory from '../components/modals/factory';

let Factory = ModalFactory.modalFromFactory;

import LineChart from '../components/charts/LineChart';
import EasyPie from '../components/charts/EasyPie';
import ProgressBar from '../components/charts/ProgressBar';


import {I, Panel, Button} from '../components/ui/';
import {Row, Col, Page} from '../components/ui/Layout';

const config = require('../config.json');

var shallowCompare = require('react-addons-shallow-compare');

const GET_DASHBOARD_API = config.backend+'/account/getDashboard/1';
const GET_DASHBOARDRECORDS_API = config.backend+'/account/getDashboardRecords/1';

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      dashboard_data: null,
      dashboard_records: null
    };

    this.handleDuration = this.handleDuration.bind(this);
  }

  formatNumber (labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9

    ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6

    ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"

    : Math.abs(Number(labelValue));

  }

  handleDuration(e){
    var current_option = e.target.value;
    var current_dashboard_url = ''
    var current_dashboardrecords_url = '';

    if(current_option == 'last_hour'){
      current_dashboard_url = GET_DASHBOARD_API+'/last_hour';
      current_dashboardrecords_url = GET_DASHBOARDRECORDS_API+'/last_hour';
    }else if(current_option == 'today'){
      current_dashboard_url = GET_DASHBOARD_API+'/today';
      current_dashboardrecords_url = GET_DASHBOARDRECORDS_API+'/today';
    }else if(current_option == 'this_week'){
      current_dashboard_url = GET_DASHBOARD_API+'/this_week';
      current_dashboardrecords_url = GET_DASHBOARDRECORDS_API+'/this_week';
    }else if(current_option == 'this_month'){
      current_dashboard_url = GET_DASHBOARD_API+'/this_month';
      current_dashboardrecords_url = GET_DASHBOARDRECORDS_API+'/this_month';
    }

    fetch(current_dashboard_url)
      .then(response => response.json())
      .then(data => this.setState({ dashboard_data: data }))
      .catch(function(e){
        console.log('Error occured:', e);
      });

    fetch(current_dashboardrecords_url)
      .then(response => response.json())
      .then(data => this.setState({ dashboard_records: data }))
      .catch(function(e){
        console.log('Error occured:', e);
      });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  componentDidMount() {
    console.log('component did mount called');
    fetch(GET_DASHBOARD_API+'/last_hour')
      .then(response => response.json())
      .then(data => this.setState({ dashboard_data: data }))
      .catch(function(e){
        console.log('Error occured:', e);
      });

    fetch(GET_DASHBOARDRECORDS_API+'/last_hour')
      .then(response => response.json())
      .then(data => this.setState({ dashboard_records: data }))
      .catch(function(e){
        console.log('Error occured:', e);
      });
  }

  render() {
    const { dispatch } = this.props;
    let i = 0;

    let {dashboard_data, dashboard_records} = this.state;
    if(!dashboard_data || !dashboard_records) return <div>Loading data...</div>;

    console.log('dashboard data1:', dashboard_data);
    console.log('dashboard records:', dashboard_records);

    return (
      <Page>
        <Row>
          <Col size={2}>
            <select name="account" className="form-control m-b" onChange={(e)=>this.handleDuration(e)}>
              <option value="last_hour">Last Hour</option> 
              <option value="today">Today</option>
              <option value="this_week">This week</option> 
              <option value="this_month">This month</option>
            </select>
          </Col>
        </Row>
        <Row>
          <Col size={12}>
            <Panel classes={'no-padder'}>
              <div className="col-md-2 summaryItem">
                <h1>{this.formatNumber(dashboard_data.opportunities)}</h1>
                <p>Oppotunities</p>
              </div>

              <div className="col-md-2 summaryItem">
                <h1>{this.formatNumber(dashboard_data.impressions)}</h1>
                <p>Impressions</p>
              </div>

              <div className="col-md-2 summaryItem">
                <h1 style={{color:'#28dbec'}}>{dashboard_data.fill_rate * 100}%</h1>
                <p>Fill Rate</p>
              </div>

              <div className="col-md-2 summaryItem">
                <h1 style={{color:'#a48ad4'}}>${dashboard_data.cpm}</h1>
                <p>CPM</p>
              </div>

              <div className="col-md-2 summaryItem">
                <h1 style={{color:'#a48ad4'}}>${dashboard_data.revenue}</h1>
                <p>Revenue</p>
              </div>
            </Panel>
          </Col>
        </Row>
        <Row>
          <Col size={12}>
              <Panel>
                <table className="table"> 
                  <thead> 
                    <tr> 
                      <th>Project</th> 
                      <th>Opportunities</th> 
                      <th className="hidden-xs">Impressions</th> 
                      <th className="hidden-xs">Fill rate</th> 
                      <th>CPM</th> 
                      <th>Revenue</th>
                    </tr> 
                  </thead> 
                  <tbody> 
                    {JSON.stringify(dashboard_records) != '[]' ? (dashboard_records.map((object, i)=>
                    <tr> 
                      <td>{object.project_id}</td>
                      <td>{object.total_opportunities}</td> 
                      <td className="hidden-xs">{object.total_impression}</td> 
                      <td className="hidden-xs">{(object.total_impression/object.total_opportunities)*100}</td> 
                      <td>$8</td> 
                      <td className="text-right">
                        ${(8/1000)*object.total_impression}
                      </td>
                    </tr> 
                    )) : (
                      <tr> 
                        <td colspan="6">No data is available for this duration.</td>
                      </tr>
                    )}
                    
                  </tbody> 
                </table>
              </Panel>
            </Col>
          </Row>

        <Row>
          <Col size={12}>
            <Panel title="Performance">
              <LineChart data={{labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                series: [
                  [0, 20, 50, 40, 45, 15, 25, 65, 70, 80, 70, 90],
                  [0, 10, 20, 70, 85, 45, 15, 65, 20, 30, 50, 70]
                ]}} />
            </Panel>
          </Col>

          {/*<Col size={3}>
            <Panel title="Users" scrollHeight={315}>
              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/5.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Andrew Wilson</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/7.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Noah Wilson</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/8.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Heather Smith</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/img3.jpg" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Erin Vieira</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/avatar.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Mia Vieira</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/5.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Andrew Wilson</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/7.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Noah Wilson</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/8.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Heather Smith</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/img3.jpg" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Erin Vieira</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <article className="comment-item"> 
                <a className="pull-left thumb-sm m-r-sm"><img src="/dist/images/avatar.png" className="img-circle" /></a> 
                <section className="comment-body"> 
                  <header> <a href="#"><strong>Mia Vieira</strong></a></header> 
                  <div className="text-muted">UI / UX Developer</div> 
                </section> 
              </article>

              <footer className="text-center">
                <hr/>
                  <Button color="btn-info" label="Show More" />
              </footer>
            </Panel>
              </Col>*/}
        </Row>

        <Row>
          <Col size={4}>
            <Panel classes={'text-center'}>
              <EasyPie 
                  size={150}
                  barColor={'#F06292'}
                  trackColor={'rgba(0,0,0,0.1)'}
                  lineWidth={5}
                  percent={30}
                  theme="honeycomb_light"
                />
              <h4 className="m-b-none">Oppotunities</h4>
              <small>Total oppotunities</small>
            </Panel>
          </Col>
          <Col size={4}>
            <Panel classes={'text-center'}>
              <EasyPie 
                  size={150}
                  barColor={'#3949AB'}
                  trackColor={'rgba(0,0,0,0.1)'}
                  lineWidth={5}
                  percent={80}
                  theme="honeycomb_light"
                />
              <h4 className="m-b-none">Impressions</h4>
              <small>Total impressions</small>
            </Panel>
          </Col>
          <Col size={4}>
            <Panel classes={'text-center'}>
              <EasyPie 
                  size={150}
                  barColor={'#F4511E'}
                  trackColor={'rgba(0,0,0,0.1)'}
                  lineWidth={5}
                  percent={70}
                  theme="honeycomb_light"
                />
              <h4 className="m-b-none">Revenue</h4>
              <small>Total revenue</small>
            </Panel>
          </Col>
        </Row>
        {/*<Row>
          <Col size={9}>
            <Panel>
              <table className="table"> 
                <thead> 
                  <tr> 
                    <th>Device</th> 
                    <th className="hidden-xs">Consumed</th> 
                    <th className="hidden-xs">Potential</th> 
                    <th>Distribution</th> 
                    <th></th>
                  </tr> 
                </thead> 
                <tbody> 
                  <tr> 
                    <td>Heating - House</td> 
                    <td className="hidden-xs">45 kW</td> 
                    <td className="hidden-xs">30 kW</td> 
                    <td> 
                      <ProgressBar style={{backgroundColor:'#f77373'}} now={30} max={100} theme="progress-bar-warning" />
                    </td> 
                    <td className="text-right">
                      <a href="javascript:;" className="m-r-sm"><i className="fa text-muted fa-trash-o"></i></a>
                      <a href="javascript:;"><i className="fa text-muted fa-edit"></i></a>
                    </td>
                  </tr> 
                  <tr> 
                    <td>Heating - House</td> 
                    <td className="hidden-xs">45 kW</td> 
                    <td className="hidden-xs">30 kW</td> 
                    <td> 
                      <ProgressBar style={{backgroundColor:'#f77373'}} now={80} max={100} theme="progress-bar-success" />
                    </td> 
                    <td className="text-right">
                    
                      <a href="javascript:;" className="m-r-sm"><i className="fa text-muted fa-trash-o"></i></a>
                      <a href="javascript:;"><i className="fa text-muted fa-edit"></i></a>
                    </td>
                  </tr> 
                  <tr> 
                    <td>Heating - House</td> 
                    <td className="hidden-xs">45 kW</td> 
                    <td className="hidden-xs">30 kW</td> 
                    <td> 
                      <ProgressBar style={{backgroundColor:'#f77373'}} now={10} max={100} theme="progress-bar-danger" />
                    </td> 
                    <td className="text-right">
                      <a href="javascript:;" className="m-r-sm"><i className="fa text-muted fa-trash-o"></i></a>
                      <a href="javascript:;"><i className="fa text-muted fa-edit"></i></a>
                    </td>
                  </tr> 
                  <tr> 
                    <td>Heating - House</td> 
                    <td className="hidden-xs">45 kW</td> 
                    <td className="hidden-xs">30 kW</td> 
                    <td> 
                      <ProgressBar style={{backgroundColor:'#f77373'}} now={40} max={100} theme="progress-bar-info" />
                    </td> 
                    <td className="text-right">
                      <a href="javascript:;" className="m-r-sm"><i className="fa text-muted fa-trash-o"></i></a>
                      <a href="javascript:;"><i className="fa text-muted fa-edit"></i></a>
                    </td>
                  </tr> 
                  <tr> 
                    <td>Heating - House</td> 
                    <td className="hidden-xs">45 kW</td> 
                    <td className="hidden-xs">30 kW</td> 
                    <td> 
                      <ProgressBar style={{backgroundColor:'#f77373'}} now={40} max={100} theme="progress-bar-warning" />
                    </td> 
                    <td className="text-right">
                      <a href="javascript:;" className="m-r-sm"><i className="fa text-muted fa-trash-o"></i></a>
                      <a href="javascript:;"><i className="fa text-muted fa-edit"></i></a>
                    </td>
                  </tr> 
                </tbody> 
              </table>
            </Panel>
          </Col>
          <Col size={3}>
            <Panel>
              <Button icon="fa-facebook" color="bg-info" classes={'w100'} label="Find us on facebook" />
              <Button icon="fa-envelope-o" color="bg-danger" classes={'w100 m-t-sm'} label="Send us an email" />
              <Button icon="fa-sign-out" color="bg-success" classes={'w100 m-t-sm'} label="Sign out" />
              <h5 className="m-t-md"><I icon="assignment_turned_in" classes={'m-r-xs'} size={13} />Link to this site</h5>
              <p>There is a simple form with a button below this.</p>
              <Button color="bg-dark" classes={'w100 m-t-sm'} label="Send to me" />
            </Panel>
          </Col>

        </Row>*/}
    </Page>
		);
	}
}


function mapStateToProps(state) {
  return {
    token: state.app.token,
    user: state.user,
    app:state.app
  };
}

export default compose(
  withRouter,
  connect(mapStateToProps)
)(Dashboard);

