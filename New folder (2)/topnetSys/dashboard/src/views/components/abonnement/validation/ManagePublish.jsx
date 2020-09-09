import React, { Component, Fragment } from "react";
import classnames from "classnames";
import Select from "react-select";
import axios from "axios";
import io from "socket.io-client";
import { Link } from "react-router-dom";
import ShowImageModal from './ShowImageModal'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Badge,
  CardImg,
  CardTitle,
  Table,
  UncontrolledTooltip,
  Label,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  Input,
  Collapse,
} from "reactstrap";

// core components
import SimpleHeader from "../../../../components/Headers/SimpleHeader";

import { connect } from "react-redux";
//TABLE
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
// react plugin that prints a given react component
import ReactToPrint from "react-to-print";
//ACTIONS
import {validerEtat, rejeterEtat} from '../../../../services/abonnementServices/abonnementActions';


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
class ManagePublish extends React.Component {
  constructor(props) {
    super(props);
    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);
    this.state = {
      abonnements: [],
      required_pages: [],
      permission : {},
      openedCollapses: ["collapseOne"],
      openedCollapses: ["collapseTwo"],
    };
    this.fetchAbonnement= this.fetchAbonnement.bind(this);
    this.onClickRejeter= this.onClickRejeter.bind(this);
    this.onClickValider= this.onClickValider.bind(this);
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
    this._isMounted = true;
    this.fetchAbonnement();
  }
  onClickValider(id) {
    this.props.validerEtat(id);
    window.location.reload(false);

  }
  onClickRejeter(id) {
    this.props.rejeterEtat(id);
    window.location.reload(false);

  }
  fetchAbonnement(){
    axios
    .get(`${this.server}/api/abonnements/listedattente`)
    .then((response) => {
      this.setState({ abonnements: response.data });
    })
    .catch((err) => {
      console.log(err.response);
    });
  }
  
 

  render() {
    console.log(this.state.abonnements)
    return (
      <>
        <SimpleHeader name="Manage Publish" parentName="Publish" />
        <Container className="mt--6" fluid>
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader
                  role="tab"
                  onClick={() => this.collapsesToggle("collapseOne")}
                  aria-expanded={this.state.openedCollapses.includes(
                    "collapseOne"
                  )}
                >
                  <h3 className="mb-0">Les Abonnements</h3>
                </CardHeader>
                <Collapse
                  role="tabpanel"
                  isOpen={this.state.openedCollapses.includes("collapseOne")}
                >
                  <Row className="ml-2 mr-2">
                    
                        
                  <ToolkitProvider
                  data={this.state.abonnements}
                  keyField="name"
                  columns={[
                    {
                      dataField: "debit",
                      text: "Debit",
                      sort: true
                    },
                    {
                      dataField: "telADSL",
                      text: "Téléphone",
                      sort: true
                    },
                    
                    {
                      dataField: "etat.toString() ",
                      text: "Etat ",
                      sort: true,
                      accessor: d => { return d.etat ? 'Oui' : 'Non' },

                    },
                    {
                      dataField: "fichier1recto",
                      text: "Contract",
                      sort: true
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
                              href="#pablo"
                              id="tooltip4434120801"
                              onClick={(e) => this.onClickValider(row._id)}
                              size="sm"
                              color="primary"
                            >
                              <span className="btn-inner--icon mr-1">
                                <i className="ni ni-settings-gear-65" />
                              </span>
                              <span className="btn-inner--text">Valider</span>
                            </Button>
                            <Button
                              className="btn-round btn-icon"
                              href="#pablo"
                              id="tooltip4434120802"
                              onClick={(e) => this.onClickRejeter(row._id)}
                              size="sm"
                              color="danger"
                            >
                              <span className="btn-inner--icon mr-1">
                                <i className="ni ni-single-copy-04" />
                              </span>
                              <span className="btn-inner--text">Rejeter</span>
                            </Button>
                            <ShowImageModal
                           className="btn btn-sm btn-danger btn-round btn-icon"
                          headerTitle="Afficher"
                          buttonTriggerTitle="Contrat"
                          buttonColor="pink"
                          abonnement={row}
                          server={this.props.server}
                          socket={this.props.socket}
                        />
                          
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
                     
                  </Row>
                </Collapse>
              </Card>
            </Col>
           
          </Row>
        </Container>
      </>
    );
  }
}

// Connect the redux store
export default connect(
  (state) => ({
  }),
  {
    validerEtat,
    rejeterEtat
  }
)(ManagePublish);
