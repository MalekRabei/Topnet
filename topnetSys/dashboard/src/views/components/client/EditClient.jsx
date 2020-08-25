import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
// Action Redux
import {
  getClient,
  createClient,
  editClient,
  getProductsByCountryCode
} from "../../../services/clientServices/clientActions";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "react-select";
import axios from "axios";
import io from "socket.io-client";
import { getAllProducts, getProductById } from "../../../services/productServices/productActions";
import CountriesData from "../../../utils/CountryData/CountriesData.json";

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
  InputGroupAddonProps,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
} from "reactstrap";
// core components
import SimpleHeader from "../../../components/Headers/SimpleHeader";

import { uploadImage } from "../../../services/ImageServices/ImageActions";
import ImageUpload from "../user/adding-user/ImageUpload";
import DisplayProducts from "./ProductsByCountry/DisplayProducts"
import Fonction from "../../../utils/fonction.json" 

const Options = [
  { value: true, label: "Oui" },
  { value: false, label: "Non" },
];

const EffectifOptions = [
  { value: "10", label: "10" },
  { value: "10/100", label: "entre 10 et 100" },
  { value: "> 100", label: "> 100" },

];

class EditClient extends React.Component {
  constructor(props) {
    super(props);
    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);

    this.state = {
      id: this.props.match.params.id,
      
      users:[],
      user:[],
      userSelected:[],

      chargeCompte: {},
      profil: "",        
      active: false,        
      raisonSociale: "",

      nombreSite: "",
      multisite: false,
      groupe: false,
      dateDebut: "",
      effectif: "",
      secteurActivite: "",
      matriculeFiscale: "",
      tva: false ,
      timbre: false  ,  

      logo: "",
      rue1: "" ,
      rue2: "" ,
      ville : "",
      gouvernerat: "",
      localite: "",
      delegation : "",
      codePostal: "",
      tel : "",
      gsm: "",
      fax: "",
      emailTopnet: "",
      email1: "",
      email2: "",
      email3: "",
      lattidue : "",
      nomComplet: "",
      products: [],
      productIdsSelected: [],
      fonction:"",
     
      image: {},
      errors: {},
      permission: {},
      showProducts: false ,
      show : true,
      search : false,
      searchInput: "",
      hide : false,
      selectedOption: false,
      result: false,
      client: {},

    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.SelectClientStateInputHandler = this.SelectClientStateInputHandler(
      this
    );
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

  async componentWillMount() {
    await this.props.getClient(this.state.id).then((response) => {
      this.setState({
        clientName: response.payload.clientName,
        clientState: response.payload.clientState,
        clientLogo: response.payload.clientLogo,
        clientCC: response.payload.clientCountryCode,
        
        

      });
    });

    //get product from db
    //await this.props.getAllProducts();


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
    let selectedDataCountry = SelectDataForm.filter((obj) =>
      this.state.clientCC.some((object) => object === obj.value)
    );
    this.setState({
      CountriesData: SelectDataForm,
      clientCountryCodeSelected: selectedDataCountry,
    });
  }
 //user 
 SelectUserHandler= (selectedOptions)=> {
  const user = selectedOptions;
  this.setState({userSelected: user })
}

  //OnChange 
   SelectInputHandler = (selectedOptions) => {
    const fonction = selectedOptions;
    this.setState({ profil: fonction.value });
    //set validation to true
  //  this.state.validation["country_code"] = true;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.client) {
      this.setState({
        client: nextProps.client
      });
    }

    //To receive user permission
    if (nextProps.permission) {
      console.log("permission ", nextProps.permission);
      this.setState({ permission: nextProps.permission });
    }
  }

