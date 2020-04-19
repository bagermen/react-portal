/**
 * Copyright 2015-present, Lights in the Sky (3273741 NS Ltd.)
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @providesModule Row
 */

import React, { Component } from "react";
import { Link } from "react-router-dom";

import Cell from "./Cell";
import S3Service from '../../services/S3Service.js';

const s3 = new S3Service();

export default class Row extends Component {
  deleteRow(e) {
    this.props.onDelete(this.props.row.id);
  }

  statusRow(e) {
    this.props.onStatus(this.props.row.id, this.props.row.status);
  }

  FileClick(e) {
    console.log(this.props.row.documentation + " kk ");
    // this.props.onFileClick(this.props.row.documentation);
    let docfile = this.props.row.documentation;
    const myKey = docfile;
    const signedUrlExpireSeconds = 60 * 15; // your expiry time in seconds.
    const url = s3.getSignedUrl(myKey, signedUrlExpireSeconds);

    this.setState({ url: url });
    window.open(url);
  }

  render() {
    var cellStyle = {};
    const { schema, keys, row } = this.props;

    return (
      <tr>
        {this.props.keys.map((key, i) => (
          <Cell
            key={"cell-key-" + key + "-" + i}
            schemaName={schema.name}
            cellType={schema.fields[key].type}
            value={row[key] || ""}
          />
        ))}
        <td>
          {schema.statusChannel ? (
            row["status"] == "active" ? (
              <a
                href="javascript:;"
                disabled={this.props.statDisabled}
                onClick={e => this.statusRow(e)}
              >
                <i
                  className="fa text-muted fa-minus-circle m-r-sm"
                  disabled={this.props.statDisabled}
                />
              </a>
            ) : (
              <a
                href="javascript:;"
                disabled={this.props.statDisabled}
                onClick={e => this.statusRow(e)}
              >
                <i
                  className="fa text-muted fa-check-circle m-r-sm"
                  disabled={this.props.statDisabled}
                />
              </a>
            )
          ) : (
            ""
          )}
          <Link to={"/app/" + schema.updateName + "/" + row["id"]}>
            {schema.pdf ? (
              <i className="fa text-muted fa-eye m-r-sm" />
            ) : (
              <i className="fa text-muted fa-edit m-r-sm" />
            )}
          </Link>
          {this.props.statDisabled ? (
            ""
          ) : schema.pdf ? (
            <a
              href="javascript:;"
              disabled={this.props.statDisabled}
              onClick={e => this.FileClick(e)}
            >
              <i
                className="fa text-muted fa-file-pdf-o m-r-sm"
                disabled={this.props.statDisabled}
              />
            </a>
          ) : (
            <a
              href="javascript:;"
              disabled={this.props.statDisabled}
              onClick={e => this.deleteRow(e)}
            >
              <i
                className="fa text-muted fa-trash-o"
                disabled={this.props.statDisabled}
              />
            </a>
          )}
        </td>
      </tr>
    );
  }
}
