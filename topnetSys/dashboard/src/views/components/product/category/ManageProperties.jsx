//SIMPLE FORM
import React, { Component, Fragment } from "react";
import classnames from "classnames";

import { connect } from "react-redux";
import {
  addProperty,
  deleteProperty,
  updateProperty,
  getAllProperties,
  clearMessage,
} from "../../../../services/productServices/productActions";
import { clearErrors } from "../../../../services/errorServices/errorAction";
//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../layouts/Alerts";
import ReactBSAlert from "react-bootstrap-sweetalert";

//TABLE
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Label,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  Input,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

// core components
import SimpleHeader from "../../../../components/Headers/SimpleHeader";

import { element } from "prop-types";
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

class ManageProperties extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      property: "",
      properties: [],
      showUpdate: false,
      selectedProperty: {},
      propTpUpdate: "",
      id_propToUpdate: "",
      validation: {
        property: true,
      },
      //alert
      alert: null,
    };
  }

  //To receive from the reducer
  componentWillReceiveProps(nextProps) {
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
    //product added => get success message
    if (nextProps.products.message) {
      if (nextProps.products.message !== "") {
        // success notification
        this.refs.notify.notificationAlert(
          NotificationAlertOptions(
            "success",
            "Success",
            nextProps.products.message
          )
        );
        // clear success message
        this.props.clearMessage();
        this.setState({
          property: "",
        });
      }
    }
    //To receive user permission
    // if (nextProps.permission) {
    //   console.log("permission ", nextProps.permission);
    //   this.setState({ permission: nextProps.permission });
    // }

    //to revceive properties
    if (nextProps.products.properties) {
      this.setState({ properties: nextProps.products.properties });
    }
  }
  //getting existing product from db
  componentWillMount() {
    this.props.getAllProperties();
  }
  //to get simple input value
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    let target = e.target.name;
    //change input validation
    this.state.validation[target] = true;
  };

  //add property
  onClickAdd = () => {
    console.log("property to add  ", this.state.property);
    let data = { data: this.state.property };
    this.props.addProperty(data);
  };

  //show update card
  showUpdate(e, row) {
    console.log("row ", row);
    this.setState({
      showUpdate: true,
      propTpUpdate: row.property,
      id_propToUpdate: row._id,
    });
  }
  //hide update card
  hideUpdate(e, row) {
    console.log("row ", row);
    this.setState({ showUpdate: false, propTpUpdate: "", id_propToUpdate: "" });
  }

  //on change prop to Update
  onChangeUpdateInput(e) {
    this.setState({ propTpUpdate: e.target.value });
  }

  //confirm Update
  onClickUpdate() {
    let data = {
      _id: this.state.id_propToUpdate,
      property: this.state.propTpUpdate,
    };
    this.props.updateProperty(data);
  }

  //Question Alert when deleting property
  questionAlert = (e, id) => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "-100px" }}
          title="Would you like to remove this Property?  "
          customIcon={
            <div
              className="swal2-icon swal2-question swal2-animate-question-icon"
              style={{ display: "flex" }}
            >
              <span className="swal2-icon-text">?</span>
            </div>
          }
          onConfirm={() => {
            //deleting the product
            this.props.deleteProperty(id);
            //hiding the alert
            this.hideAlert();
            //showing success notification
            this.refs.notify.notificationAlert(
              NotificationAlertOptions(
                "success",
                "Success",
                "Property Deleted with success"
              )
            );
          }}
          onCancel={() => this.hideAlert()}
          confirmBtnBsStyle="default"
          confirmBtnText="Ok"
          btnSize=""
        >
          Delete Operation
        </ReactBSAlert>
      ),
    });
  };
  //hide the alert
  hideAlert = () => {
    this.setState({
      alert: null,
    });
  };
  render() {
    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}
        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>
        {/********************  ALERT DIV  *********************/}
        {this.state.alert}
        <SimpleHeader name="Manage Design " parentName="Global Tools " />
        <Container className="mt--6" fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h3 className="mb-0">Manage Properties</h3>
                </CardHeader>
                <CardBody>
                  {/*         ADD PROPERTY     */}
                  <FormGroup className="row">
                    <Label
                      className="form-control-label"
                      htmlFor="example-text-input"
                      md="2"
                    >
                      New Property Name
                    </Label>
                    <Col md="7">
                      <InputGroup className={classnames("input-group-merge")}>
                        <Input
                          placeholder="Add New Property "
                          name="property"
                          type="text"
                          value={this.state.property}
                          onChange={this.onChange}
                          invalid={!this.state.validation.property}
                        />
                      </InputGroup>
                      {!this.state.validation.property ? (
                        <InputGroup className="invalid-feedback">
                          Required State.
                        </InputGroup>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col>
                      {" "}
                      <FormGroup className="row">
                        <Button
                          color="primary"
                          type="submit"
                          onClick={this.onClickAdd.bind(this)}
                        >
                          Add
                        </Button>
                      </FormGroup>{" "}
                    </Col>
                  </FormGroup>
                  {/*     VIEW ALL PROPERTIES      */}

                  <ToolkitProvider
                    data={this.state.properties}
                    keyField="_id"
                    columns={[
                      {
                        dataField: "property",
                        text: "property",
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
                                onClick={(e) => this.showUpdate(e, row)}
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
                                onClick={(e) => this.questionAlert(e, row._id)}
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
                    {(props) => (
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
                </CardBody>
              </Card>
            </Col>
            {this.state.showUpdate ? (
              <Col xl="4">
                <Card>
                  <CardHeader>
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h5 className="h3 mb-0">Updating Property</h5>{" "}
                      </Col>
                      <Col className="text-right" xs="4">
                        <Button
                          color="danger"
                          size="sm"
                          onClick={this.hideUpdate.bind(this)}
                        >
                          close
                        </Button>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <ListGroup className="list my--3" flush>
                      <ListGroupItem className="px-0">
                        <Row className="align-items-center">
                          <div className="col ml-2 ">
                            <h4 className="mb-2">
                              <a
                                href="#pablo"
                                onClick={(e) => e.preventDefault()}
                              >
                                Property Name
                              </a>
                            </h4>
                            <InputGroup
                              className={
                                (classnames("input-group-merge"), "mb-2")
                              }
                            >
                              <Input
                                placeholder="Insert New Categorie"
                                type="text"
                                name="propTpUpdate"
                                type="string"
                                value={this.state.propTpUpdate}
                                // invalid={
                                //   !this.state.categoryValidation.name
                                // }
                                onChange={this.onChangeUpdateInput.bind(this)}
                              />
                            </InputGroup>
                            {/* {!this.state.categoryValidation.name ? (
                                  <InputGroup className="invalid-feedback">
                                    Required State.
                                  </InputGroup>
                                ) : (
                                  ""
                                )} */}

                            <Button
                              color="primary"
                              type="submit"
                              onClick={this.onClickUpdate.bind(this)}
                            >
                              Update
                            </Button>
                          </div>
                        </Row>
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
            ) : null}
          </Row>
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  products: state.products,
  errors: state.errors,
  permission: state.auth.current_permission,
});
export default connect(mapStateToProps, {
  addProperty,
  deleteProperty,
  updateProperty,
  getAllProperties,
  addProperty,
  clearErrors,
  clearMessage,
})(ManageProperties);
