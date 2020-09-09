import React, { Component } from 'react'
import { connect } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import ReactDatetime from "react-datetime";
import Popup from 'react-popup';
// Action Redux
import {
    getClient,
    createClient,
    editClient,
    getClientByMatricule
  } from "../../../services/clientServices/clientActions";
  import {
    createAbonnement,
    
  } from "../../../services/abonnementServices/abonnementActions";
import { getAllProducts , getProductById} from "../../../services/productServices/productActions";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import DataProducts from "../../../Data/DataProducts.js";
import Select from "react-select";
import Fonction from "../../../utils/fonction.json"
import ImageUpload from "../user/adding-user/ImageUpload";
import Adresse from "../../../utils/adresse.json"

//notifications imports
import NotificationAlertOptions from "../../../layouts/Alerts";

import { uploadImage } from "../../../services/ImageServices/ImageActions";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  
  FormGroup,
  Form,
  Input,
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

import { clearErrors } from "../../../services/errorServices/errorAction";
import AdvancedAssignement from "./ProductsByCountry/AdvancedAssignement"
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
    { value: true, label: "Oui" },
    { value: false, label: "Non" },
  ];

   
  const OptionsDebit = [
    { value: 4, label: "4 Méga" },
    { value: 8, label: "8 Méga" },
    { value: 10, label: "10 Méga" },
    { value: 12, label: "12 Méga" },
    { value: 20, label: "20 Méga" },
  ];

  const OptionsPaiement = [
    { value: "Mensuelle", label: "Mensuelle " },
    { value: "Trimestrielle", label: "Trimestrielle" },
    { value: "Semestrielle", label: "Semestrielle" },
    { value: "Annuelle", label: "Annuelle" },
    
  ];
  
  const EffectifOptions = [
    { value: "10", label: "10" },
    { value: "10/100", label: "entre 10 et 100" },
    { value: "> 100", label: "> 100" },
  
  ];
     class Abonnement extends React.Component {
        prodTitle = DataProducts.map((prod) => prod._id);

       constructor(props) {
        super(props);
        this.server = process.env.REACT_APP_API_URL || "";
        this.socket = io.connect(this.server);
        this.state = {
            fichier1recto:"",
            fichier1verso:"",
            fichier2recto:"",
            fichier2verso:"",
            fichier3recto:"",
            fichier3verso:"",
            fichier1rectoimg:{},
            fichier1versoimg:{},
            fichier2rectoimg:{},
            fichier2versoimg:{},
            fichier3rectoimg:{},
            fichier3versoimg:{},
            debit:"",
            telADSL:"",
            modePaiement:"",
            active:{},
          /**     forfait */
            forfait:"",
            prix: "",
            openedCollapses: ["collapseAds"],
            openedCollapses: ["collapseProds"],     
            clientPIds: [],
            clientCountryCode: [],
            clientCountryCodeSelected: [],
            CountriesData: [],
            errors: {},
            clientAdss: [],
            clients: [],
            clientProductIdsSelected:[],
            clientProductIds:[],


/****     client */

users:[],
user:[],
userSelected:[],
currentStep: 1,
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
matriculeFiscale: {},
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
idc:"",
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
abonnement:{}
        };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.SelectClientStateInputHandler = this.SelectClientStateInputHandler.bind(
      this
    );
    this.SelectProductInputHandler = this.SelectProductInputHandler.bind(this);
    this.onClickOui = this.onClickOui.bind(this);
    this.onClickNon = this.onClickNon.bind(this);

    this.findClient = this.findClient.bind(this);
    this.SelectInputHandler= this.SelectInputHandler.bind(this)
    this.handleSubmit= this.handleSubmit.bind(this)
    this.ImageUploadRecievedHandler1a=this.ImageUploadRecievedHandler1a.bind(this)
    this.ImageUploadRecievedHandler1b=this.ImageUploadRecievedHandler1b.bind(this)
    this.ImageUploadRecievedHandler2a=this.ImageUploadRecievedHandler2a.bind(this)
    this.ImageUploadRecievedHandler2b=this.ImageUploadRecievedHandler2b.bind(this)
    this.ImageUploadRecievedHandler3a=this.ImageUploadRecievedHandler3a.bind(this)
    this.ImageUploadRecievedHandler3b=this.ImageUploadRecievedHandler3b.bind(this)
    this.ImageUploadRecievedHandler=this.ImageUploadRecievedHandler.bind(this)

    

      }
/*********************** */
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
handleOptionChange(e) {
  this.setState({
    selectedOption: e.target.value
  });
}
onClickOui(){
  this.setState({show:false, search:true})
 } 
onClickNon(){
   this.setState({show:false, hide:true})
   }
   
findClient(matricule){
  const mat = matricule.value ;
  this.setState({ searchInput: mat})
  this.props.getClientByMatricule(mat);
  this.setState({ result : true, search: false});

}
/*------------------------*/
componentWillMount() {


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
      value : ad.id,
      label: ad.gouvernorat
    })
  })
  this.setState({gouvernoratS: gouvernoratData })
  console.log(gouvernoratS);


  const LocaliteData = [];
  const localiteS = [...Adresse];
  localiteS.map((ad)=>{
    return LocaliteData.push({
      value : ad.id,
      label: ad.localite
    })
  })
  this.setState({localiteS: LocaliteData })
  console.log(localiteS);

  const delegationData = [];
  const delegationS = [...Adresse];
  delegationS.map((ad)=>{
    return delegationData.push({
      value : ad.id,
      label: ad.delegation
    })
  })
  this.setState({delegationS: delegationData })
  console.log("del",delegationS);


  const CodePostalData = [];
  const codePostalS = [...Adresse];
  codePostalS.map((ad)=>{
    return CodePostalData.push({
      value : ad.id,
      label: ad.codePostal
    })
  })
  this.setState({codePostalS: CodePostalData })
  


