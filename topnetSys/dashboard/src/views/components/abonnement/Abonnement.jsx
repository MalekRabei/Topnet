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

import NotificationAlert from "react-notification-alert";
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
import { ADD_CLIENT } from '../../../services/clientServices/types';
import AddClient from "../client/AddClient"
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
image: {},
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
abonnement:{},
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
    this.getUnique=this.getUnique.bind(this)
    this.SelectFonctionInputHandler=this.SelectFonctionInputHandler.bind(this)
    this.SelectMultisiteHandler=this.SelectMultisiteHandler.bind(this)
    this.SelectTvaHandler=this.SelectTvaHandler.bind(this)
    this.SelectTimbreHandler=this.SelectTimbreHandler.bind(this)
    

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


  

//get product from db
this.props.getAllProducts();

}

//getting data from reducer
componentWillReceiveProps(nextProps) {
  if (nextProps.clients) {
    this.setState({ client: nextProps.clients.client });
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
//debit 
SelectDebitHandler= (selectedOptions)=> {
  const debit = selectedOptions;
  this.setState({debit: debit.value })
}
// mode paiment 
SelectModePaimentHandler= (selectedOptions)=> {
  const modePaiement = selectedOptions;
  this.setState({modePaiement: modePaiement.value })
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

  //OnChange Select  Handler
  SelectgouvernoratHandler = (selectedOptions) => {
    const gouvernorat = selectedOptions;
    this.setState({ gouvernorat: gouvernorat.label });

  };
    //OnChange Select  Handler
SelectDelegationHandler = (selectedOptions) => {
  const del = selectedOptions;
  this.setState({ delegation: del.value.delegation });

};
  //OnChange Select  Handler
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
  this.setState({userSelected: user})
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

/*ImageUploadRecievedHandler = (img) => {
  this.setState({ imagetva: img });
};*/
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
 //OnChange Select Country Handler
 SelectMultisiteHandler = (selectedOptions) => {
  const multi = selectedOptions;
  this.setState({ multisite: multi.value });
  if(multi.value=== true){
    this.setState({showNbSite: true})
  }else {
    this.setState({showNbSite: false})

  }

};
//OnChange Select Country Handler
SelectGroupeHandler = (selectedOptions) => {
  const groupe= selectedOptions;
  this.setState({ groupe: groupe.value });

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
    
  
  //OnChange Select Country Handler
  SelectFonctionInputHandler = (selectedOptions) => {
    const fonction = selectedOptions;
    this.setState({ profil: fonction.value });

  };
     
    handleSubmit = event => {
     
      event.preventDefault()
      //// parite client
      
     

      if (this.state.fichier1rectoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier1rectoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier1recto =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.fichier1rectoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier1versoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier1versoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier1verso =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.fichier1versoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier2rectoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier2rectoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier2recto =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.fichier2rectoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier2versoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier2versoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier2verso =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.fichier2versoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier3rectoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier3rectoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier3recto =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.fichier3rectoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
      if (this.state.fichier3versoimg.name !== undefined) {

        let path_to_upload = "abonnement"; // $ /
        let imageName = this.state.fichier3versoimg.name.toLowerCase().split(" ").join("-");
        this.state.fichier3verso =
          path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
        const formData = new FormData();
  
        formData.append("img", this.state.fichier3versoimg);
        this.props.uploadImage(formData, path_to_upload);
      }
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
          
          chargeCompte: this.state.userSelected,
          profil: this.state.profil,        
          active: true,        
          raisonSociale: this.state.raisonSociale,
          nombreSite:this.state.nombreSite,
          multisite: this.state.multisite,
          groupe:this.state.groupe,
          dateDebut: this.state.dateDebut,
          effectif:this.state.effectif,
          secteurActivite: this.state.secteurActivite,
          matriculeFiscale: this.state.matriculeFiscale,
          tva: this.state.tva ,
          tvaFile: this.state.tvaFile ,
  
          timbre: this.state.timbre  ,  
          timbreFile: this.state.timbreFile  ,  
  
          logo:this.state.logo,
          rue1: this.state.rue1 ,
          rue2: this.state.rue2 ,
          ville : this.state.ville,
          gouvernorat: this.state.gouvernorat,
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
      this.props.createClient(clientData, this.props.history);
      this.props.getClientByMatricule(clientData.matriculeFiscale)
     
     //// parite produit
     const products= this.state.clientProductIdsSelected.map((product) => {
      return product.value;
    })



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
 
      this.props.createAbonnement(abonnementData, this.props.history);

    }
    
    _next = () => {
      let currentStep = this.state.currentStep
      currentStep = currentStep >= 3? 4: currentStep + 1
      this.setState({
        currentStep: currentStep
      })
      if(currentStep===4){
        const products= this.state.clientProductIdsSelected.map((product) => {
          return product.value;
        })
        this.setState({
          forfait:products[0].title,
          prix: "150 dt",
          
          
        })
      }
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
            SelectMultisiteHandler={this.SelectMultisiteHandler}
            SelectUserHandler={this.SelectUserHandler}
            SelectGroupeHandler={this.SelectGroupeHandler}
            SelectEffectifHandler={this.SelectEffectifHandler}
            SelectTvaHandler={this.SelectTvaHandler}
            SelectTimbreHandler={this.SelectTimbreHandler}
            SelectCodePostalHandler={this.SelectCodePostalHandler}
            SelectLocaliteHandler={this.SelectLocaliteHandler}
            SelectDelegationHandler={this.SelectDelegationHandler}
            SelectgouvernoratHandler={this.SelectgouvernoratHandler}
            getUnique={this.getUnique}
            ImageTVAUploadRecievedHandler={this.ImageTVAUploadRecievedHandler}
            ImageTimbreUploadRecievedHandler={this.ImageTimbreUploadRecievedHandler}
            ImageRegistreUploadRecievedHandler={this.ImageRegistreUploadRecievedHandler}
            handleChange={this.handleChange}
            ImageUploadRecievedHandler={this.ImageUploadRecievedHandler}
            SelectFonctionInputHandler={this.SelectFonctionInputHandler}

            //////////////////////
            showTva={this.state.showTva}
            showTimbre={this.state.showTimbre}
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
            codePostalS={this.state.codePostalS}
            gouvernorat={this.state.gouvernorat}
            gouvernoratS={this.state.gouvernoratS}
            delegation={this.state.delegation}
            delegationS={this.state.delegationS}
            localite={this.state.localite}
            localiteS={this.state.localiteS}
            showNbSite={this.state.showNbSite}
            validation={this.state.validation}
          

            
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
            SelectDebitHandler={this.SelectDebitHandler}
        
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
            SelectModePaimentHandler={this.SelectModePaimentHandler}
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
            modePaiement={this.state.modePaiement}
            debit={this.state.debit}
            telADSL={this.state.telADSL}
            prix="150 DT"
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
                  <h3 className="mb-0">Ajout Client</h3>
                </Col>
                <Col className="text-right" xs="4"></Col>
              </CardHeader>
              <CardBody className="text-center">
                <Form >
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
                              invalid={!props.validation.nomComplet}

                            />
                          </InputGroup>
                          {!props.validation.nomComplet ? (
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
                            onChange={props.SelectUserHandler}
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
                            name="profil"
                            options={props.fonction}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={props.SelectFonctionInputHandler}
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
                              invalid={!props.validation.raisonSociale}

                            />
                          </InputGroup>
                          {!props.validation.raisonSociale ? (
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
                            Multi-sites
                          </label>
                          <Select
                            defaultValue={Options[1]}
                            name="multisites"
                            options={Options}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={props.SelectMultisiteHandler}
                          />
                        </FormGroup>
                      </Col>
                      { props.showNbSite?
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
                              value={props.codeClient}
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
                            onChange={props.SelectGroupeHandler}
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
                            onChange={props.SelectEffectifHandler}
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
                            htmlFor="input-country"
                          >
                            {" "}
                            Registre de commerce
                          </label>
                          <ImageUpload
                            ImageUpload={props.ImageRegistreUploadRecievedHandler}
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
                            onChange={props.SelectTvaHandler}
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
                            onChange={props.SelectTimbreHandler}
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                    { props.showTva ?
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
                            ImageUpload={props.ImageTVAUploadRecievedHandler}
                          ></ImageUpload>
                        </FormGroup>
                      </Col> : null}
                      { props.showTimbre ?

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
                            ImageUpload={props.ImageTimbreUploadRecievedHandler}
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
                            gouvernorat
                          </label>
                          <Select
                           
                            name="gouvernorat"
                            options={props.getUnique(props.gouvernoratS,'label')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={props.SelectgouvernoratHandler}
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
                            name="delegation"
                            options={props.getUnique(props.delegationS.filter((del)=>
                              del.value.gouvernorat === props.gouvernorat
                            ),'label')}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={props.SelectDelegationHandler}
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
                           
                            name="localite"
                            options={props.localiteS.filter((del)=>
                              del.value.gouvernorat === props.gouvernorat
                              && del.value.delegation === props.delegation
                            )}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={props.SelectLocaliteHandler}
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
                           
                            name="codePostal"
                            options={props.codePostalS.filter((del)=>
                              del.value.gouvernorat === props.gouvernorat
                              && del.value.delegation === props.delegation
                              && del.value.localite === props.localite
                            )}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={props.SelectCodePostalHandler}
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
                              type="number"
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
                              type="number"
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
                              type="number"
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
                 
                </Form>

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
                          onChange={props.SelectDebitHandler}
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
                          onChange={props.SelectModePaimentHandler}
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
                    </div>
              <div className="pl-lg-4">
                <Row> 
                 <Col class="float-left" >   <h5>  Nom de l'entreprise        :   </h5>   </Col > 
                 <Col class="float-left" >  {props.nomComplet}    </Col > 
                </Row>
                 
                <Row> 
                 <Col  class="float-left">  <h5> Matricule fiscale             : </h5>  </Col > 
                 <Col class="float-left">   {props.matriculeFiscale}    </Col > 
                </Row>
                <Row> 
                 <Col class="float-left">  <h5> Forfait choisi      :       </h5>  </Col > 
                 <Col class="float-left">   {props.forfait}   </Col > 
                </Row>
                <Row> 
                 <Col  class="float-left">  <h5>  Debit   </h5>  </Col > 
                 <Col  class="float-left">   {props.debit}   </Col > 
                </Row>
                 
                <Row> 
                 <Col class="float-left" >  <h5>  Mode de paiement    :    </h5>  </Col > 
                 <Col class="float-left" >    {props.modePaiement}   </Col > 
                </Row>
                
                <Row> 
                 <Col  class="float-left" >  <h5>  Numero de telephone ADSL    :   </h5>  </Col > 
                 <Col  class="float-left">    {props.telADSL}   </Col > 
                </Row>
                <Row> 
                 <Col  class="float-sm-left">  <h5>  TVA    oui ou non       :   </h5>  </Col > 
                 <Col  class="float-sm-left">    {}  </Col > 
                </Row>
                
                <Row> 
                 <Col class="float-sm-left">  <h5> Prix Finale         :    </h5>  </Col > 
                 <Col class="float-sm-left">    {props.prix}   </Col > 
                </Row>
                  
              


<br/>
<br/>
                
        <Button color="success" onClick={props.handleSubmit}> Confirmer</Button>
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