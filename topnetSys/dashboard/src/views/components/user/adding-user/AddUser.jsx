import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
// Action Redux
import {
  saveUser,
  registerUser,  
} from "../../../../services/userServices/userActions";
import { getAllProducts , getProductById} from "../../../../services/productServices/productActions";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import DataProducts from "../../../../Data/DataProducts.js";
import Select from "react-select";
import axios from "axios";
import io from "socket.io-client";
//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../layouts/Alerts";

import { uploadImage } from "../../../../services/ImageServices/ImageActions";
import ImageUpload from "./ImageUpload";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  FormGroup,
  Form,
  Input,
  ListGroupItem,
  ListGroup,
  Progress,
  Container,
  Row,
  Col,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from "reactstrap";
// core components
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import CountriesData from "../../../../utils/CountryData/CountriesData.json";

import { clearErrors } from "../../../../services/errorServices/errorAction";
import AdvancedAssignement from "./ProductsByCountry/AdvancedAssignement"
import DisplayProducts from "./ProductsByCountry/DisplayProducts"

const roleOptions = [
  { value: "AGENT DME", label: "Agent DME" },
  { value: "AGENT", label: "Agent" },
  { value: "ADMINISTRATEUR", label: "Administrateur" },
];
class AddUser extends React.Component {
  prodTitle = DataProducts.map((prod) => prod._id);

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      dateNaissance:"",
      email: "",
      emailverif: "",
      adresse: [],
      cin : "",
      telephone:"",
      role: "",
      enabled: true,
      avatar:
        "users/avatar/default.png",
      image: {},
      errors: {},
      permission: {},
      pays:[],
      paysSelected: [],
      showProducts: false 
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.SelectRoleInputHandler = this.SelectRoleInputHandler.bind(
      this
    );
  }

  componentWillMount() {
    //get country codes
    const SelectDataForm = [];
    const CountryData = [...CountriesData];
    CountryData.map((country) => {
      //country code and country name mapping to id: text:
      return SelectDataForm.push({
        value: country.code,
        label: country.name + " (" + country.code + ")",
      });
    });
    this.setState({ CountriesData: SelectDataForm });
    console.log("pays",CountriesData);
  }

  //getting data from reducer
  componentWillReceiveProps(nextProps) {
    if (nextProps.user) {
      this.setState({ user: nextProps.users.user });
    }
    //country codes
    if (this.state.CountriesData) {
      const mappedCountryCode = this.state.CountriesData.map(
        (country) => {
          return {
            value: country.value, 
            label: country.label,
          };
        }
      ); // ['TN','FR']
      this.setState({ pays: mappedCountryCode });
    }

    // in case of invalid inputs => getting errors
    if (nextProps.errors) {
      if (nextProps.errors.errors) {
        this.refs.notify.notificationAlert(
          NotificationAlertOptions(
            "danger",
            "Error",
            nextProps.errors.errors[0].msg
          )
        );
        this.props.clearErrors();
      }
    }
    //product added => get success message
    if (nextProps.users.user.message) {
      if (nextProps.user.message !== "") {
        // success notification
        this.refs.notify.notificationAlert(
          NotificationAlertOptions(
            "success",
            "Success",
            nextProps.user.message
          )
        );
        // clear success message
        this.props.clearMessage();
      }
    }
    //To receive user permission
    if (nextProps.permission) {
      console.log("permission ", nextProps.permission);
      this.setState({ permission: nextProps.permission });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  //on Change select user state
  SelectRoleInputHandler = (e) => {
    this.setState({ role: e.value });
  };

  //OnChange Select Country Handler
  SelectCounrtyHandler = (selectedOptions) => {
    const CountryCode = selectedOptions;
    this.setState({ paysSelected: CountryCode });
  };
  ImageUploadRecievedHandler = (img) => {
    this.setState({ image: img });
  };

  onSubmit(e) {
    e.preventDefault();
    if (this.state.image.name !== undefined) {
      /*  */
      let path_to_upload = "users"; // $ /
      let imageName = this.state.image.name.toLowerCase().split(" ").join("-");
      this.state.avatar =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();
      formData.append("img", this.state.image);
      this.props.uploadImage(formData, path_to_upload);
    }

    const userData = {
      name: this.state.name,
      email: this.state.email,
      emailverif: this.state.emailverif,
      dateNaissance: this.state.dateNaissance,
      cin: this.state.cin,
      telephone:this.state.telephone,
      role : this.state.role,
      adresse: this.state.paysSelected.value,
     
    };
    this.props.registerUser(userData, this.props.history);
  }
  render() {
    console.log("stateeee", this.state);
    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}

        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>

        <SimpleHeader name="Ajout Utilisateur" parentName="Utilisateurs" />
        <Container className="mt--6" fluid>
            <Card>
              <CardHeader className="text-center">
                <Col xs="2">
                  <h3 className="mb-0">Ajouter Utilisateur</h3>
                </Col>
                <Col className="text-right" xs="4"></Col>
              </CardHeader>
              <CardBody className="text-center">
                <Form onSubmit={this.onSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                     Information personnelle
                  </h6>
                  <div className="pl-lg-4">
                  <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            Image
                          </label>
                          <ImageUpload
                            ImageUpload={this.ImageUploadRecievedHandler}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nom & Prénom
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Entrer le nom complet"
                              type="text"
                              name="name"
                              value={this.state.name}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                           Date de naissance
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Entrer la date de naissance"
                              type="date"
                              name="dateNaissance"
                              value={this.state.dateNaissance}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Email
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Entrer l'adresse email"
                              type="text"
                              name="email"
                              value={this.state.email}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Reconfirmer Email
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Retapper l'adresse email"
                              type="text"
                              name="emailverif"
                              value={this.state.emailverif}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Rôle
                          </label>
                          <Select
                            defaultValue={roleOptions[1]}
                            name="userState"
                            options={roleOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectRoleInputHandler}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                           CIN
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Entrer le numero CIN"
                              type="text"
                              name="cin"
                              value={this.state.cin}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="3">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Telephone
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Entrer le numero de telephone"
                              type="text"
                              name="telephone"
                              value={this.state.telephone}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr className="my-4" />

                  <h6 className="heading-small text-muted mb-4">
                  Information Relative 
                  </h6>
                    <div className="pl-lg-4"></div>
                    <Row>
                    <Col lg="12">
                        <FormGroup className="row">
                          <Label
                            className="form-control-label"
                            htmlFor="input-username"
                            md="2"
                          >
                            Pays
                          </Label>
                          <Col md="10">
                          <Select
                            isMulti = {false}
                            name="pays"
                            options={this.state.paysSelected}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectCounrtyHandler.bind(this)}
                          />
                          </Col>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Adresse
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Entrer l'adresse"
                              type="text"
                              name="userName"
                              value={this.state.userName}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Ville
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Enter user Name"
                              type="text"
                              name="userName"
                              value={this.state.userName}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Cité
                          </label>
                          <InputGroup
                            className={classnames("input-group-merge")}
                          >
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="ni ni-single-02" />
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              id="input-username"
                              placeholder="Enter user Name"
                              type="text"
                              name="userName"
                              value={this.state.userName}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                   

                   
                   </div>
                 
                  <hr className="my-4" />
                  <Button color="primary" onClick={this.onSubmit}>
                    Ajouter
                  </Button>

                  <Link to="/admin/user/list" className="btn btn-default ">
                    Annuler
                  </Link>
                </Form>

              </CardBody>
            </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  errors: state.errors,
  products: state.products,
  countryCodes: state.countryCodes,
  CountriesData: state.CountriesData,
  users: state.users,
  permission: state.auth.current_permission,
});
export default connect(mapStateToProps, {
  saveUser,
  registerUser,
  uploadImage,
  clearErrors,
  getProductById
})(AddUser);