//get product from db
this.props.getAllProducts();

//get ads from db

this.fetchClients();

}
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

//getting data from reducer
componentWillReceiveProps(nextProps) {

  if (nextProps.errors) {
    this.setState({ errors: nextProps.errors });
  }
  if (nextProps.clients) {
    this.setState({ client: nextProps.clients.client });
  }
  if (nextProps.client) {
    const client = nextProps.client;
    // console.log( nextProps.client.client);

    this.setState({
      
      products: client.products,
    });
  }
  
 
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



  if (nextProps.abonnement) {
    this.setState({ abonnement: nextProps.abonnement });
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
      products: mappedProductIds,
      clientProductIdsSelected:this.state.clientPIds ,
    });
  }

 
}

onChange(e) {
  this.setState({ [e.target.name]: e.target.value });
}


SelectInputHandler = (selectedOptions) => {
  const fonction = selectedOptions;
  this.setState({ profil: fonction.value });
  //set validation to true
//  this.state.validation["country_code"] = true;
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




ImageUploadRecievedHandler1a = (img) => {
  this.setState({ fichier1rectoimg: img });
};
ImageUploadRecievedHandler1b = (img) => {
  this.setState({ fichier1versoimg: img });
};
ImageUploadRecievedHandler2a = (img) => {
  this.setState({ fichier2rectoimg: img });
};

ImageUploadRecievedHandler2b = (img) => {
  this.setState({ fichier2versoimg: img });
};
ImageUploadRecievedHandler3a = (img) => {
  this.setState({ fichier3rectoimg: img });
};

ImageUploadRecievedHandler3b = (img) => {
  this.setState({ fichier3versoimg: img });
};
ImageUploadRecievedHandler = (img) => {
  this.setState({ image: img });
};


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
      
  };
  this.props.createClient(clientData, this.props.history)
  
  
}
/********************************************************************* */




/********************************************************************* */
SelectProductInputHandler = (selectedOptions) => {
  console.log("select  product inp handler")
  const clientProductIds = selectedOptions;
  this.setState({ clientProductIdsSelected: clientProductIds });
};


      /**************************************** */
    handleChange = event => {
      const {name, value} = event.target
      this.setState({
        [name]: value
      })    
    }
     
    handleSubmit = event => {
     
      event.preventDefault()
      //// parite client
      
     if (this.state.image.name !== undefined) {

        let path_to_upload = "clients"; // $ /
        let imageName = this.state.image.name.toLowerCase().split(" ").join("-");
        this.state.clientLogo =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.image);
        this.props.uploadImage(formData, path_to_upload);
      }

      if (this.state.fichier1rectoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier1rectoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier1recto =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.fichier1rectoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier1versoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier1versoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier1verso =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.fichier1versoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier2rectoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier2rectoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier2recto =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.fichier2rectoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier2versoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier2versoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier2verso =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.fichier2versoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier3rectoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier3rectoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier3recto =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.fichier3rectoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier3versoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier3versoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier3verso =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.fichier3versoimg);
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
          
      };

      this.props.createClient(clientData, this.props.history)
      console.log("2 -    this.state"+this.state.data)
    
   
     this.props.getClientByMatricule(clientData.matriculeFiscale)
     
     console.log("3 -   this.state"+this.state.matriculeFiscale)
     //// parite produit
     const products= this.state.clientProductIdsSelected.map((product) => {
      return product.value;
    })
     alert("Your registration detail:"+products.length+products[0]._id)

