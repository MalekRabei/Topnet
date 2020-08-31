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
import { clearErrors } from "../../../services/errorServices/errorAction";

import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "react-select";
import axios from "axios";
import io from "socket.io-client";
import { getAllProducts, getProductById } from "../../../services/productServices/productActions";

//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../layouts/Alerts";

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
import Fonction from "../../../utils/fonction.json";
import Adresse from "../../../utils/adresse.json";


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
      showNbSite:false,
      groupe: false,
      dateDebut: "",
      effectif: "",
      secteurActivite: "",
      matriculeFiscale: "",
      tva: false ,
      showTva: false,
      tvaFile: "",
      timbre: false  ,  
      showTimbre:false,
      timbreFile:"",

      logo: "",
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
      emailTopnet: "",
      email1: "",
      email2: "",
      email3: "",
      lattidue : "",
      nomComplet: "",
      products: [],
      productIdsSelected: [],
      fonction:"",
     
      imagetva: {},
      imageMatricule:{},
      imageRegistre:{},
      imageTimbre:{},
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
    this.getUnique = this.getUnique.bind(this);
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

    this.fetchUsers();
    
    //get country codes
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
      fonction: SelectDataForm ,
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

    await this.props.getClient(this.state.id).then((response) => {
      this.setState({
       chargeCompte: response.payload.chargeCompte,
        profil: response.payload.profil,
        active: response.payload.active,
        raisonSociale: response.payload.raisonSociale,
        nombreSite: response.payload.nombreSite,
        multisite: response.payload.multisite,
        groupe: response.payload.groupe,
        dateDebut: response.payload.dateDebut,
        effectif: response.payload.effectif,

        secteurActivite: response.payload.secteurActivite,
        matriculeFiscale: response.payload.matriculeFiscale,
        registreCommerce : response.payload.registreCommerce,
        chiffreAffaire : response.payload.chiffreAffaire,
        tva: response.payload.tva,
        tvaFile: response.payload.tvaFile,
        timbre: response.payload.timbre,
        timbreFile: response.payload.timbreFile,
        logo: response.payload.logo,

         rue1: response.payload.rue1,
         rue2: response.payload.rue2,
         ville : response.payload.ville,
         gouvernerat: response.payload.gouvernerat,
         localite:response.payload.localite,
         delegation : response.payload.delegation,
         codePostal: response.payload.codePostal,
         pays : response.payload.pays,
         tel : response.payload.tel,
         gsm: response.payload.gsm,
         fax: response.payload.fax,
         emailTopnet: response.payload.emailTopnet,
         email1: response.payload.email1,
         email2: response.payload.email2,
         email3: response.payload.email3,
         nomComplet: response.payload.nomComplet,
         products: response.payload.products,
         contact: response.payload.contact
        

      });
    });


  }
 //user 
 SelectUserHandler= (selectedOptions)=> {
  const user = selectedOptions;
  this.setState({userSelected: user })
}

  //OnChange Select Country Handler
  SelectFonctionInputHandler = (selectedOptions) => {
    const fonction = selectedOptions;
    this.setState({ profil: fonction.value });

  };
