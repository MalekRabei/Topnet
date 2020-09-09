import React, { Component } from "react";
// react component for creating dynamic tables
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { connect } from "react-redux";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import ModalUser from "./ModalUser";
import axios from "axios";
import io from "socket.io-client";
import {
  getUsers,
  deleteUser,
} from "../../../../services/userServices/userActions";
// react component used to create sweet alerts
import ReactBSAlert from "react-bootstrap-sweetalert";
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import { dataTable } from "../../../../variables/general";
import { Link } from "react-router-dom";
const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,

  sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Show{" "}
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }{" "}
        entries.
      </label>
    </div>
  ),
});

const { SearchBar } = Search;

class SortableUsers extends Component {
  constructor() {
    super();
    this.server = "";
    this.socket = io.connect(this.server);
    this.state = {
      online: 0,
      data: [],
    };
    this.getUserss = this.getUserss.bind(this);
    this.handleUserUpdated = this.handleUserUpdated.bind(this);
    this.handleUserDeleted = this.handleUserDeleted.bind(this);
  }
  componentDidMount() {
    this.props.getUsers();
    this.socket.on("visitor enters", data => this.setState({ online: data }));
    this.socket.on("visitor exits", data => this.setState({ online: data }));
this.getUserss();
    this.socket.on("update", data => this.handleUserUpdated(data));
    this.socket.on("delete", data => this.handleUserDeleted(data));
    
  }

  getUserss() {
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
      }
    }
    this.setState({ users: users });
  }
  handleUserDeleted(user) {
    let users = this.state.users.slice();
    users = users.filter((u) => {
      return u._id !== user._id;
    });
    this.setState({ users: users });
  }
  render() {
    console.log(this.props.users);
    this.data = this.props.users;
    console.log(this.data);
    let users = this.props.users;
    console.log(users.id);

    return (
      <div>
        <Card>
          <CardHeader>
            <h3 className="mb-0">Sortable users List</h3>
            <p className="text-sm mb-0">Example with Fake Data</p>
          </CardHeader>

          <ToolkitProvider
            data={this.data}
            keyField="_id"
            columns={[
              {
                dataField: "name",
                text: "Name",
                sort: true,
              },
              {
                dataField: "email",
                text: "Email",
                sort: true,
              },

              {
                dataField: "link",
                text: "ACTION",
                formatter: (rowContent, row) => {
                  return (
                    <div>
                      <ModalUser
                        headerTitle="Edit User"
                        buttonTriggerTitle="Edit"
                        buttonSubmitTitle="Save"
                        buttonColor="blue"
                        userID={row._id}
                        onUserUpdated={this.props.onUserUpdated}
                        server={this.props.server}
                        socket={this.props.socket}
                      />
                    </div>
                  );
                },
              },
            ]}
            search
          >
            {(props) => (
              <div className="py-4 table-responsive">
                <div
                  id="datatable-basic_filter"
                  className="dataTables_filter px-4 pb-1"
                >
                  <label>
                    Search:
                    <SearchBar
                      className="form-control-sm"
                      placeholder=""
                      {...props.searchProps}
                    />
                  </label>
                </div>
                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4={true}
                  pagination={pagination}
                  bordered={false}
                />
              </div>
            )}
          </ToolkitProvider>
        </Card>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  users: state.users.users,
});

export default connect(mapStateToProps, { getUsers, deleteUser })(
  SortableUsers
);