  //on change client state
  SelectClientStateInputHandler = (e) => {
    this.setState({ clientState: e.value });
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  //on Change select product
  SelectProductInputHandler = (selectedOptions) => {
    const clientProductIds = selectedOptions;
    this.setState({ clientProductIdsSelected: clientProductIds });
  };

  //OnChange Select Country Handler
  SelectCounrtyHandler = (selectedOptions) => {
    const clientCountryCode = selectedOptions;
    this.setState({ clientCountryCodeSelected: clientCountryCode });
    console.log("selected country code ", clientCountryCode.value )
    this.props.getProductsByCountryCode(clientCountryCode.value);
    this.setState({clientProductIdsSelected:[], showProducts: true})
    this.props.getProductsByCountryCode(clientCountryCode.value);


  };

  ImageUploadRecievedHandler = (img) => {
    this.setState({ clientLogo: img });
  };

  onSubmit(e) {
    e.preventDefault();
    if (this.state.image.name !== undefined) {
      /* if user avatar selected */
      let path_to_upload = "clients"; // $ /
      let imageName = this.state.image.name.toLowerCase().split(" ").join("-");
      this.state.clientLogo =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();
      formData.append("img", this.state.image);
      this.props.uploadImage(formData, path_to_upload);
    }
    const clientData = {
      chargeCompte: this.state.chargeCompte,
        profil: this.state.profil,        
        active: this.state.active,        
        raisonSociale: this.state.raisonSociale,
        nombreSite:this.state.nombreSite,
        multisite: this.state.multisite,
        groupe:this.state.groupe,
        dateDebut: this.state.dateDebut,
        effectif:this.state.effectif,
        secteurActivite: this.state.secteurActivite,
        matriculeFiscale: this.state.matriculeFiscale,
        tva: this.state.tva ,
        timbre: this.state.timbre  ,  
        logo:this.state.logo,
        rue1: this.state.rue1 ,
        rue2: this.state.rue2 ,
        ville : this.state.ville,
        gouvernerat: this.state.gouvernerat,
        localite: this.state.localite,
        delegation : this.state.delegation,
        codePostal: this.state.codePostal,
        tel : this.state.tel,
        gsm: this.state.gsm,
        fax: this.state.fax,
        emailTopnet: this.state.emailTopnet,
        email1: this.state.email1,
        email2: this.state.email2,
        email3: this.state.email3,
        nomComplet: this.state.nomComplet,
      clientName: this.state.clientName,
      clientState: this.state.clientState,
      clientLogo: this.state.clientLogo,
      clientCountryCode: this.state.clientCountryCodeSelected.value,
    };
    this.props.editClient(this.state.id, clientData, this.props.history);
  }
  render() {
    console.log("state", this.state);

    return (
      <>
        <SimpleHeader name="Edit Client" parentName="Clients" />
        <Container className="mt--6" fluid>
        <Card>
              <CardHeader className="text-center">
                <Col xs="2">
                  <h3 className="mb-0">Modifier information client</h3>
                </Col>
                <Col className="text-right" xs="4"></Col>
              </CardHeader>
              <CardBody className="text-center">
                <Form onSubmit={this.onSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                  Information Client 
                  </h6>
                  <div className="pl-lg-4">
                  <Row>
  
                  <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                           Nom Entreprise
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
                              placeholder="Nom entreprise"
                              type="text"
                              name="nomComplet"
                              value={this.state.nomComplet}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
    
  </Row>
   
                  <Row>
  
                   <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Chargé de compte
    
                              </label>
                          <Select
                            name="chargeCompte"
                            options={this.state.users.map((user)=> {
                              return {
                                value: user,
                                label: user.name
                              }
                            })}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectUserHandler.bind(this)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Fonction
    
                              </label>
                          <Select
                            name="chargeCompte"
                            options={this.state.fonction}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler.bind(this)}
                          />
                        </FormGroup>
                      </Col>
                   </Row>
                    

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">
                     Données Générales
                    </h6>
                    <div className="pl-lg-4"></div>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                           Raison Sociale
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
                              placeholder="Raison Sociale"
                              type="text"
                              name="raisonSociale"
                              value={this.state.raisonSociale}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                      
                      

              
                    </Row>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Multi-sites
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="multisites"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                      { this.state.multisite.value == "oui"?
                    <Col lg="6">
                    <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                          Nombre des sites
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
                              placeholder="Nombre des sites"
                              type="number"
                              name="nombreSite"
                              value={this.state.codeClient}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>  : null}
                    </Row>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Groupe de société
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="groupe"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                           Effectif
                          </label>
                          <Select
                            defaultValue={EffectifOptions[1]}
                            name="effectif"
                            options={EffectifOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">
                    Contacts Principales
                    </h6>
                    <div className="pl-lg-4"></div>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Contact principal
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="segment"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Contact Technique
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="sousSegment"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    </Row><Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Contact Financier
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="segment"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Contact Juridique
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="sousSegment"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">
                      Information sur le compte
                    </h6>
                    <div className="pl-lg-4"></div>
                    <Row>
                    <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                           Secteur d'activité
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
                              placeholder="Secteur d'activité"
                              type="text"
                              name="secteurActivite"
                              value={this.state.secteurActivite}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                           Matricule Fiscale
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
                              placeholder="Matricule Fiscale"
                              type="text"
                              name="matriculeFiscale"
                              value={this.state.matriculeFiscale}
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
                           Registre de commerce
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
                              placeholder="Registre de commerce"
                              type="text"
                              name="registreCommerce"
                              value={this.state.registreCommerce}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                           Chiffre d'affaires annuel
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
                              placeholder="Chiffre d'affaire"
                              type="text"
                              name="chiffreAffaire"
                              value={this.state.chiffreAffaire}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Exonération TVA
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="tva"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Exonération Timbre
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="timbre"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">
                     Coordonnées principales
                    </h6>
                    <div className="pl-lg-4"></div>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                           Rue (1)
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
                              placeholder="Rue (1)"
                              type="text"
                              name="rue1"
                              value={this.state.rue1}
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
                           Rue (2)
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
                              placeholder="Rue (2)"
                              type="text"
                              name="rue2"
                              value={this.state.rue2}
                              onChange={this.onChange}
                            />
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Gouvernerat
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="gouvernerat"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
                        </FormGroup>
                      </Col>
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Délégation
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="delegation"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectInputHandler}
                          />
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
                           Localité
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
                              placeholder="Localité"
                              type="text"
                              name="localite"
                              value={this.state.localite}
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
                           Code postal
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
                              placeholder="Code postal"
                              type="text"
                              name="codePostal"
                              value={this.state.codePostal}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                              placeholder="Ville"
                              type="text"
                              name="ville"
                              value={this.state.ville}
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
                           Pays/région
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
                              placeholder="Pays/Région"
                              type="text"
                              name="pays"
                              value={this.state.pays}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                           Tél
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
                              placeholder="Tél"
                              type="text"
                              name="tel"
                              value={this.state.tel}
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
                           Fax
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
                              placeholder="Fax"
                              type="text"
                              name="fax"
                              value={this.state.fax}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                           GSM
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
                              placeholder="GSM"
                              type="text"
                              name="gsm"
                              value={this.state.gsm}
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
                           Email (1)
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
                              placeholder="Email (1)"
                              type="text"
                              name="email1"
                              value={this.state.email1}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                           Email (2)
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
                              placeholder="Email (2)"
                              type="text"
                              name="email2"
                              value={this.state.email2}
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
                           Email (3)
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
                              placeholder="Email (3)"
                              type="text"
                              name="email3"
                              value={this.state.email3}
                              onChange={this.onChange}
                            />
                          </InputGroup>
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
                           Email Topnet
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
                              placeholder="Email Topnet"
                              type="text"
                              name="emailTopnet"
                              value={this.state.emailTopnet}
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
                           Création nouveau email
                          </label>
                          <div className="radio">
                  <label>
                    <input type="radio" value="option1" onChange={this.handleOptionChange} checked={this.state.selectedOption ==="oui"} />
                    Oui
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input type="radio" value="option2" onChange={this.handleOptionChange}  checked={this.state.selectedOption ==="non"}/>
                    Non
                  </label>
                </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    
                  </div>
                 
                  <hr className="my-4" />
                  <Button color="primary" onClick={this.onSubmit}>
                    Modifier
                  </Button>

                  <Link to="/admin/clients" className="btn btn-default ">
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

/*EditClient.propTypes = {
  createClient: PropTypes.func.isRequired,
  editClient: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  getClient: PropTypes.func.isRequired,

};*/

const mapStateToProps = (state) => ({
  client: state.client,
  errors: state.errors,
  products: state.products,
  countryCodes: state.countryCodes,
  CountriesData: state.CountriesData,
  permission: state.auth.current_permission,
});
export default connect(mapStateToProps, {
  getAllProducts,
  getClient,
  createClient,
  editClient,
  uploadImage,
  getProductById,
  getProductsByCountryCode
})(EditClient);
