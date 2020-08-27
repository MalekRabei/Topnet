import React, { Component } from "react";
import { Table, Image } from "semantic-ui-react";
import ModalConfirmDelete from "./ModalConfirmDelete";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProductById } from "../../../services/productServices/productActions";
//TABLE
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
// react plugin that prints a given react component
import ReactToPrint from "react-to-print";

// reactstrap components
import { Button, Collapse, CardLink, Label } from "reactstrap";
import { array } from "prop-types";
const color = "blue";
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
class TableClient extends Component {
  constructor() {
    super();

    this.state = {
      permission : {},
      products : [],
      openedCollapses: ["collapseAds"],
      openedCollapses: ["collapseProds"],
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.permission) {
      console.log("permission ", nextProps.permission);
      this.setState({ permission: nextProps.permission });
    }
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

 
 
  render() {
let clients = this.props.clients;   
     
    
    // Make every new client appear on top of the list
    clients = [...clients].reverse();

    return (
      <ToolkitProvider
      data={clients}
      keyField="name"
      columns={[
        {
          dataField: "nomComplet",
          text: "Entreprise",
          sort: true,
        },
        {
          dataField: "raisonSociale",
          text: "Raison Sociale",
          sort: true,
        },

        {
          dataField: "effectif",
          text: "Effectif",
          sort: true,
        },

        {
          dataField: "chargeCompte.label",
          text: "Chargé du Compte",
          sort: true,
        },
        {
          dataField: "active.value",
          text: "Etat du Compte",
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
                  href="#pablo"
                  id="tooltip443412080"
                  //onClick={(e) => this.showUpdate(e, row)}
                  size="sm"
                  color="primary"
                  to={`/admin/update-client/${row._id}`}
                  tag={Link}
                >
                  <span className="btn-inner--icon mr-1">
                    <i className="ni ni-settings-gear-65" />
                  </span>
                  <span className="btn-inner--text">Modifier</span>
                </Button>
                <Button
                  className="btn-round btn-icon"
                  href="#pablo"
                  id="tooltip443412080"
                  //onClick={(e) => this.showUpdate(e, row)}
                  size="sm"
                  color="primary"
                  to={`/admin/assign-product/${row._id}`}
                  tag={Link}
                >
                  <span className="btn-inner--icon mr-1">
                    <i className="ni ni-single-copy-04" />
                  </span>
                  <span className="btn-inner--text">Abonnement</span>
                </Button>
                <ModalConfirmDelete
                className="btn btn-sm btn-danger btn-round btn-icon"
                headerTitle="Delete client"
                buttonTriggerTitle="Delete"
                client={row}
                onclientDeleted={this.props.onclientDeleted}
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
          
       
    );
  }
}

const mapStateToProps = (state) => ({
  permission: state.auth.current_permission,
  products: state.products
});
export default connect(mapStateToProps, {getProductById})(TableClient);
