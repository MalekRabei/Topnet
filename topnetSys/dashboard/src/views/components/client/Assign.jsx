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
  Label
} from "reactstrap";
// core components
import SimpleHeader from "../../../components/Headers/SimpleHeader";

const stateOptionsByValue = {
  cooperating: { value: "cooperating", label: "cooperating" },
  "active": { value: "active", label: "active" },
  "already cooperated": {
    value: "already cooperated",
    label: "already cooperated",
  },
};

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
        clientName: response.payload.clientName,
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
 

  onSubmit(e) {
    e.preventDefault();
    const clientData = {
      clientName: this.state.clientName,
      clientState: this.state.clientState,
      clientLogo: this.state.clientLogo,
      clientCountryCode: this.state.clientCountryCode,
      
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
                                Client Name
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
                                  name="clientName"
                                  value={this.state.clientName}
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
                                name="clientState"
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
                                options={this.state.clientProductIds}
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
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                  <th>Retour</th>
                  
                    <th>Client</th>
                    <th>Mis à jour le</th>
                    <th>Produits</th>
                    
                    
                  </tr>
                </thead>
               </Table>
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
