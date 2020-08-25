import React, { Component } from 'react'
import { connect } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import ReactDatetime from "react-datetime";
// Action Redux
import {
    getClient,
    createClient,
    editClient,
  } from "../../../services/clientServices/clientActions";
import { getAllProducts , getProductById} from "../../../services/productServices/productActions";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import DataProducts from "../../../Data/DataProducts.js";
import Select from "react-select";

//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../layouts/Alerts";

import { uploadImage } from "../../../services/ImageServices/ImageActions";
import ImageUpload from "../user/adding-user/ImageUpload";
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
  Collapse,

  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from "reactstrap";
// core components
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import CountriesData from "../../../utils/CountryData/CountriesData.json";

import { clearErrors } from "../../../services/errorServices/errorAction";
import AdvancedAssignement from "./ProductsByCountry/AdvancedAssignement"
import DisplayProducts from "./ProductsByCountry/DisplayProducts"
import AddClient from './../client/AddClient'
const segOptions = [
    { value: "cooperating", label: "cooperating" },
    { value: "not cooperating", label: "not cooperating" },
  ];
  const ssegOptions = [
    { value: "cooperating", label: "cooperating" },
    { value: "not cooperating", label: "not cooperating" },
  ];
  const catOptions = [
    { value: "cooperating", label: "cooperating" },
    { value: "not cooperating", label: "not cooperating" },
  ];
  const Options = [
    { value: "Oui", label: "Non" },
    { value: "Oui", label: "Non" },
  ];
     class Abonnement extends React.Component {
        prodTitle = DataProducts.map((prod) => prod._id);

       constructor(props) {
       
        super(props);
        this.server = process.env.REACT_APP_API_URL || "";
        this.socket = io.connect(this.server);
        this.state = {
          startDate:{},
          endDate:{},
          fichier1:"",
          fichier2:"",
          /**     forfait */


            openedCollapses: ["collapseAds"],
            openedCollapses: ["collapseProds"],
           
            clientPIds: [],

            clientCountryCode: [],
            clientCountryCodeSelected: [],
            
            CountriesData: [],
            errors: {},
            clientAdss: [],
            clients: [],


/****     client */

          clientName:"",
          currentStep: 1,
          segment: "",
          sousSegment: "",
          categorie: "",
          personnel : "",
          typeCompte: "",
          codeClient:"",
          ancienCodeClient: "",
          chargeCompte: {},
          profil: "",        
          statutRecouvrement:"",
          active: false,        
          facturation: "",
          raisonSociale: "",
          nombreSite: "",
          multisite: false,
          categorieSegment: "",
          groupe: "",
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
          products: "",
          origine : "",
          agenceOrigine: "",
          info : "",
          centrale : "",
          couverture: "",
          saturation: "",
          fsi: "",
          info: "",
          clientLogo:
            "https://www.gravatar.com/avatar/c13b5c99e9712a5e17789d046f5583a7",
         
          clientProductIds: [],
          clientProductIdsSelected: [],
         
          image: {},
          errors: {},
          permission: {},
          showProducts: false ,
          show : true,
          search : false,
          hide : false,
          selectedOption: false,
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onSubmit2 = this.onSubmit2.bind(this);
        this.SelectClientStateInputHandler = this.SelectClientStateInputHandler.bind(
          this
        );
        this.componentDidMount=this.componentDidMount.bind(this)
        this.SelectProductInputHandler = this.SelectProductInputHandler.bind(this);
        this.onClickOui = this.onClickOui.bind(this);
        this.onClickNon = this.onClickNon.bind(this);
        this.getClassNameReactDatetimeDays = this.getClassNameReactDatetimeDays.bind(this);
      }
handleReactDatetimeChange = (who, date) => {
        if (
          this.state.startDate &&
          who === "endDate" &&
          new Date(this.state.startDate._d + "") > new Date(date._d + "")
        ) {
          this.setState({
            startDate: date,
            endDate: date
          });
        } else if (
          this.state.endDate &&
          who === "startDate" &&
          new Date(this.state.endDate._d + "") < new Date(date._d + "")
        ) {
          this.setState({
            startDate: date,
            endDate: date
          });
        } else {
          this.setState({
            [who]: date
          });
        }
      };
getClassNameReactDatetimeDays = date => {
        if (this.state.startDate && this.state.endDate) {
        }
        if (
          this.state.startDate &&
          this.state.endDate &&
          this.state.startDate._d + "" !== this.state.endDate._d + ""
        ) {
          if (
            new Date(this.state.endDate._d + "") > new Date(date._d + "") &&
            new Date(this.state.startDate._d + "") < new Date(date._d + "")
          ) {
            return " middle-date";
          }
          if (this.state.endDate._d + "" === date._d + "") {
            return " end-date";
          }
          if (this.state.startDate._d + "" === date._d + "") {
            return " start-date";
          }
        }
        return "";
      };
handleOptionChange(e) {
        this.setState({
          selectedOption: e.target.value
        });
      }
onClickOui(){
        this.setState({show:false, search:true})
       
       } 
onClickNon(){  this.setState({show:false, hide:true}) }
         
    
componentWillMount() {
        //get product from db
       // this.props.getAllProducts();
    
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
        console.log(CountriesData);
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
    
onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
      }
    
      //on Change select client state
SelectClientStateInputHandler = (e) => {
        this.setState({ clientState: e.value });
      };
    
      //on Change select product
SelectProductInputHandler = (selectedOptions) => {
        const clientProductIds = selectedOptions;
        this.setState({ clientProductIdsSelected: clientProductIds });
      };
    
      //OnChange Select Country Handler
SelectCounrtyHandler = (selectedOptions) => {
        const clientCountryCode = selectedOptions;
        this.setState({ clientCountryCodeSelected: clientCountryCode });
       // console.log("selected country code ", clientCountryCode )
        this.setState({clientProductIdsSelected:[]})
        this.props.getProductsByCountryCode(clientCountryCode.value);
       // console.log(this.props.getProductsByCountryCode(selectedOptions.value))
      };
ImageUploadRecievedHandler = (img) => {
        this.setState({ image: img });
      };
     
getProduct(){
        const id = this.state.clientCountryCodeSelected.map((country) => {
          return country.value;
        }); 
        this.getProductById(id);
        
      }
onSubmit(e) {
        e.preventDefault();
        if (this.state.image.name !== undefined) {
          /*  */
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
            statutRecouvrement:this.state.statutRecouvrement,
            active: this.state.active,        
            facturation: this.state.facturation,
            raisonSociale: this.state.raisonSociale,
            nombreSite:this.state.nombreSite,
            multisite: this.state.multisite,
            categorieSegment: this.state.categorieSegment,
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
            lattidue : this.state.lattidue,
            nomComplet: this.state.nomComplet,
            products: this.state.clientProductIdsSelected.map((product) => {
              return product.value;}),
            origine : this.state.origine,
            agenceOrigine: this.state.agenceOrigine,
            info :this.state.info,
            centrale : this.state.centrale,
            couverture: this.state.couverture,
            saturation: this.state.saturation,
            fsi: this.state.fsi,
            info: this.state.info ,
        };
        this.props.createClient(clientData, this.props.history);
      }

onSubmit2(e) {
        e.preventDefault();
        const clientData = {
          clientName: this.state.clientName,
          clientState: this.state.clientState,
          clientLogo: this.state.clientLogo,
          clientCountryCode: this.state.clientCountryCode,
          
        };
        this.props.editClient(this.state.id, clientData, this.props.history);
      }


      
  componentDidMount() {
    this.props.getClient(this.state.id).then((response) =>
      this.setState({
        //clientName: response.payload.clientName,
        clientState: response.payload.clientState,
        clientLogo: response.payload.clientLogo,
        clientCountryCode: response.payload.clientCountryCode,
        clientProductIds: response.payload.clientProductIds,
        
        clientPIds: response.payload.clientProductIds.map((obj, index) => 
        {return {
          value : obj,
          label : obj.title
        }} ),
      })
    );

    //get product from db
    this.props.getAllProducts();

    //get ads from db
   
    this.fetchClients();
  }
  // Fetch data from the back-end
  fetchClients() {
    axios
      .get(`${this.server}/api/clients/list`)
      .then((response) => {
        this.setState({ clients: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.client) {
      const client = nextProps.client;
      // console.log( nextProps.client.client);

      this.setState({
        clientName: client.clientName,
        clientState: client.clientState,
        clientLogo: client.clientLogo,
        clientCountryCode: client.clientCountryCode,
        clientProductIds: client.clientProductIds,
      });
    }
    //assign product
    if (nextProps.products) {
      const mappedProductIds = nextProps.products.products.map((cp) => {
      
        return {
          value: cp,
          label: cp.title,
        };
      });

     const mappedSelected =  this.state.clientPIds.map((obj, index) => 
            {return {
              value : obj,
              label : obj.title
            }} )
      
      let selectedDataProducts = mappedProductIds.filter((obj) =>
        this.state.clientPIds.some((object) => object === obj.value)
      );

      this.setState({
        clientProductIds: mappedProductIds,
        clientProductIdsSelected:this.state.clientPIds ,
      });
    }

   
  }
onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }    

      /************************************************************* */
    handleChange = event => {
      const {name, value} = event.target
      this.setState({
        [name]: value
      })    
    }
     
    handleSubmit = event => {
      event.preventDefault()
      const { email, username, password } = this.state
      alert(`Your registration detail: \n 
             Email: ${email} \n 
             Username: ${username} \n
             Password: ${password}`)
    }
    
    _next = () => {
      let currentStep = this.state.currentStep
      currentStep = currentStep >= 2? 3: currentStep + 1
      this.setState({
        currentStep: currentStep
      })
    }
      
    _prev = () => {
      let currentStep = this.state.currentStep
      currentStep = currentStep <= 1? 1: currentStep - 1
      this.setState({
        currentStep: currentStep
      })
    }
  
  /*
  * the functions for our button
  */
  previousButton() {
    let currentStep = this.state.currentStep;
    if(currentStep !==1){
      return (
        <button 
          className="btn btn-secondary float-left" 
          type="button" onClick={this._prev}>
        Previous
        </button>
      )
    }
    return null;
  }
  
  nextButton(){
    let currentStep = this.state.currentStep;
    if(currentStep <3){
      return (
        <button 
          className="btn btn-primary float-right" 
          type="button" onClick={this._next}>
        Next
        </button>        
      )
    }
    return null;
  }
      
render() {    
      return (
        <React.Fragment>

        <SimpleHeader name="abonnement" parentName="Clients" />
        <Container className="mt--6" fluid>
          <Row>
            <Col lg="12" >
              <Card className="card-plain">
                <CardHeader
                  role="tab"
                  onClick={() => this.collapsesToggle("collapseProds")}
                  aria-expanded={this.state.openedCollapses.includes(
                    "collapseProds"
                  )}
                >
                  <h3 className="mb-0">Abonnement  </h3>
                </CardHeader>
                <Collapse
                  role="tabpanel"
                  isOpen={this.state.openedCollapses.includes("collapseProds")}
                >
                  <CardBody className="text-center">
                    <div >
                      <h6 className="heading-small text-muted mb-4">
                      Formulaire d'un nouvel abonnement
                      </h6>
                      <h4>    Step {this.state.currentStep} </h4> 
                      <div className="pl-lg-4">
                    
  <form onSubmit={this.handleSubmit}>
        {/* 
          render the form steps and pass required props in
        */}
          <Step1 
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange}
            onClickOui={this.onClickOui}
            onClickNon={this.onClickNon}
            onSubmit={this.onSubmit}
            SelectSegInputHandler={this.SelectSegInputHandler}
            email={this.state.email}
            segment={this.state.segment}
            sousSegment={this.state.sousSegment}
            categorie={this.state.categorie}
            personnel={this.state.personnel}
            typeCompte={this.state.typeCompte}
            codeClient={this.state.codeClient}
            ancienCodeClient={this.state.ancienCodeClient}
            chargeCompte={this.state.chargeCompte}
            profil={this.state.profil}
            statutRecouvrement={this.state.statutRecouvrement}
            active={this.state.active}
            facturation={this.state.facturation}
            raisonSociale={this.state.raisonSociale}
            nombreSite={this.state.nombreSite}
            multisite={this.state.multisite}
            categorieSegment={this.state.categorieSegment}
            groupe={this.state.groupe}
            effectif={this.state.effectif}
            tva={this.state.tva}
            timbre={this.state.timbre}
            logo={this.state.logo}
            rue1={this.state.rue1}
            rue2={this.state.rue2}
            ville={this.state.ville}
            gouvernerat={this.state.gouvernerat}
            localite={this.state.localite}
            delegation={this.state.delegation}
            codePostal={this.state.codePostal}
            tel={this.state.tel}
            gsm={this.state.gsm}
            fax={this.state.fax}
            emailTopnet={this.state.emailTopnet}
            email1={this.state.email1}
            email2={this.state.email2}
            email3={this.state.email3}
            lattidue={this.state.lattidue}
            nomComplet={this.state.nomComplet}
            products={this.state.products}
            origine={this.state.origine}
            agenceOrigine={this.state.agenceOrigine}
            info={this.state.info}
            centrale={this.state.centrale}
            couverture={this.state.couverture}
            saturation={this.state.saturation}
            fsi={this.state.fsi}
            info={this.state.info}
            clientLogo={this.state.clientLogo}
            clientProductIds={this.state.clientProductIds}
            clientProductIdsSelected={this.state.clientProductIdsSelected}
            image={this.state.image}
            errors={this.state.errors}
            permission={this.state.permission}
            showProducts={this.state.showProducts}
            show={this.state.show}
            search={this.state.search}
            hide={this.state.hide}
            selectedOption={this.state.selectedOption}
          />
          <Step2 
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange}
            openedCollapses={this.state.openedCollapses}
            onSubmit2={this.state.onSubmit2}
            SelectProductInputHandler={this.SelectProductInputHandler}
            SelectClientStateInputHandler={this.SelectClientStateInputHandler}
            componentWillReceiveProps={this.componentWillReceiveProps}
            fetchClients={this.fetchClients}
            componentDidMount={this.componentDidMount}
            collapsesToggle={this.collapsesToggle}
            clientPIds={this.clientPIds}
            clientCountryCode={this.clientCountryCode}
            clientCountryCodeSelected={this.clientCountryCodeSelected}
            clientProductIds={this.clientProductIds}
            clientProductIdsSelected={this.state.clientProductIdsSelected}
            CountriesData={this.CountriesData}
            errors={this.errors}
            clientAdss={this.clientAdss}
            clients={this.clients}
            products={this.state.products}

          />
          <Step3 
            startDate={this.state. startDate}
            endDate={this.state. endDate}
            fichier1={this.state.fichier1}
            fichier2={this.state.fichier2}
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange}
            getClassNameReactDatetimeDays={this.getClassNameReactDatetimeDays}
            handleReactDatetimeChange={this.handleReactDatetimeChange}
          />
         
          {this.previousButton()}
          {this.nextButton()}

  
  </form>

                      </div>
                    </div>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>
          
        </Container>



        </React.Fragment>
      );
    }

  }
  
  function Step1(props) {
    if (props.currentStep !== 1) {
      return null
    } 
    return (
        <>
          {/********************  NOTIFICATION DIV  *********************/}
  
       {/* <div className="rna-wrapper">
            <NotificationAlert ref="notify" />
          </div>
  
          
          <SimpleHeader name="Add Client" parentName="Clients" />*/} 
           <br/>
          <br/>
          <br/>
          <br/>
          <Container className="mt--6" fluid>
         {console.log(props.show)}
          {props.show ?
          
          <center>
          
          <br/>
          <br/>
                  <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                      <CardHeader className="bg-white pb-5">
                          <div className="text-center">
                          <h4 className="mb-1"> C'est un client Topnet ? </h4>
                            </div>
                        </CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
                          <center>
                        <Button name={props.btnOui} color="success" onClick={props.onClickOui}>Oui</Button>
                        <Button name={props.btnNon} onClick={props.onClickNon}>Non</Button> 
                        </center>
                        </CardBody>
                        
  
                        </Card>
                  </Col> 
                  
          <br/><br/>
          <br/><br/>
          <br/><br/>
          <br/><br/>
          <br/><br/>
          <br/><br/>
          <br/><br/>
          </center>
                   : null }
                  
           
          {props.search ?
          <center>
            <br/><br/>
                  <Col lg="5">
                  <Card className="bg-secondary shadow border-0">
                      <CardHeader className="bg-white pb-5">
                      <h4 className="mb-1"> Récuperer ses coordonnées</h4>
                        <p className="mt-1">
                        avec un seul click
                        </p>
                        
                        </CardHeader>
                        <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center">
                        Entrer  sa matricule {" "}
                        </div>
                        
                        <br/>
                        <br/>
                        <Form role="form">
                          <FormGroup>
                            <InputGroup className="input-group-alternative mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <i className="ni ni-email-83" />
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input placeholder="adresse mail" type="text" />
                            </InputGroup>
                          </FormGroup>
                          <div className="text-center">
                            <Button
                              className="mt-4"
                              color="primary"
                              type="button"
                            >
                              Valider 
                            </Button>
                            <Button
                              className="mt-4"
                              color=""
                              type="button"
                              href="/admin/abonnement"
                            >
                              Retour
                            </Button>
                          </div>
                        </Form>
  
                        </CardBody>
                        
  
                        </Card>
                  </Col> 
                  <br/><br/>
                  <br/><br/>
                  <br/><br/>
                  <br/><br/>
                  <br/><br/>
                  <br/><br/>
                  <br/><br/>
          </center>
                  : null}
                   {props.hide ? 
              <Card>
                <CardHeader className="text-center">
                  <Col xs="2">
                    <h3 className="mb-0">Add New Client</h3>
                  </Col>
                  <Col className="text-right" xs="4"></Col>
                </CardHeader>
                <CardBody className="text-center">
                  <div >
                    <h6 className="heading-small text-muted mb-4">
                    Information Client 
                    </h6>
                    <div className="pl-lg-4">
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
                              defaultValue={segOptions[1]}
                              name="chargeCompte"
                              options={catOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSegInputHandler}
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
                                value={props.codeClient}
                                onChange={props.handleChange}
                                
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
                              onChange={props.SelectSegInputHandler}
                            />
                          </FormGroup>
                        </Col>
                      <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Nombre des sites
                            </label>
                            <Select
                              defaultValue={Options[1]}
                              name="nombreSite"
                              options={Options}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSSegInputHandler}
                            />
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
                              Groupe de société
                            </label>
                            <Select
                              defaultValue={Options[1]}
                              name="groupe"
                              options={Options}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSegInputHandler}
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
                              defaultValue={Options[1]}
                              name="effectif"
                              options={Options}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSSegInputHandler}
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
                              defaultValue={segOptions[1]}
                              name="segment"
                              options={segOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSegInputHandler}
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
                              defaultValue={ssegOptions[1]}
                              name="sousSegment"
                              options={ssegOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSSegInputHandler}
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
                              defaultValue={segOptions[1]}
                              name="segment"
                              options={segOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSegInputHandler}
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
                              defaultValue={ssegOptions[1]}
                              name="sousSegment"
                              options={ssegOptions}
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={props.SelectSSegInputHandler}
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
                                value={props.secteurActivite}
                                onChange={props.handleChange}
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
                                value={props.matriculeFiscale}
                                onChange={props.handleChange}
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
                                value={props.registreCommerce}
                                onChange={props.handleChange}
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
                                value={props.chiffreAffaire}
                                onChange={props.handleChange}
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
                              onChange={props.SelectSegInputHandler}
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
                              onChange={props.SelectSSegInputHandler}
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
                                value={props.rue1}
                                onChange={props.handleChange}
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
                                value={props.rue2}
                                onChange={props.handleChange}
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
                              onChange={props.SelectSegInputHandler}
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
                              onChange={props.SelectSSegInputHandler}
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
                                name="locatile"
                                value={props.localite}
                                onChange={props.handleChange}
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
                                value={props.codePostal}
                                onChange={props.handleChange}
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
                                value={props.ville}
                                onChange={props.handleChange}
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
                                value={props.pays}
                                onChange={props.handleChange}
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
                                value={props.tel}
                                onChange={props.handleChange}
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
                                value={props.fax}
                                onChange={props.handleChange}
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
                                value={props.gsm}
                                onChange={props.handleChange}
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
                                value={props.email1}
                                onChange={props.handleChange}
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
                                value={props.email2}
                                onChange={props.handleChange}
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
                                value={props.email3}
                                onChange={props.handleChange}
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
                                value={props.emailTopnet}
                                onChange={props.handleChange}
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
                      <input type="radio" value="option1" onChange={props.handleOptionChange}  />
                      Oui
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" value="option2" onChange={props.handleOptionChange}  />
                      Non
                    </label>
                  </div>
                          </FormGroup>
                        </Col>
                      </Row>
                      
                    </div>
                   
                    <hr className="my-4" />
                    <Button color="primary" onClick={props.onSubmit}>
                      Ajouter
                    </Button>
  
                    <Link to="/admin/abonnement" className="btn btn-default ">
                      Annuler
                    </Link>
                  </div>
  
                </CardBody>
              </Card>
          : null}
          </Container>
        </>
      );
    
  }
 
  function Step2(props) {
    if (props.currentStep !== 2) {
      return null
    } 
    
    return (
        <>
          <br/>
          <br/>
          <br/>
          <br/>
          <Container className="mt--6" fluid>
            <Row>
              
              <Col lg="12" >
                <Card className="card-plain">
                  
                  <Collapse
                    role="tabpanel"
                    isOpen={props.openedCollapses.includes("collapseProds")}
                  >
                    <CardBody className="text-center0">
                      <div>
                      <h6 className="heading-small text-muted mb-4">
                    Information sur le forfait 
                    </h6>
                        <div className="pl-lg-4">
                  
                          <hr className="my-4" />
                          <h6 className="heading-small text-muted mb-4">
                            choisir le forfait 
                          </h6>
                          <div className="pl-lg-4"></div>
                          <Row>
                            <Col lg="12">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-username"
                                >
                                  Forfait
                                </label>
                                <Select
                                  isMulti
                                  value= {props.clientProductIdsSelected}
                                  name="clientProductIds"
                                  options={props.clientProductIds}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={props.SelectProductInputHandler.bind(
                                    this
                                  )}
                               
                                />



                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                        <Button color="primary" onClick={props.onSubmit2}>
                          Assign
                        </Button>
  
                        <Link
                          to="/admin/client/list"
                          className="btn btn-default "
                        >
                          Cancel
                        </Link>
                      </div>
                    </CardBody>
                  </Collapse>
                </Card>
              </Col>
            </Row>
            
          </Container>
        </>
      );
  }
  
  function Step3(props) {
    if (props.currentStep !== 3) {
      return null
    } 
    return(
      <React.Fragment>
     
      <br/>
      <br/>
      <br/>
        <Container className="mt--6" fluid>

    
<Card>
                  <CardBody>
                    <div className="pl-lg-4">
                    <h6 className="heading-small text-muted mb-4">
                    Informations sur les dates  
                    </h6>
                      <Row className="input-daterange datepicker align-items-center">
                        <Col xs={12} sm={6}>
                          <label className=" form-control-label">
                            Start date
                          </label>
                          <FormGroup>
                          <ReactDatetime
                                id="input-date"
                                type="date"
                                name="startDate"
                                value={props.startDate}
                                //onChange={props.handleChange}
                                onChange={e =>
                                  props.handleReactDatetimeChange("startDate", e)
                                }
                                renderDay={(props1, currentDate, selectedDate) => {
                                  let classes = props1.className;
                                  classes += props.getClassNameReactDatetimeDays(
                                    currentDate
                                  );
                                  return (
                                    <td {...props1} className={classes}>
                                      {currentDate.date()}
                                    </td>
                                  );
                                }}
                              />
                          </FormGroup>
                        </Col>
                        <Col xs={12} sm={6}>
                          <FormGroup>
                            <label className=" form-control-label">
                              End date
                            </label>
                            <FormGroup>
                            <ReactDatetime
                                id="input-date"
                                type="date"
                                name="endDate"
                                value={props.endDate}
                                onChange={e =>
                                  props.handleReactDatetimeChange("endDate", e)
                                }
                                renderDay={(props1, currentDate, selectedDate) => {
                                  let classes = props1.className;
                                  classes += props.getClassNameReactDatetimeDays(
                                    currentDate
                                  );
                                  return (
                                    <td {...props1} className={classes}>
                                      {currentDate.date()}
                                    </td>
                                  );
                                }}
                              />
                          </FormGroup>
                          </FormGroup>
                        </Col>
                      </Row>
                      
                      
                    </div>
                  </CardBody>
                </Card>
      
                <Card>
                  <CardBody>
                    <div className="pl-lg-4">
                    <h6 className="heading-small text-muted mb-4">
                    Informations sur les contrats
                    </h6>
                      
                    <Row>

             < Col lg="6">
              <FormGroup>
               <label
                className="form-control-label"
                htmlFor="input-file"
                >
                     Fichier1
                 </label>
                <InputGroup
                 className={classnames("input-group-merge")}
                 >
        
                 <Input
                  id="input-file"
                  placeholder="fichier 1"
                  type="file"
                  name="fichier1"
                  value={props.fichier1}
                  onChange={props.handleChange}
                />
                </InputGroup>
             </FormGroup>
            </Col>
           <Col lg="6">
           <FormGroup>
             <label
                  className="form-control-label"
                  htmlFor="input-file"
              >
                    Fichier2
               </label>
             <InputGroup
               className={classnames("input-group-merge")}
              >
       
                <Input
                   id="input-username"
                   placeholder="fichier 2"
                   type="file"
                   name="fichier2"
                   value={props.fichier2}
                   onChange={props.handleChange}
                />
             </InputGroup>
         </FormGroup>
         </Col>
        </Row>

    </div>
 </CardBody>
 </Card>
 

<br/>
<br/>

 
<button className="btn btn-success btn-block">Confirmer </button>

<br/>
<br/>


        </Container>
      
      </React.Fragment>
    );
  }
  
Abonnement.propTypes = {
    createClient: PropTypes.func.isRequired,
    editClient: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    getClient: PropTypes.func.isRequired,
  };
  const mapStateToProps = (state) => ({
    client: state.client,
    errors: state.errors,
    products: state.products,
    countryCodes: state.countryCodes,
    CountriesData: state.CountriesData,
    clients: state.clients,
    permission: state.auth.current_permission,
  });
  export default connect(mapStateToProps, {
    createClient,
    editClient,
    getClient,
    getAllProducts,
    getProductById,
    
    uploadImage,
    clearErrors,
    getProductById,
    
  })(Abonnement);