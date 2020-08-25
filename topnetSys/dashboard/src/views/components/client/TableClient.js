import React, { Component } from "react";
import { Table, Image } from "semantic-ui-react";
import ModalConfirmDelete from "./ModalConfirmDelete";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getProductById } from "../../../services/productServices/productActions";


// reactstrap components
import { Button, Collapse, CardLink, Label } from "reactstrap";
import { array } from "prop-types";
const color = "blue";

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
   
   // console.log("clients", clients.map(client => client.clientProductIds[0].title));

    clients = clients.map((client) => (
      <Table.Row key={client._id}>
        <Table.Cell>
          <Image
            src={process.env.PUBLIC_URL + "/Images/" + client.clientLogo}
            size="tiny"
            circular
          />
        </Table.Cell>
        <Table.Cell>{client.nomComplet}</Table.Cell>
        <Table.Cell>{client.raisonSociale}</Table.Cell>
        <Table.Cell>{client.effectif}</Table.Cell>
        <Table.Cell>{client.chergeCompte}</Table.Cell>
        <Table.Cell>

          <Button
            color="primary"
            to={`/admin/update-client/${client._id}`}
            tag={Link}
          >
            Edit
          </Button>

          <Button
            color="primary"
            to={`/admin/assign-product/${client._id}`}
            tag={Link}
          >
            Abonnement
          </Button>

          <ModalConfirmDelete
            headerTitle="Delete client"
            buttonTriggerTitle="Delete"
            buttonColor="red"
            client={client}
            onclientDeleted={this.props.onclientDeleted}
            server={this.props.server}
            socket={this.props.socket}
          />
        </Table.Cell>
        
        
         

        
      </Table.Row>
    ));

    // Make every new client appear on top of the list
    clients = [...clients].reverse();

    return (
      <Table singleLine color={color}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Logo</Table.HeaderCell>
            <Table.HeaderCell>Nom</Table.HeaderCell>
            <Table.HeaderCell>Raison Sociale</Table.HeaderCell>
            <Table.HeaderCell>Effectif</Table.HeaderCell>          
            <Table.HeaderCell>Chargé du compte</Table.HeaderCell>           
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{clients}</Table.Body>
      </Table>
    );
  }
}

const mapStateToProps = (state) => ({
  permission: state.auth.current_permission,
  products: state.products
});
export default connect(mapStateToProps, {getProductById})(TableClient);
