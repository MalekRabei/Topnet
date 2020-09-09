import React, { Component } from 'react';
import {  Modal,Image } from 'semantic-ui-react';
import axios from 'axios';
import { ImageGroup } from 'react-fullscreen-image'
import {Button} from "reactstrap";


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
        <Button 
        onClick={this.handleOpen}
        className={this.props.className}
        color={this.props.buttonColor}
        id="tooltip4434120803">
           <span className="btn-inner--icon mr-1">
                    <i className="ni ni-zoom-split-in" />
                  </span>
                  <span className="btn-inner--text">
        {this.props.buttonTriggerTitle}</span>
          </Button>}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        dimmer='inverted'
        size='large'
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
   
          <Image
            src={process.env.PUBLIC_URL +"/Images/" + this.props.abonnement.fichier1recto}
          />
          
        </Modal.Content>
        
      </Modal>
    );
  }
}

export default ModalConfirmDelete;
