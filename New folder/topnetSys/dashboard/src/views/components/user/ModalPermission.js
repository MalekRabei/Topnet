import React, { Component } from "react";
import { Button, Modal, Icon } from "semantic-ui-react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";
import FormUser from "./FormUser";

class ModalPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      avatar: "",
      role: "",
      enabled: "",
      formClassName: "",
      formSuccessMessage: "",
      formErrorMessage: "",
      permission: [],
    };
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if user id is provided
    if (this.props.userid) {
      axios
        .get(`${this.props.server}/api/users/${this.props.userid}`)
        .then((response) => {
          this.setState({
            name: response.data.name,
            email: response.data.email,
            permission: response.data.permission,
            gender: response.data.gender,
            role: response.data.role,
            enabled: response.data.enabled,
          });
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  }
  render() {
    //I need to loop through the permission
    console.log(this.state.permission);
    console.log(this.props.userid);
    return (
      <Modal
        trigger={
          <Button color={this.props.buttonColor}>
            {this.props.buttonTriggerTitle}
          </Button>
        }
        closeIcon="close"
      >
        <Modal.Header>{this.props.headerTitle}</Modal.Header>
        <Modal.Content>
          <div>
          <h3>Permissions for {this.state.name}</h3>
          {this.state.permission.map((obj, index) => (
            <React.Fragment key={index}>
              <p>
                {
                obj.publish == false ? (
                  <div>
                    <div>
                      {" "}
                      <p>Permissions on {obj.siteDomain} </p>
                    </div>
                    <div>
                      {" "}
                      <p>
                        Read Only:
                        <i className="fas fa-check text-success fa-1x" />{" "}
                      </p>
                       <p>
                        Publish:
                        <i className="ni ni-fat-remove text-warning fa-1x" />{" "}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>
                     {" "}
                     
                    </p>
                  </div>
                )}

                {obj.publish == true ? (
                  <div>
                    {" "}
                    <p>
                    <p>
                        Read :
                        <i className="fas fa-check text-success fa-1x" />{" "}
                      </p>
                      <p>
                        Edit:
                        <i className="fas fa-check text-success fa-1x" />{" "}
                      </p>
                      Publish:
                      <i className="fas fa-check text-success fa-1x" />{" "}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p></p>
                  </div>
                )}
              </p>
              <br />{" "}
            </React.Fragment>
          ))}
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ModalPermission;