this.state.forfait=products[0]._id
this.state.prix="150 DT"

     /////////////// parite abonnement
     
     const abonnementData = {
          
      clientId: clientData.matriculeFiscale,
      productId: products[0]._id,        
      debit: this.state.debit,        
      fichier1recto: this.state.fichier1recto,
      fichier1verso: this.state.fichier1verso,
      fichier2recto: this.state.fichier2recto,
      fichier2verso: this.state.fichier2verso,
      fichier3recto: this.state.fichier3recto,
      fichier3verso: this.state.fichier3verso,
      modePaiement:  this.state.modePaiement,
      telADSL :      this.state.telADSL,
      etat : false

      
  };
 /// console.log(this.state.clients.client._id+"/"+this.state.matriculeFiscale+"/"+this.state.clients[0].client._id +"/"+this.state.debit+"/"+this.state.fichier1recto+"/"+this.state.fichier1verso+"/")
 
      this.props.createAbonnement(abonnementData, this.props.history);

    }
    
    _next = () => {
      let currentStep = this.state.currentStep
      currentStep = currentStep >= 3? 4: currentStep + 1
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
    if(currentStep <4){
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
            fetchUsers={this.fetchUsers}
            handleOptionChange={this.handleOptionChange}
            onClickOui={this.onClickOui}
            onClickNon={this.onClickNon}
            findClient={this.findClient}
            onChange={this.onChange}
            SelectInputHandler={this.SelectInputHandler}
            SelectUserHandler={this.SelectUserHandler}
            handleChange={this.handleChange}
            ImageUploadRecievedHandler={this.ImageUploadRecievedHandler}

            //////////////////////
           
            show={this.state.show}
            search={this.state.search}
            hide={this.state.hide}
            btnOui={this.state.btnOui}
            btnNon={this.state.btnNon}
            searchInput={this.state.searchInput}
            client={this.state.client}
            nomComplet={this.state.nomComplet}
            chargeCompte={this.state.chargeCompte}
            fonction={this.state.fonction}
            raisonSociale={this.state.raisonSociale}
            nombreSite={this.state.nombreSite}
            multisite={this.state.multisite}
            groupe={this.state.groupe}
            effectif={this.state.effectif}
            segment={this.state.segment}
            sousSegment={this.state.sousSegment}
            email={this.state.email}
            timbre={this.state.timbre}
            tva={this.state.tva}
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
            selectedOption={this.state.selectedOption}
            users={this.state.users}
     
           /*
            categorie={this.state.categorie}
            personnel={this.state.personnel}
            typeCompte={this.state.typeCompte}
            codeClient={this.state.codeClient}
            ancienCodeClient={this.state.ancienCodeClient}
            profil={this.state.profil}
            statutRecouvrement={this.state.statutRecouvrement}
            active={this.state.active}
            facturation={this.state.facturation}
            categorieSegment={this.state.categorieSegment}
            groupe={this.state.groupe}
            effectif={this.state.effectif}
            lattidue={this.state.lattidue}
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
            showProducts={this.state.showProducts}*/
            
            
        />
        <Step2 

            clientProductIdsSelected={this.state.clientProductIdsSelected}
            clientProductIds={this.clientProductIds}
            currentStep={this.state.currentStep} 
            debit={this.state.debit}
            handleChange={this.handleChange}
            onChange={this.onChange}
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
            CountriesData={this.CountriesData}
            errors={this.errors}
            clientAdss={this.clientAdss}
            clients={this.clients}
            products={this.state.products}

          />
          <Step3 
            startDate={this.state. startDate}
            endDate={this.state. endDate}
            fichier1recto={this.state.fichier1recto}
            fichier1verso={this.state.fichier1verso}
            fichier2recto={this.state.fichier2recto}
            fichier2verso={this.state.fichier2verso}
            fichier3recto={this.state.fichier3recto}
            fichier3verso={this.state.fichier3verso}
            telADSL={this.telADSL}
            
            modePaiement={this.modePaiement}
            currentStep={this.state.currentStep} 
            handleChange={this.handleChange}
            onChange={this.onChange}
            handleSubmit={this.handleSubmit}
            ImageUploadRecievedHandler1a={this.ImageUploadRecievedHandler1a}
            ImageUploadRecievedHandler1b={this.ImageUploadRecievedHandler1b}
            ImageUploadRecievedHandler2a={this.ImageUploadRecievedHandler2a}
            ImageUploadRecievedHandler2b={this.ImageUploadRecievedHandler2b}
            ImageUploadRecievedHandler3a={this.ImageUploadRecievedHandler3a}
            ImageUploadRecievedHandler3b={this.ImageUploadRecievedHandler3b}

          />

<Step4
           
            currentStep={this.state.currentStep} 
           
            handleSubmit={this.handleSubmit}
            nomComplet={this.state.nomComplet}
            matriculeFiscale={this.state.matriculeFiscale}
            forfait={this.state.forfait}
            debit={this.state.debit}
            prix={this.state.prix}


        
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

      
      <Container className="mt--6" fluid>
     
      {props.show ?
      
      <center>
      <br/>
      <br/>
      <br/><br/><br/>
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
      
      </center>
               : 
           null
                }
              
       
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
                          <Input
                           id="searchInput"
                           placeholder="matricule"
                           name="searchInput" 
                           type="text"
                           onChange={props.onChange}
                           value={props.searchInput}
                            />
                        </InputGroup>
                      </FormGroup>
                     
                      <div className="text-center">
                        <Button
                          className="mt-4"
                          color="primary"
                          type="button"
                          onClick={props.findClient}
                        >
                          Valider 
                        </Button>
                        <Button
                          className="mt-4"
                          color=""
                          type="button"
                          href="/admin/add-client"
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

{props.result ?
      <center>
        <br/><br/>
              <Col lg="12">
              <Card className="bg-secondary shadow border-0">
                  <CardHeader className="bg-white pb-5">
                  <h4 className="mb-1">Affecter un nouveau forfait</h4>
                    <p className="mt-1">
                    </p>
                    
                    </CardHeader>
                    <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center">
                    Information client {" "}
                    </div>
                    
                    <br/>
                    <br/>
                    <div className="text-center">
                    {props.client.clientName} {" "}
                    </div>
                     
                      <div className="text-center">
                        <Button
                          className="mt-4"
                          color="primary"
                          type="button"
                          to={`/admin/assign-product/${props.client._id}`}
                         tag={Link}
                        >
                          Abonnement 
                        </Button>
                        <Button
                          className="mt-4"
                          color=""
                          type="button"
                          href="/admin/add-client"
                        >
                          Retour
                        </Button>
                      </div>
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
                <h3 className="mb-0">Ajouter Client</h3>
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
                            value={props.nomComplet}
                            onChange={props.onChange}
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
                          options={props.users.map((user)=> {
                            return {
                              value: user,
                              label: user.name
                            }
                          })}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={props.SelectUserHandler.bind(this)}
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
                          name="fonction"
                          options={props.fonction}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={props.SelectInputHandler}
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
                            value={props.raisonSociale}
                            onChange={props.onChange}
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
                          onChange={props.SelectInputHandler}
                        />
                      </FormGroup>
                    </Col>
                    { props.multisite.value == "oui"?
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
                            value={props.nombreSite}
                            onChange={props.onChange}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
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
                            ImageUpload={props.ImageUploadRecievedHandler}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>
                    </Row>
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
                            ImageUpload={props.ImageUploadRecievedHandler}
                          ></ImageUpload>
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                          onChange={props.SelectInputHandler}
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
                          onChange={props.SelectInputHandler}
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
                            value={props.localite}
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                            onChange={props.onChange}
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
                  <input type="radio" value="option1" onChange={props.handleOptionChange} checked={props.selectedOption ==="oui"} />
                  Oui
                </label>
              </div>
              <div className="radio">
                <label>
                  <input type="radio" value="option2" onChange={props.handleOptionChange}  checked={props.selectedOption ==="non"}/>
                  Non
                </label>
              </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  
                </div>
               
                <hr className="my-4" />
                
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
                                  options={props.products}
                                  className="basic-multi-select"
                                  classNamePrefix="select"
                                  onChange={props.SelectProductInputHandler}
                               
                                  


                                />



                              </FormGroup>
                            </Col>
                          </Row>
                        </div>
                        <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    choisir le débit 
                  </h6>
                  <div className="pl-lg-4"></div>
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                          Débit
                        </label>
                        <Select
                          defaultValue={OptionsDebit[1]}
                          name="debit"
                          options={OptionsDebit}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={props.SelectInputHandler}
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                        

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
                    Informations sur les contrats
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
                            fichier 1 recto
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageUploadRecievedHandler1a}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>
                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            fichier 1 verso
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageUploadRecievedHandler1b}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>
                    </Row>
                    </div>
                    <div className="pl-lg-4">
                    <Row>
                    <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            fichier 2 recto
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageUploadRecievedHandler2a}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>

                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            fichier 2 verso
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageUploadRecievedHandler2b}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>
                    </Row>
                    </div>

                    
                  
                    <div className="pl-lg-4">
                    <Row>
                    <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            fichier 3 recto
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageUploadRecievedHandler3a}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>

                      <Col lg="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            {" "}
                            fichier 3 verso
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageUploadRecievedHandler3b}
                          ></ImageUpload>
                        </FormGroup>
                      </Col>
                    </Row>
                    </div>

                  
                  <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                           Paiement à la réception d'une facture 
                        </label>
                        <Select
                          defaultValue={OptionsPaiement[1]}
                          name="modePaiement"
                          options={OptionsPaiement}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          onChange={props.SelectInputHandler}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  </div>
                  <div className="pl-lg-4">
                  <Row>
                    <Col lg="12">
                      <FormGroup>
                      <label
                          className="form-control-label"
                          htmlFor="input-username"
                        >
                         Numero de telephone pour ADSL 
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
                            placeholder=" Numero de telephone pour ADSL"
                            type="text"
                            name="telADSL"
                            value={props.telADSL}
                            onChange={props.onChange}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  </div>




                
        <input value="Confirmer"type="button"  onClick={props.handleSubmit}/>
    </div>
  
 </CardBody>
 </Card>
 