//OnChange Select Country Handler
SelectMultisiteHandler = (selectedOptions) => {
  const multi = selectedOptions;
  this.setState({ multisite: multi.value });
  if(multi.value=== true){
    this.setState({showNbSite: true})
  }else {
    this.setState({showNbSite: false})

  }
}
  //OnChange Select Country Handler
  SelectGroupeHandler = (selectedOptions) => {
    const groupe= selectedOptions;
    this.setState({ groupe: groupe.value });

  };
  //OnChange Select Country Handler
  SelectEffectifHandler = (selectedOptions) => {
    const effectif = selectedOptions;
    this.setState({ effectif: effectif.value });

  };
  //OnChange Select Country Handler
  SelectTvaHandler = (selectedOptions) => {
    const tva = selectedOptions;
    this.setState({ tva: tva.value });
    if(tva.value=== true){
      this.setState({showTva: true})
    }else{
      this.setState({showTva: false})

    }

  };

  //OnChange Select Country Handler
  SelectTimbreHandler = (selectedOptions) => {
    const timbre = selectedOptions;
    this.setState({ timbre: timbre.value });
    if(timbre.value=== true){
      this.setState({ showTimbre: true});
    }else {
      this.setState({ showTimbre: false});

    }

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
    const codePostal = selectedOptions;
    this.setState({ codePostal: codePostal.value.codePostal });

  };

  //user 
  SelectUserHandler= (selectedOptions)=> {
    const user = selectedOptions;
    this.setState({userSelected: user })
  }

  //on Change select client state
  SelectClientStateInputHandler = (e) => {
    this.setState({ clientState: e.value });
  };

  //OnChange 
   SelectInputHandler = (selectedOptions) => {
    const fonction = selectedOptions;
    this.setState({ profil: fonction.value });
    //set validation to true
  //  this.state.validation["country_code"] = true;
  };

  componentWillReceiveProps(nextProps) {

  //fonction
  if (this.state.fonction) {
    const mappedclientfonction = this.state.fonction.map(
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
}

   // in case of invalid inputs => getting errors
   if (nextProps.errors) {
    //invalid credentials => show error alert with error
    if (nextProps.errors.errors) {
      //  let validation = this.state.validation;
      //  nextProps.errors.errors.map((value, index) => {
      //   if (value.value === "") {
      //    validation[value.param] = false;
      //   }
      //  this.setState({ validation: validation });
      // });WW

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
    if (nextProps.client) {
        this.setState({
          client: nextProps.client
        });
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


  ImageTVAUploadRecievedHandler = (img) => {
    this.setState({ imagetva: img });
  };
  ImageTimbreUploadRecievedHandler = (img) => {
    this.setState({ imageTimbre: img });
  };
  ImageRegistreUploadRecievedHandler = (img) => {
    this.setState({ imageRegistre: img });
  };
  ImageMatriculeUploadRecievedHandler = (img) => {
    this.setState({ imageMatricule: img });
  };
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
    if (this.state.imagetva.name !== undefined) {
      /*  */
      let path_to_upload = "clients"; // $ /
      let imageName = this.state.imagetva.name.toLowerCase().split(" ").join("-");
      this.state.tvaFile =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();

      formData.append("img", this.state.imagetva);
      this.props.uploadImage(formData, path_to_upload);
    }
    if (this.state.imageTimbre.name !== undefined) {
      /*  */
      let path_to_upload = "clients"; // $ /
      let imageName = this.state.imageTimbre.name.toLowerCase().split(" ").join("-");
      this.state.timbreFile =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();

      formData.append("img", this.state.imageTimbre);
      this.props.uploadImage(formData, path_to_upload);
    }
    if (this.state.imageMatricule.name !== undefined) {
      /*  */
      let path_to_upload = "clients"; // $ /
      let imageName = this.state.imageMatricule.name.toLowerCase().split(" ").join("-");
      this.state.matriculeFiscale =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();

      formData.append("img", this.state.imageMatricule);
      this.props.uploadImage(formData, path_to_upload);
    }
    if (this.state.imageRegistre.name !== undefined) {
      /*  */
      let path_to_upload = "clients"; // $ /
      let imageName = this.state.imageRegistre.name.toLowerCase().split(" ").join("-");
      this.state.registreCommerce =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();

      formData.append("img", this.state.imageRegistre);
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
       
    };
    this.props.editClient(this.state.id, clientData, this.props.history);
  }
  render() {
    console.log(this.state)
    console.log(this.getUnique(this.state.gouvernoratS,'label'))

    return (
      <>
        <SimpleHeader name="Edit Client" parentName="Clients" />
        <Container className="mt--6" fluid 
        >
        <Card>
              <CardHeader className="text-center">
                <Col xs="2">
                  <h3 className="mb-0">Modifier Client</h3>
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
                           value={
                            this.state.users.map((user)=> {
                              return {
                                value: user,
                                label: user.name
                              }
                            }).filter(
                              (obj) => obj.label === this.state.chargeCompte.label
                            )[0]
                            
                          }
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
                        value={
                          this.state.fonction.filter(
                            (obj) => obj.value === parseInt(this.state.profil)
                          )[0] }

                            name="profil"
                            options={this.state.fonction}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectFonctionInputHandler.bind(this)}
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
                            value={
                              Options.filter(
                                (obj) => obj.value ===this.state.multisite
                              )[0] }
                            name="multisites"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectMultisiteHandler.bind(this)}
                          />
                        </FormGroup>
                      </Col>
                      { this.state.showNbSite?
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
                            value={
                              Options.filter(
                                (obj) => obj.value ===this.state.groupe
                              )[0] }
                            name="groupe"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectGroupeHandler.bind(this)}
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
                            value={
                              Options.filter(
                                (obj) => obj.value ===this.state.effectif
                              )[0] }
                            name="effectif"
                            options={EffectifOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectEffectifHandler.bind(this)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <hr className="my-4" />

                    <h6 className="heading-small text-muted mb-4">
                    Contacts
                    </h6>
                    <div className="pl-lg-4"></div>

                    <Button
                  className="btn-round btn-icon"
                  href="#pablo"
                  id="tooltip443412080"
                  size="bg"
                  color="default"
                  to={`/admin/add-client-contact`}
                  tag={Link}
                >
                  
                  <span className="btn-inner--icon mr-1">
                    <i className="ni ni-single-copy-04" />
                  </span>
                  <span className="btn-inner--text">Ajouter Les Contacts</span>
                </Button>
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
                            htmlFor="input-country"
                          >
                            {" "}
                            Registre de commerce
                          </label>
                          <ImageUpload
                            ImageUpload={this.ImageRegistreUploadRecievedHandler}
                            image={this.state.registreCommerce}

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
                           value={
                            Options.filter(
                              (obj) => obj.value ===this.state.tva
                            )[0] }
                            name="tva"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectTvaHandler.bind(this)}
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
                            value={
                              Options.filter(
                                (obj) => obj.value ===this.state.timbre
                              )[0] }
                            name="timbre"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectTimbreHandler.bind(this)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                    { this.state.showTva ?
                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            Image
                          </label>
                          <ImageUpload
                            ImageUpload={this.ImageTVAUploadRecievedHandler}
                            image={this.state.tvaFile}

                          ></ImageUpload>
                        </FormGroup>
                      </Col> : null}
                      { this.state.showTimbre ?

                    <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            Image
                          </label>
                          <ImageUpload
                            ImageUpload={this.ImageTimbreUploadRecievedHandler}
                            image={this.state.timbreFile}

                          ></ImageUpload>
                        </FormGroup>
                      </Col> : null }
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
                            gouvernorat
                          </label>
                          <Select
                           value={
                            this.state.gouvernoratS.filter(
                              (obj) => obj.value ===this.state.gouvernorat
                            )[0] }
                            name="gouvernorat"
                            options={this.getUnique(this.state.gouvernoratS,'label')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectgouvernoratHandler.bind(this)}
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
                           value={
                            this.state.delegationS.filter(
                              (obj) => obj.label ===this.state.delegation
                            )[0] }
                            name="delegation"
                            options={this.getUnique(this.state.delegationS.filter((del)=>
                              del.value.gouvernorat === this.state.gouvernorat
                            ),'label')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectDelegationHandler.bind(this)}
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
                          
                          <Select
                           value={
                            this.state.localiteS.filter(
                              (obj) => obj.label ===this.state.localite
                            )[0] }
                            name="localite"
                            options={this.state.localiteS.filter((del)=>
                              del.value.gouvernorat === this.state.gouvernorat
                              && del.value.delegation === this.state.delegation
                            )}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectLocaliteHandler.bind(this)}
                          />
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
                            value={
                              this.state.codePostalS.filter(
                                (obj) => obj.label ===this.state.codePostal
                              )[0] }
                            name="codePostal"
                            options={this.state.codePostalS.filter((del)=>
                              del.value.gouvernorat === this.state.gouvernorat
                              && del.value.delegation === this.state.delegation
                              && del.value.localite === this.state.localite
                            )}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={this.SelectCodePostalHandler.bind(this)}
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
                    Ajouter
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
  getProductsByCountryCode,
  clearErrors
})(EditClient);
