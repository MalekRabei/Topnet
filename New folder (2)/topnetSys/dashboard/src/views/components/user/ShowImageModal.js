import React, { Component } from 'react';
import { Button, Modal,Image } from 'semantic-ui-react';
import axios from 'axios';
import { ImageGroup } from 'react-fullscreen-image'


class ModalConfirmDelete extends Component {

  constructor(props) {
    super(props);

    this.state ={
      modalOpen: false
    }

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleOpen = e => this.setState({ modalOpen: true });
  handleClose = e => this.setState({ modalOpen: false });

  render() {
    const images=[
       ,
     ]
    return (
      <Modal
      className="Modal"
      overlayClassName="Overlay"
        trigger={
        <Button onClick={this.handleOpen}
         color={this.props.buttonColor}>
          {this.props.buttonTriggerTitle}
          </Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        dimmer='inverted'
        size='tiny'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
   
          <Image
            src={process.env.PUBLIC_URL +"/Images/" + this.props.user.avatar}
          />
          
        </Modal.Content>
        
      </Modal>
    );
  }
}

export default ModalConfirmDelete;
