import React, { Component } from "react";
import { Modal } from "semantic-ui-react";
import axios from "axios";
import { Button, Collapse, CardLink, Label } from "reactstrap";

class ModalConfirmDelete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleOpen = (e) => this.setState({ modalOpen: true });
  handleClose = (e) => this.setState({ modalOpen: false });

  handleSubmit(e) {
    let params = e.target.getAttribute("data-clientid");

    axios({
      method: "delete",
      responseType: "json",
      url: `/api/clients/client/delete/${params}`,
    })
      .then((response) => {
        this.handleClose();
        this.props.onClientDeleted(response.data.result);
        this.props.socket.emit("delete", response.data.result);
      })
      .catch((err) => {
        this.handleClose();
        throw err;
      });
      window.location.reload(false);

  }

  render() {
    return (
      <Modal
        trigger={
          <Button 
          className={this.props.className}
          onClick={this.handleOpen} 
          href="#pablo"
          id="tooltip443412080">
            <span className="btn-inner--icon mr-1">
                    <i className="fas fa-trash" />
                  </span>
                  <span className="btn-inner--text"> {this.props.buttonTriggerTitle}</span>
          </Button>
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <p>
            Are you sure you want to delete{" "}
            <strong>{this.props.client.clientName}</strong>?
          </p>
        </Modal.Content>
        <Modal.Actions>
          <Button
            onClick={this.handleSubmit}
            data-clientid={this.props.client._id}
            color="red"
          >
            Yes
          </Button>
          <Button onClick={this.handleClose} color="black">
            No
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default ModalConfirmDelete;
