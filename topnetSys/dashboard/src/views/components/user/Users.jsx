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
import TableUser from "./TableUser";
import ModalUser from "./ModalUser";
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { changeStatus } from "../../../services/userServices/authActions";

import { Card, CardBody, CardTitle } from "reactstrap";
class Users extends Component {
  _isMounted = false;
  constructor() {
    super();

    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);

    this.state = {
      users: [],
      online: 0,
    };

    this.fetchUsers = this.fetchUsers.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);
    this.handleUserEnabled = this.handleUserEnabled.bind(this);
  }

  // Place socket.io code inside here
  componentDidMount() {
    this._isMounted = true;
    this.fetchUsers();
    this.socket.on("visitor enters", (data) => this.setState({ online: data }));
    this.socket.on("visitor exits", (data) => this.setState({ online: data }));

    this.socket.on("update", (data) => this.handleUserUpdated(data));
    this.socket.on("delete", (data) => this.handleUserDeleted(data));
    this.socket.on("enabled", (data) => this.handleUserEnabled(data));
  }
  componentWillMount(){
     this.fetchUsers();
  }

  // Fetch data from the back-end
  fetchUsers() {
    axios
      .get(`${this.server}/api/users/`)
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  handleUserAdded(user) {
    let users = this.state.users.slice();
    users.push(user);
    this.setState({ users: users });
  }

  handleUserUpdated(user) {
    let users = this.state.users.slice();
    for (let i = 0, n = users.length; i < n; i++) {
      if (users[i]._id === user._id) {
        users[i].avatar = user.avatar;
        users[i].name = user.name;
        users[i].email = user.email;
        users[i].role = user.role;
        users[i].enabled = user.enabled;
      }
    }
    this.setState({ users: users });
  }

  handleUserDeleted(user) {
    let users = this.state.users.slice();
    {
      /*    users = users.filter((u) => {
      return u._id !== user._id;
    }); */
    }

    this.setState({ users: users });
  }
  async handleUserEnabled(user) {
    //let users = this.state.users;
    // users.map((prop, key) => {
    //   if (prop._id === user._id) {
    //     return user;
    //   } else return prop;
    // });
    // console.log("handleUserEnabled", user)
    // let users = this.state.users.slice();
    // for (let i = 0, n = users.length; i < n; i++) {
    //   if (users[i]._id === user._id) {
    //   console.log("mawjoud")
    //     users[i].enabled = user.enabled;
    //   }
    // }
    //console.log("users *** ", users);
    // this.setState({ users: users });
    
     this.fetchUsers();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
  render() {
    let online = this.state.online;
    let verb = online <= 1 ? "is" : "are"; // linking verb, if you'd prefer
    let noun = online <= 1 ? "person" : "people";
    return (
      <React.Fragment>
        <SimpleHeader name="Users List" parentName="Users" />
        <div>
          <Card className="bg-gradient-success">
            <CardBody>
              <CardTitle className="text-white" tag="h3">
                Online users in this page
              </CardTitle>
              <blockquote className="blockquote text-white mb-0">
                <p>
                  <em id="online">{`${online} ${noun} ${verb} online.`}</em>
                </p>
              </blockquote>
            </CardBody>
          </Card>

          <Container>
            <Link
              to="/admin/add-user"
              className="btn btn-outline-primary mr-1 float-right"
            >
              Add New User
            </Link>
            <TableUser
              onUserUpdated={this.handleUserUpdated}
              onUserDeleted={this.handleUserDeleted}
              onUserEnabled={this.handleUserEnabled}
              users={this.state.users}
              server={this.server}
              socket={this.socket}
            />
          </Container>

          <br />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null, {
  changeStatus,
})(Users);
