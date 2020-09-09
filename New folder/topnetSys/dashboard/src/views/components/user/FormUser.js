import React, { Component } from "react";
import { Message, Button, Form, Select } from "semantic-ui-react";
import axios from "axios";
import "semantic-ui-css/semantic.min.css";

const enabledOptions = [
  { key: "t", text: "true", value: "true" },
  { key: "f", text: "false", value: "false" },
];
//Role Options
const roleOptions = [
  { key: "a", text: "ADMINISTRATOR", value: "ADMINISTRATOR" },
  { key: "e", text: "CONTENTEDITOR", value: "CONTENTEDITOR" },
  { key: "f", text: "FREELANCER", value: "FREELANCER" },
  { key: "cc", text: "CONTENTCOORDINATOR", value: "CONTENTCOORDINATOR" },
  { key: "sm", text: "SALESMANAGER", value: "SALESMANAGER" },
  { key: "cd", text: "CONTENTDIRECTOR", value: "CONTENTDIRECTOR" },
];

class FormUser extends Component {
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
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSelectEnabledChange = this.handleSelectEnabledChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleInputChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  handleSelectChange(e, data) {
    this.setState({ role: data.value });
    this.setState({ enabled: data.value });
  }
  handleSelectEnabledChange(e, data) {
    this.setState({ enabled: data.value });
  }
  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const user = {
      name: this.state.name,
      email: this.state.email,
      avatar: this.state.avatar,
      gender: this.state.gender,
      role: this.state.role,
      enabled: this.state.enabled,
    };

    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    const method = this.props.userid ? "put" : "post";
    const params = this.props.userid ? this.props.userid : "";

    axios({
      method: method,
      responseType: "json",
      url: `${this.props.server}/api/users/${params}`,
      data: user,
    })
      .then((response) => {
        this.setState({
          formClassName: "success",
          formSuccessMessage: response.data.msg,
        });

        if (!this.props.userid) {
          this.setState({
            name: "",
            email: "",
            avatar: "",
            gender: "",
            role: "",
            enabled: "",
          });
          this.props.onUserAdded(response.data.result);
          this.props.socket.emit("add", response.data.result);
        } else {
          this.props.onUserUpdated(response.data.result);
          this.props.socket.emit("update", response.data.result);
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.data) {
            this.setState({
              formClassName: "warning",
              formErrorMessage: err.response.data.msg,
            });
          }
        } else {
          this.setState({
            formClassName: "warning",
            formErrorMessage: "Something went wrong. " + err,
          });
        }
      });
  }

  render() {
    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label="Name"
          type="text"
          placeholder="John Doe"
          name="name"
          maxLength="40"
          required
          value={this.state.name}
          onChange={this.handleInputChange}
        />
        <Form.Input
          label="Email"
          type="email"
          placeholder="johndoe@netacapital.com"
          name="email"
          maxLength="40"
          required
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <Form.Group widths="equal">
          <Form.Field
            control={Select}
            label="Role"
            options={roleOptions}
            placeholder="Role"
            value={this.state.role}
            onChange={this.handleSelectChange}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field
            control={Select}
            label="Enabled"
            placeholder="Enabled"
            options={enabledOptions}
            value={this.state.enabled}
            onChange={this.handleSelectEnabledChange}
          />
        </Form.Group>
        <Message
          success
          color="green"
          header="User Saved successfully!"
          content={formSuccessMessage}
        />
        <Message
          warning
          color="yellow"
          header="Woah!"
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor}>
          {this.props.buttonSubmitTitle}
        </Button>
        <br />
        <br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormUser;
