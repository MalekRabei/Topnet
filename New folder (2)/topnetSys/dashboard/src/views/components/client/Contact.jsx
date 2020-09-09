import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../layouts/Alerts";
import ReactBSAlert from "react-bootstrap-sweetalert";

// Action Redux
import {
  getClient,
  createClient,
  editClient,
  createContact,
  clearMessage,
  getAllContacts,
  deleteContact
} from "../../../services/clientServices/clientActions";
import { clearErrors } from "../../../services/errorServices/errorAction";

import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "react-select";

//TABLE
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
// react plugin that prints a given react component
import ReactToPrint from "react-to-print";

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
  Collapse,
  Table,
  UncontrolledTooltip,
  ButtonGroup,
  Label
} from "reactstrap";
// core components
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import { dataTable } from "../../../variables/general";
import Fonction from "../../../utils/fonction.json"
import Adresse from "../../../utils/adresse.json"


const stateOptionsByValue = {
  cooperating: { value: "cooperating", label: "cooperating" },
  "active": { value: "active", label: "active" },
  "already cooperated": {
    value: "already cooperated",
    label: "already cooperated",
  },
};
const { SearchBar } = Search;
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
const stateOptions = Object.values(stateOptionsByValue);


const Options = [
  { value: true, label: "Oui" },
  { value: false, label: "Non" },
];
class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);
    this.state = {
      openedCollapses: ["collapseContact1"],
      openedCollapses: ["collapseContact2"],
      openedCollapses: ["collapseContact3"],
      openedCollapses: ["collapseContact4"],
      id: this.props.match.params.id,
      nom:"",
      prenom:"",
      contacts:[],
      civilite:"",
      cin:"",
      fonctionS:"",
      fonction:"",
      resident:"",
  
      rue1: "" ,
      rue2: "" ,
      ville : "",
      gouvernorat: "",
      gouvernoratS:"",
      localite: "",
      localiteS:"",
      delegation : "",
      delegationS:"",
      codePostal: "",
      codePostalS:"",
      tel : "",
      gsm: "",
      fax: "",
      email1: "",
      email2: "",
      email3: "",
      alert: null,
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
      //input for test validation
      validation: {
      nom :true,
      prenom:true,  
      civilite:true,
      cin:true,  
      rue1: true ,
      rue2:true,
      fonction:true,
      resident:true,
      gouvernorat: true,
      localite: true,
      delegation : true,
      codePostal: true,
      tel : true,
      email1: true,
      },
    };
    //this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.fetchContacts= this.fetchContacts.bind(this);
    this.getUnique = this.getUnique.bind(this)


  }
   // Fetch data from the back-end
   fetchContacts() {
    axios
      .get(`${this.server}/api/contact/list`)
      .then((response) => {
        this.setState({ contacts: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  componentDidMount() {
    this._isMounted = true;
    this.fetchContacts();
  }


  collapsesToggle = (collapse) => {
    let openedCollapses = this.state.openedCollapses;
    if (openedCollapses.includes(collapse)) {
      this.setState({
        openedCollapses: [],
      });
    } else {
      this.setState({
        openedCollapses: [collapse],
      });
    }
  };

  SelectCiviliteHandler = (selectedOptions) => {
    const civ = selectedOptions;
    this.setState({ civilite: civ.value });

  };
  SelectResidentHandler = (selectedOptions) => {
    const res= selectedOptions;
    this.setState({ resident: res.value });

  };
  SelectFonctionInputHandler = (selectedOptions) => {
    const fonction = selectedOptions;
    this.setState({ profil: fonction.value });

  };
  //OnChange Select Country Handler
  SelectgouvernoratHandler = (selectedOptions) => {
    const gouvernorat = selectedOptions;
    this.setState({ gouvernorat: gouvernorat.value });

  };
    //OnChange Select Country Handler
SelectDelegationHandler = (selectedOptions) => {
  const del = selectedOptions;
  this.setState({ delegation: del.value.delegation });

};
  //OnChange Select Country Handler
  SelectLocaliteHandler = (selectedOptions) => {
    const localite = selectedOptions;
    this.setState({ localite: localite.value.localite });

  };
    //OnChange Select Country Handler
SelectCodePostalHandler = (selectedOptions) => {
  const code = selectedOptions;
  this.setState({ codePostal: code.value.codePostal });

};
  componentWillMount() {
    //this.fetchContacts();
    this.props.getAllContacts();

    const SelectDataForm = [];
    const fonction = [...Fonction];
    fonction.map((fct) => {
      //country code and country name mapping to id: text:
      return SelectDataForm.push({
        value: fct.num,
        label: fct.fonction + " (" + fct.num + ")",
      });
    });
    this.setState({ 
      fonctionS: SelectDataForm ,
    });
    console.log(fonction);

    const gouvernoratData = [];
    const gouvernoratS = [...Adresse];
    gouvernoratS.map((ad)=>{
      return gouvernoratData.push({
        value : ad.gouvernorat,
        label: ad.gouvernorat
      })
    })
    this.setState({gouvernoratS: gouvernoratData })
    console.log(gouvernoratS);


    const LocaliteData = [];
    const localiteS = [...Adresse];
    localiteS.map((ad)=>{
      return LocaliteData.push({
        value : ad,
        label: ad.localite
      })
    })
    this.setState({localiteS: LocaliteData })
    console.log(localiteS);

    const delegationData = [];
    const delegationS = [...Adresse];
    delegationS.map((ad)=>{
      return delegationData.push({
        value : ad,
        label: ad.delegation
      })
    })
    this.setState({delegationS: delegationData })
    console.log("del",delegationS);


    const CodePostalData = [];
    const codePostalS = [...Adresse];
    codePostalS.map((ad)=>{
      return CodePostalData.push({
        value : ad,
        label: ad.codePostal
      })
    })
    this.setState({codePostalS: CodePostalData })
    console.log(codePostalS);
  }

  componentWillReceiveProps(nextProps) {
    
     //fonction
     if (this.state.fonctionS) {
      const mappedclientfonction = this.state.fonctionS.map(
        (fct) => {
          return {
            value: fct.value,
            label: fct.label,
          };
        }
      );
      this.setState({ profil: mappedclientfonction });
    }

    //gouvernorat
    if (this.state.gouvernoratS) {
      const mappedGouv = this.state.gouvernoratS.map(
        (ad) => {
          return {
            value: ad.value,
            label: ad.label,
          };
        }
      );
      this.setState({ gouvernorat: mappedGouv });
    }
    //delegation
    if (this.state.delegationS) {
      const mappedDel = this.state.delegationS.map(
        (ad) => {
          return {
            value: ad.value,
            label: ad.label,
          };
        }
      );
      this.setState({ delegation: mappedDel });
    }
    ///localite
    if (this.state.localiteS) {
      const mappedLoc = this.state.localiteS.map(
        (ad) => {
          return {
            value: ad.value,
            label: ad.label,
          };
        }
      );
      this.setState({ localite: mappedLoc });
    }
    //code postal
    if (this.state.codePostalS) {
      const mappedCP = this.state.codePostalS.map(
        (ad) => {
          return {
            value: ad.value,
            label: ad.label,
          };
        }
      );
      this.setState({ codePostal: mappedCP });
    console.log(nextProps)
    }


    
    // in case of invalid inputs => getting errors
    if (nextProps.errors) {
      //invalid credentials => show error alert with error
      if (nextProps.errors.errors) {
        let validation = this.state.validation;
        nextProps.errors.errors.map((value, index) => {
          if (value.value === "") {
            validation[value.param] = false;
          }
          this.setState({ validation: validation });
        });

        this.refs.notify.notificationAlert(
          NotificationAlertOptions(
            "danger",
            "Error",
            nextProps.errors.errors[0].msg
          )
        );
        //clear errors
        this.props.clearErrors();
      }
    }
   /* if (nextProps.clients.message) {
      if (nextProps.clients.message !== "") {
        // success notification
        this.refs.notify.notificationAlert(
          NotificationAlertOptions(
            "success",
            "Success",
            nextProps.clients.message
          )
        );
        // clear success message
        this.props.clearMessage();
        this.setState({
          nom:"",
          prenom:"",
      
          civilite:"",
          cin:"",
          fonctionS:"",
          fonction:"",
          resident:"",
      
          rue1: "" ,
        })
      }
  }*/

  }
  //Question Alert when deleting 
  questionAlert = (e, id) => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "100px" }}
          title="Voulez vous vraiment supprimer ce contact ?"
          customIcon={
            <div
              className="swal2-icon swal2-question swal2-animate-question-icon"
              style={{ display: "flex" }}
            >
              <span className="swal2-icon-text"></span>
            </div>
          }
          onConfirm={() => {
            //deleting the product
            this.props.deleteContact(id);
            //hiding the alert
            this.hideAlert();
            //showing success notification
            this.refs.notify.notificationAlert(
              NotificationAlertOptions(
                "success",
                "Success",
                "Contact supprimé avec  succés"
              )
            );
            window.location.reload(false);
          }}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="default"
          confirmBtnText="Ok"
          btnSize=""
        >
        </ReactBSAlert>
      ),
    });
  };
  //hide the alert
  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    let target = e.target.name;
    //change input validation
    this.state.validation[target] = true;
  }
  getUnique(arr, index) {

    const unique = arr
         .map(e => e[index])
  
         // store the keys of the unique objects
         .map((e, i, final) => final.indexOf(e) === i && i)
  
         // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);      
  
     return unique;
  }


  onSubmit(e) {
    e.preventDefault();

    const contactData = {
        nom:this.state.nom,
        prenom:this.state.prenom, 
        civilite:this.state.civilite,
        cin:this.state.cin,
        fonction:this.state.fonction,
        resident:this.state.resident,
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
        email1: this.state.email1,
        email2: this.state.email2,
        email3: this.state.email3,
      
    };
    this.props.createContact(contactData);
  }
  render() {
    
    console.log(this.state);


    return (
      <>
     {/********************  ALERT DIV  *********************/}
       {this.state.alert}
        {/********************  NOTIFICATION DIV  *********************/}

        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>
        

        <SimpleHeader name="Contacts" parentName="Clients" />
        <Container className="mt--6" fluid>
          <Row>
            
            <Col lg="11" >
              <Card className="card-plain">
                <CardHeader
                  role="tab"
                  onClick={() => this.collapsesToggle("collapseContact1")}
                  aria-expanded={this.state.openedCollapses.includes(
                    "collapseContact1"
                  )}
                >
                  <h3 className="mb-0">Ajouter Contact </h3>
                </CardHeader>
                <Collapse
                  role="tabpanel"
                  isOpen={this.state.openedCollapses.includes("collapseContact1")}
                >
                  <CardBody className="text-center">
                    <Form onSubmit={this.onSubmit}>
                      <h6 className="heading-small text-muted mb-4">
                        Information
                      </h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-username"
                              >
                                Nom 
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
                                  placeholder="Nom"
                                  type="text"
                                  name="nom"
                                  value={this.state.nom}
                                  onChange={this.onChange}
                                  invalid={!this.state.validation.nom}  
                                />
                              </InputGroup>
                              {!this.state.validation.nom ? (
                              <InputGroup className="invalid-feedback">
                                Champs Obligatoire.
                              </InputGroup>
                              ) : (
                                ""
                              )}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-username"
                              >
                                Prénom
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
                                  placeholder="Prénom"
                                  type="text"
                                  name="prenom"
                                  value={this.state.prenom}
                                  onChange={this.onChange}
                                  invalid={!this.state.validation.prenom}

                                  
                                />
                              </InputGroup>
                              {!this.state.validation.prenom ? (
                        <InputGroup className="invalid-feedback">
                          Champs Obligatoire.
                        </InputGroup>
                      ) : (
                        ""
                      )}
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
                              name="fonction"
                               options={this.state.fonctionS}
                               className="basic-multi-select"
                               classNamePrefix="select"
                               onChange={this.SelectFonctionInputHandler.bind(this)}
                              
                              />
                            </FormGroup>
                          </Col>
                          <Col lg="6">
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
                                  placeholder="CIN"
                                  type="number"
                                  name="cin"
                                  value={this.state.cin}
                                  onChange={this.onChange}
                                  invalid={!this.state.validation.cin}

                                  
                                />
                              </InputGroup>
                              {!this.state.validation.cin ? (
                        <InputGroup className="invalid-feedback">
                          Champs Obligatoire.
                        </InputGroup>
                      ) : (
                        ""
                      )}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-email"
                              >
                                Civilité
                              </label>
                              <Select
                                 defaultValue={Options[1]}
                                 name="civilite"
                                 options={Options}
                                 className="basic-multi-select"
                                 classNamePrefix="select"
                                 onChange={this.SelectCiviliteHandler.bind(this)}
                                 invalid={!this.state.validation.civilite}  
                                 />
                               {!this.state.validation.civilite? (
                               <InputGroup className="invalid-feedback">
                                 Champs Obligatoire.
                               </InputGroup>
                               ) : (
                                 ""
                               )}
                            </FormGroup>
                          </Col>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-email"
                              >
                                Resident
                              </label>
                              <Select
                               defaultValue={Options[1]}
                               name="resident"
                               options={Options}
                               className="basic-multi-select"
                               classNamePrefix="select"
                               onChange={this.SelectResidentHandler.bind(this)}
                               invalid={!this.state.validation.resident}  
                                />
                             
                              {!this.state.validation.resident? (
                              <InputGroup className="invalid-feedback">
                                Champs Obligatoire.
                              </InputGroup>
                              ) : (
                                ""
                              )}
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
                                  invalid={!this.state.validation.rue1}

                                />
                              </InputGroup>
                              {!this.state.validation.rue1 ? (
                        <InputGroup className="invalid-feedback">
                          Champs Obligatoire.
                        </InputGroup>
                      ) : (
                        ""
                      )}
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
                                  invalid={!this.state.validation.rue2}  
                                  />
                                </InputGroup>
                                {!this.state.validation.rue2? (
                                <InputGroup className="invalid-feedback">
                                  Champs Obligatoire.
                                </InputGroup>
                                ) : (
                                  ""
                                )}
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
                                gouvernorat
                              </label>
                              <Select
                                name="gouvernorat"
                                options={this.getUnique(this.state.gouvernoratS,'label')}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.SelectgouvernoratHandler.bind(this)}
                                invalid={!this.state.validation.gouvernorat}  
                                />
                              
                              {!this.state.validation.gouvernorat ? (
                              <InputGroup className="invalid-feedback">
                                Champs Obligatoire.
                              </InputGroup>
                              ) : (
                                ""
                              )}
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
                                name="delegation"
                                options={this.getUnique(this.state.delegationS.filter((del)=>
                                  del.value.gouvernorat === this.state.gouvernorat
                                ),'label')}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.SelectDelegationHandler.bind(this)}
                                invalid={!this.state.validation.delegation}  
                                />
                              {!this.state.validation.delegation ? (
                              <InputGroup className="invalid-feedback">
                                Champs Obligatoire.
                              </InputGroup>
                              ) : (
                                ""
                              )}
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
                              
                              <Select
                              
                                name="localite"
                                options={this.state.localiteS.filter((del)=>
                                  del.value.gouvernorat === this.state.gouvernorat
                                  && del.value.delegation === this.state.delegation
                                )}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.SelectLocaliteHandler.bind(this)}
                                invalid={!this.state.validation.localite}  
                                />
                              
                              {!this.state.validation.localite ? (
                              <InputGroup className="invalid-feedback">
                                Champs Obligatoire.
                              </InputGroup>
                              ) : (
                                ""
                              )}
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
                              <Select
                             
                                name="codePostal"
                                options={this.state.codePostalS.filter((del)=>
                                  del.value.gouvernorat === this.state.gouvernorat
                                  && del.value.delegation === this.state.delegation
                                  && del.value.localite === this.state.localite
                                )}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.SelectCodePostalHandler.bind(this)}
                                invalid={!this.state.validation.codePostal}  
                                />
                              {!this.state.validation.codePostal ? (
                              <InputGroup className="invalid-feedback">
                                Champs Obligatoire.
                              </InputGroup>
                              ) : (
                                ""
                              )}
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
                              Région
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
                                  type="number"
                                  name="tel"
                                  value={this.state.tel}
                                  onChange={this.onChange}
                                  invalid={!this.state.validation.tel}  
                                  />
                                </InputGroup>
                                {!this.state.validation.tel ? (
                                <InputGroup className="invalid-feedback">
                                  Champs Obligatoire.
                                </InputGroup>
                                ) : (
                                  ""
                                )}
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
                                  type="number"
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
                                  type="number"
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
                                  invalid={!this.state.validation.email1}  
                                  />
                                </InputGroup>
                                {!this.state.validation.email1 ? (
                                <InputGroup className="invalid-feedback">
                                  Champs Obligatoire.
                                </InputGroup>
                                ) : (
                                  ""
                                )}
                            </FormGroup>
                          </Col>
                        </Row>

                      </div>
                      <hr className="my-4" />
                      <Button color="primary" onClick={this.onSubmit}>
                        Ajouter
                      </Button>

                      <Link
                        to="/admin/client/list"
                        className="btn btn-default "
                      >
                        Annuler
                      </Link>
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
             
          </Row>
          <br/><br/><br/>
         <Col lg="12">
            <br/> <br/>
            <Card>
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Contact Existant </h3>
              </CardHeader>
               <ToolkitProvider
                  data={this.state.contacts}
                  keyField="name"
                  columns={[
                    {
                      dataField: "nom",
                      text: "Nom",
                      sort: true,
                    },
                    {
                      dataField: "prenom",
                      text: "Prénom",
                      sort: true,
                    },
                    {
                      dataField: "cin",
                      text: "CIN",
                      sort: true,
                    },
                    {
                      dataField: "tel",
                      text: "Téléphone",
                      sort: true,
                    },
                    {
                      dataField: "gsm",
                      text: "GSM",
                      sort: true,
                    },
                    {
                      dataField: "email",
                      text: "Email",
                      sort: true,
                    },
                    {
                      dataField: "fonction",
                      text: "Fonction",
                      sort: true,
                    },
                    {
                      dataField: "link",
                      text: "ACTION",
                      formatter: (rowContent, row) => {
                        return (
                          <div>
                              <UncontrolledTooltip
                              delay={0}
                              trigger="hover focus"
                              target={`tooltip${row._id}`}
                            >
                              Supprimer
                            </UncontrolledTooltip>
                            <Button
                              className="mr-4"
                              color="danger"
                              onClick={(e) =>
                                this.questionAlert(e, row._id)
                              }
                              size="sm"
                              id={`tooltip${row._id}`}
                            >
                              <i className="fas fa-trash" />
                            </Button>
                            {/* ) : null} */}
                          </div>
                        );
                      },
                    },
                  ]}
                  search
                >
                  {props => (
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
             </Col>
             </Container>
      </>
    );
  }
}


Contact.propTypes = {
  createContact: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  client: state.client,
  errors: state.errors,
  contact: state.contact,
  contacts: state.contacts

});
export default connect(mapStateToProps, {
createContact,
clearErrors,
clearMessage,
deleteContact,
getAllContacts
})(Contact);
