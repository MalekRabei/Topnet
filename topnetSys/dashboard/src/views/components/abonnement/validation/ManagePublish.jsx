import React, { Component, Fragment } from "react";
import classnames from "classnames";
import Select from "react-select";
import axios from "axios";

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


import PendingPages from "./PendingPages";
import CommitHistory from "./CommitHistory";
class ManagePublish extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      required_pages: [],
      permission : {},
      openedCollapses: ["collapseOne"],
      openedCollapses: ["collapseTwo"],
    };
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
  onClick(id) {
    this.props.addPendingPage(id);
        window.location.reload(false);

  }
  
 

  render() {
    console.log("PAGES", this.state.pages);
    return (
      <>
        <SimpleHeader name="Manage Publish" parentName="Publish" />
        <Container className="mt--6" fluid>
          <Row>
            <Col lg="8">
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
                    
                        
                          <Col lg="4" className="mt-3 " >
                            <Card className="card-lift--hover shadow border-0">
                              <CardImg
                                alt="..."
                                src={require("../../../../assets/img/theme/img-1-1000x600.jpg")}
                                top
                              />
                              <CardBody className="text-center">
                                <CardTitle>
                                  <small className="text-muted font-weight-bold">
                                    Client
                                  </small>
                                </CardTitle>

                                <input
                                  type="button"
                                  className="btn btn-sm btn-info"
                                  
                                  value={
                                  false=== true ?
                                   "Valide"
                                  : "Non Valide" }
                                
                                  disabled
                                />
                                {
                                  false === false ?
                                   <Button
                                  className="btn btn-sm btn-danger"
                                  onClick={(event) => {
                                    this.onClick();
                                  }}
                                > Mettre en attente</Button> : null }

                              </CardBody>
                            </Card>
                          </Col>
                     
                  </Row>
                </Collapse>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-plain">
                <CardHeader
                  role="tab"
                  onClick={() => this.collapsesToggle("collapseOne")}
                  aria-expanded={this.state.openedCollapses.includes(
                    "collapseOne"
                  )}
                >
                  <h3 className="mb-0">Historique</h3>
                </CardHeader>
                <Collapse
                  role="tabpanel"
                  isOpen={this.state.openedCollapses.includes("collapseOne")}
                >
                  <CommitHistory></CommitHistory>
                </Collapse>
              </Card>
            </Col>

            <PendingPages></PendingPages>
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
  }
)(ManagePublish);
