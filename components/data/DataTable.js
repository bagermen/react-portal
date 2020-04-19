/**
 * Copyright 2015-present, Lights in the Sky (3273741 NS Ltd.)
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule DataTable
 */

import React, { Component } from "react";
import DataRow from "./Row";
import { Pager } from "../../components/ui/";

export default class DataTable extends Component {
  headers() {
    const { schema } = this.props;
    return Object.keys(schema.fields)
      .reverse()
      .map((key, i) => {
        //console.log("label" + schema.fields[key].label);
        return (
          <th key={"header-key-" + key + "-" + i} key={key}>
            {schema.fields[key].label}
          </th>
        );
      });
  }

  deleteRow(id) {
    this.props.onDelete(id);
  }

  statusRow(id, status) {
    this.props.onStatus(id, status);
  }

  renderrows() {
    const { rows, schema } = this.props;
    const headerkeys = Object.keys(schema.fields).reverse();

    return rows.map(row => {
      return (
        <DataRow
          key={row.id}
          schema={schema}
          keys={headerkeys}
          onDelete={id => this.deleteRow(id)}
          onStatus={(id, status) => this.statusRow(id, status)}
          row={row}
          statDisabled={this.props.statDisabled}
        />
      );
    });
  }

  render() {
    const { rows, schema } = this.props;

    // const isDisabled = false;
    // if (this.props.statDisabled) isDisabled = this.props.statDisabled;

    return (
      <section>
        <header style={{ height: 32 }} className="panel-heading">
          <span className="text-muted m-l-sm pull-right">
            {/*<div className="btn-group"> 
              <button className="btn btn-danger m-t-xs btn-xs dropdown-toggle  m-r-sm" data-toggle="dropdown">Delete <span className="caret"></span></button> 
                <ul className="dropdown-menu"> 
                <li><a href="#">Delete Field</a></li> 
                <li><a href="#">Delete All Data</a></li> 
                <li className="divider"></li> 
                <li><a href="#">Delete Dataset</a></li> 
              </ul> 
            </div>*/}
            <a
              href={this.props.refLink}
              className="btn btn-success btn-xs m-t-xs"
              disabled={this.props.statDisabled}
            >
              <i className="fa fa-plus" /> Create New
            </a>
          </span>
        </header>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                {this.headers()}
                <th width="150" />
              </tr>
            </thead>
            {rows.length > 0 ? (
              <tbody>{this.renderrows()}</tbody>
            ) : (
              <tbody>
                <tr>
                  <td>No data available.</td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
        <footer className="pull-right hide">
          <Pager
            currentPage={this.props.page}
            itemsPerPage={10}
            totalItems={this.props.totalRows}
            onPage={this.props.onPage}
            onNext={this.props.onNext}
            onPrevious={this.props.onPrevious}
          />
        </footer>
      </section>
    );
  }
}
