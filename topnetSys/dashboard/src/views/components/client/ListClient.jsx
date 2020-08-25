/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { Component } from "react";
import { Container } from "semantic-ui-react";

import axios from "axios";
import io from "socket.io-client";
import TableClient from "./TableClient";
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import { Link, withRouter } from "react-router-dom";
import { listClient } from "../../../services/clientServices/clientActions";
import {
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  Row,
  Col,
  Collapse,
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class ListClient extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);

    this.state = {
      clients: [],
    };

    this.fetchClients = this.fetchClients.bind(this);
    this.handleClientDeleted = this.handleClientDeleted.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this._isMounted = true;
    this.fetchClients();
  }
 
  // Fetch data from the back-end
  fetchClients() {
    axios
      .get(`${this.server}/api/clients/list`)
      .then((response) => {
        this.setState({ clients: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  handleClientDeleted(client) {
    let clients = this.state.clients.slice();
    clients = clients.filter((u) => {
      return u._id !== client._id;
    });
    this.setState({ clients: clients });
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    return (
      <React.Fragment>
        <SimpleHeader name="Clients List" parentName="Clients" />
        <div>
          <Container>
            <br />
            <br />
            <TableClient
              onClientDeleted={this.handleClientDeleted}
              clients={this.state.clients}
            />
          </Container>

          <br />
        </div>
      </React.Fragment>
    );
  }
}

export default ListClient;

