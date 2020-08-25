import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import "semantic-ui-css/semantic.min.css";
import FormUser from './FormUser';

class ModalUser extends Component {

  render() {
    return (
      <Modal
        trigger={<Button color={this.props.buttonColor} >{this.props.buttonTriggerTitle}</Button>}
        dimmer='inverted'
        size='tiny'
        closeIcon='close'
      >
        
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <FormUser
            buttonSubmitTitle={this.props.buttonSubmitTitle}
            buttonColor={this.props.buttonColor}
            userid={this.props.userid}
            onUserAdded={this.props.onUserAdded}
            onUserUpdated={this.props.onUserUpdated}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalUser;
