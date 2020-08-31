import React, { Component } from "react";
//Redux imports
import { connect } from "react-redux";
import axios from "axios";
import io from "socket.io-client";


// Action Redux
import {
  getClient,
  createClient,
  editClient,
} from "../../../services/clientServices/clientActions";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import Select from "react-select";

//get action
import { getAllProducts } from "../../../services/productServices/productActions";
import CountriesData from "../../../utils/CountryData/CountriesData.json";


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

class Assign extends React.Component {
  constructor(props) {
    super(props);
    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);
    this.state = {
      openedCollapses: ["collapseAds"],
      openedCollapses: ["collapseProds"],
      id: this.props.match.params.id,
      clientName: "",
      clientState: null,
      clientLogo:
        "https://www.gravatar.com/avatar/c13b5c99e9712a5e17789d046f5583a7",

      clientCountryCode: [],
      clientCountryCodeSelected: [],
      clientProductIds: [],
      CountriesData: [],

      clientProductIdsSelected: [],
      clientAds: [],
      clientAdsSelected: [],
      CountriesData: [],
      errors: {},
      clientCC: [],
      clientPIds: [],
      clientAdss: [],
      clients: [],
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
  componentDidMount() {
    this.props.getClient(this.state.id).then((response) =>
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
        timbre: response.payload.timbre,
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
         contact: response.payload.contact,
        
        clientPIds: response.payload.products.map((obj, index) => 
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
        
        products: client.products,
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
        products: mappedProductIds,
        clientProductIdsSelected:this.state.clientPIds ,
      });
    }

   
  }
  SelectClientStateInputHandler = (e) => {
    this.setState({ active: e.value });
  };

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  //on Change select product
  SelectProductInputHandler = (selectedOptions) => {
    console.log("select  product inp handler")
    const clientProductIds = selectedOptions;
    this.setState({ clientProductIdsSelected: clientProductIds });
  };
 

  onSubmit(e) {
    e.preventDefault();

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
    products: this.state.clientProductIdsSelected.map((product) => {
      return product.value;
    }),
    clientName: this.state.clientName,
    clientState: this.state.clientState,
    clientLogo: this.state.clientLogo,
      
    };
    this.props.editClient(this.state.id, clientData, this.props.history);
  }
  render() {
    
    console.log(this.state);

    return (
      <>
        <SimpleHeader name="Assign" parentName="Clients" />
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
                  <h3 className="mb-0">Assign Products</h3>
                </CardHeader>
                <Collapse
                  role="tabpanel"
                  isOpen={this.state.openedCollapses.includes("collapseProds")}
                >
                  <CardBody className="text-center">
                    <Form onSubmit={this.onSubmit}>
                      <h6 className="heading-small text-muted mb-4">
                        Client information
                      </h6>
                      <div className="pl-lg-4">
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-username"
                              >
                                Nom entreprise
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
                                  placeholder="Enter Client Name"
                                  type="text"
                                  name="nomComplet"
                                  value={this.state.nomComplet}
                                  disabled
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
                                Etat du compte
                              </label>
                              <Select
                                defaultValue={stateOptions[1]}
                                name="active"
                                className="basic-multi-select"
                                classNamePrefix="select"
                                isDisabled={true}
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <hr className="my-4" />

                        <h6 className="heading-small text-muted mb-4">
                          Assign products
                        </h6>
                        <div className="pl-lg-4"></div>
                        <Row>
                          <Col lg="12">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-username"
                              >
                                Products
                              </label>
                              <Select
                                isMulti
                                value= {this.state.clientProductIdsSelected}
                                name="clientProductIds"
                                options={this.state.products}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={this.SelectProductInputHandler.bind(
                                  this
                                )}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </div>
                      <hr className="my-4" />
                      <Button color="primary" onClick={this.onSubmit}>
                        Assign
                      </Button>

                      <Link
                        to="/admin/client/list"
                        className="btn btn-default "
                      >
                        Cancel
                      </Link>
                    </Form>
                  </CardBody>
                </Collapse>
              </Card>
            </Col>
          </Row>
          <Col lg="12">
            <br/> <br/>
            <Card>
              <CardHeader className="bg-transparent">
                <h3 className="mb-0">Produits du client </h3>
              </CardHeader>
               <ToolkitProvider
                  data={dataTable}
                  keyField="name"
                  columns={[
                    {
                      dataField: "name",
                      text: "Name",
                      sort: true,
                    },

                    {
                      dataField: "link",
                      text: "ACTION",
                      formatter: (rowContent, row) => {
                        return (
                          <div>
                            {/* {this.state.permission.publish ||
                        this.state.permission.edit ? ( */}
                            <Button
                              className="btn-round btn-icon"
                              color="primary"
                              href="#pablo"
                              id="tooltip443412080"
                              //onClick={(e) => this.showUpdate(e, row)}
                              size="sm"
                            >
                              <span className="btn-inner--icon mr-1">
                                <i className="ni ni-settings-gear-65" />
                              </span>
                              <span className="btn-inner--text">Update</span>
                            </Button>
                            <Button
                              className="btn-round btn-icon"
                              color="danger"
                              href="#pablo"
                              id="tooltip443412080"
                              //onClick={(e) => this.questionAlert(e, row._id)}
                              size="sm"
                            >
                              <span className="btn-inner--icon mr-1">
                                <i className="fas fa-trash" />
                              </span>
                              <span className="btn-inner--text">Delete</span>
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


Assign.propTypes = {
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
});
export default connect(mapStateToProps, {
  getAllProducts,
  getClient,
  createClient,
  editClient,
})(Assign);