<br/>
<br/>

 

<br/>
<br/>


        </Container>
      
      </React.Fragment>
    );
  }






  function Step4(props) {
    if (props.currentStep !== 4) {
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
                    Confirmation de l'abonnement 
                    </h6>
                    <div className="pl-lg-4">
                    
                    </div>

                  
                  <div className="pl-lg-4">
                  {props.nomComplet} {" "}
                  </div>
                  <div className="pl-lg-4">
                  {props.matriculeFiscale} {" "}
                  </div>
                  <div className="pl-lg-4">
                  {props.forfait} {" "}
                  </div>
                  <div className="pl-lg-4">
                  {props.debit} {" "}
                  </div>
                  <div className="pl-lg-4">
                  {props.modePaiement} {" "}
                  </div>
                  <div className="pl-lg-4">
                  {props.prix} {" "}
                  </div>



                
        <input value="Confirmer"type="button" className="mt-4" color="primary"  onClick={props.handleSubmit}/>
    </div>
  
 </CardBody>
 </Card>
 

<br/>
<br/>

 

<br/>
<br/>


        </Container>
      
      </React.Fragment>
    );
  }
  
Abonnement.propTypes = {
    createClient: PropTypes.func.isRequired,
    createAbonnement: PropTypes.func.isRequired,
    editClient: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    getClient: PropTypes.func.isRequired,
    getClientByMatricule: PropTypes.func.isRequired,
    client:  PropTypes.object.isRequired,
    clients:  PropTypes.object.isRequired,
  };
  const mapStateToProps = (state) => ({
    client: state.client,
    abonnement: state.abonnement,
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
    getClientByMatricule,
    getAllProducts,
    getProductById,
    createAbonnement,
    uploadImage,
    clearErrors,
    getProductById,
    

    
  })(Abonnement);