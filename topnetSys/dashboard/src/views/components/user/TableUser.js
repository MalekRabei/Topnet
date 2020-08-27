import React, { Component } from "react";
import { Table, Image,Pagination } from "semantic-ui-react";
import { connect } from "react-redux";
import ModalUser from "./ModalUser";
import ModalConfirmDelete from "./ModalConfirmDelete";
import ShowImageModal from './ShowImageModal';
import ModalPermission from "./ModalPermission";
import EditPermission from "./EditPermission";
import { Link } from "react-router-dom";
import { Col, Label, Row } from "reactstrap";
import { changeStatus } from "../../../services/userServices/authActions";
import { ImageGroup } from 'react-fullscreen-image'

const color = "blue";


class TableUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }
  componentWillReceiveProps(NextProps) {
    if (NextProps.users) {
      this.setState({ users: NextProps.users });
    }
  }

  //enable / disable user
  async onClickCheckBox(e, user) {

  
    //change post status state
  
    //update enabled user
    user.enabled = e.target.checked;
    await this.props.changeStatus(user);
    
    let users = this.state.users.map(obj => {
        if(obj._id === user._id){
         return  obj = user;
        }else {
          return obj;
        }
     })
     console.log(users)
this.setState({users:users});

  }
  onClickImage(){

  }

  render() {
    console.log("users", this.state.users);
    let usersTabData = this.state.users
      .map((user) => (
        <Table.Row key={user._id}>
          <Table.Cell>
            <Image
            
              src={process.env.PUBLIC_URL + "/Images/" + user.avatar}
              size="tiny"
              circular
            />
          </Table.Cell>
          <Table.Cell>{user.name}</Table.Cell>
          <Table.Cell>{user.email}</Table.Cell>
          <Table.Cell>{user.role}</Table.Cell>
          <Table.Cell>
            {user.adresse.map((obj, index) => (
              <React.Fragment key={index}>
                <Label>{obj.label}</Label>
                <br />{" "}
              </React.Fragment>
            ))}
          </Table.Cell>
          <Table.Cell>
            {user.enabled == true ? (
              <i className="fas fa-check text-success fa-1x" />
            ) : (
              <i className="ni ni-fat-remove text-warning fa-1x" />
            )}
          </Table.Cell>

          {/* <Table.Cell>{user.permission.map((obj,index) => 
  (<React.Fragment key={index}><Label>{obj.publish==true && obj.read==false && obj.edit==false? (
    <p>You have full access</p>
     ) : (
      <p>Not full access</p>
     )} </Label><br/> </React.Fragment>))}
  </Table.Cell>*/}
          <Table.Cell>
            <ModalPermission
              headerTitle="View Permission"
              buttonTriggerTitle="Permission"
              buttonColor="green"
              user={user}
              userid={user._id}
              server={this.props.server}
              socket={this.props.socket}
            />
          </Table.Cell>

          <Table.Cell>
            <Col>
              <ModalUser
                headerTitle="Edit User"
                buttonTriggerTitle="Edit"
                buttonSubmitTitle="Save"
                buttonColor="blue"
                userid={user._id}
                onUserUpdated={this.props.onUserUpdated}
                onUserEnabled={this.props.onUserEnabled}
                server={this.props.server}
                socket={this.props.socket}
              />
              {/* This will be updated for the permission */}
              <Link
                to={"/admin/update-permission/" + user._id}
                className="btn-sm btn-outline-success mr-1 float-left"
              >
                Edit permission
              </Link>

              <ModalConfirmDelete
                headerTitle="Delete User"
                buttonTriggerTitle="Delete"
                buttonColor="red"
                user={user}
                onUserDeleted={this.props.onUserDeleted}
                server={this.props.server}
                socket={this.props.socket}
              />
               <ShowImageModal
                headerTitle="Show Image"
                buttonTriggerTitle="Show"
                buttonColor="pink"
                user={user}
                server={this.props.server}
                socket={this.props.socket}
              />
            </Col>
          </Table.Cell>
          <Table.Cell>
            <label className="custom-toggle">
              <input
                checked={user.enabled}
                type="checkbox"
                onChange={(e) => this.onClickCheckBox(e, user)}
              />
              <span
                className="custom-toggle-slider rounded-circle"
                data-label-off="disable"
                data-label-on="enable"
              />
            </label>
          </Table.Cell>
        </Table.Row>
      ))
      .reverse();

    return (
      <Table singleLine color={color}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>avatar</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Enabled</Table.HeaderCell>
            <Table.HeaderCell>Permissions</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{usersTabData}</Table.Body>
      </Table>
    );
  }
}

export default connect(null, {
  changeStatus,
})(TableUser);
