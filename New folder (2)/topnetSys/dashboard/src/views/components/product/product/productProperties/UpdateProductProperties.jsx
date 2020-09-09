//SIMPLE FORM
import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Label,
  FormGroup,
  InputGroup,
  InputGroupText,
  Form,
  Input,
} from "reactstrap";

import { connect } from "react-redux";
import {
  getProductProperties,
  updateProductProperties,
  ScrapeUpdateProductProperties,
  ScrapeData,
  clearMessage,
  deleteProductProperties,
} from "../../../../../services/productServices/productActions";
import { getCategories } from "../../../../../services/categoryServices/categoryAction";
import { clearErrors } from "../../../../../services/errorServices/errorAction";
//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../../layouts/Alerts";
import ReactBSAlert from "react-bootstrap-sweetalert";

class UpdateProductProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idProductProperties: "",
      product: {},
      subcategory: {},
      category: {},
      properties: [],

      link: "",
      property: "",
      index: "",
      //alert
      alert: null,
    };
  }
  componentWillMount() {
    //to get product properties
    this.props.getProductProperties(this.props.idProduct);
    //to get all categories & subcategries
    this.props.getCategories();
  }
  componentWillReceiveProps(nextProps) {
    //receving product properties
    if (nextProps.productProperties) {
      if (JSON.stringify(nextProps.productProperties) !== "{}") {
        this.setState({ nb_propperties: 1 });
        this.setState({
          product: nextProps.productProperties.product,
          subcategory: nextProps.productProperties.subcategory,
          // properties: nextProps.productProperties.properties,
          category: nextProps.productProperties.subcategory.category,
          idProductProperties: nextProps.productProperties._id,
        });
      } else {
        this.setState({ nb_propperties: 0 });
      }
    } else {
      this.setState({ nb_propperties: 0 });
    }
    // receving product properties
    if (nextProps.properties) {
      this.setState({ properties: nextProps.properties });
    }
    //receving scraped data
    if (nextProps.scraped_data) {
      if (JSON.stringify(nextProps.scraped_data) === "{}")
        console.log("false ");
      else {
        this.setState({
          properties: this.state.properties.map((prop, index) => {
            if (index == this.state.index) {
              let propertyToAdd = {
                key: this.state.properties[index].key,
                value: nextProps.scraped_data,
                scrape: {
                  value: true,
                  link: this.state.link,
                  property: this.state.property,
                },
              };
              return propertyToAdd;
            } else {
              return prop;
            }
          }),
        });
      }
    }
    //invalid scrape input => show error alert with error
    if (nextProps.errors.errors) {
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
    //product properties updates  => get success message
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
      }
    }
  }
  //on change selected product property
  onChangeUpdateProperties(e, index) {
    let value = this.state.properties[index];
    value.value = e.target.value;
    this.setState({
      properties: this.state.properties.map((prop, key) => {
        if (key == index) {
          return value;
        } else {
          return prop;
        }
      }),
    });
  }
  //on clic update product
  onClickUpdate(e) {
    e.preventDefault();
    let productProperties = {
      idProductProp: this.state.idProductProperties,
      idSubcategory: this.state.subcategory._id,
      idProduct: this.state.product._id,
      properties: this.state.properties,
    };

    this.props.updateProductProperties(productProperties);
  }
  //show scrip property card
  showScripUpdateCard = (e, index) => {
    this.setState({ showScrip: true, index: index, link: "", property: "" });
  };
  //hide scrip property card
  hideScripCard = () => {
    this.setState({ showScrip: false });
  };
  //Scrip property card
  onClickUpdateScrape(e) {
    let data = {
      link: this.state.link,
      property: this.state.property,
    };
    this.props.ScrapeData(data);
    let propertyToAdd = {
      key: this.state.properties[this.state.index].key,
      value: this.state.link,
    };
  }
  //on change simple input values
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  // to get checkbox value
  onChangeCheckboxValue = (e) => {
    console.log(
      "e.target.name ",
      e.target.name,
      "e.target.value ",
      e.target.value
    );
    //if the selected product property automatically get scrape data

    if (e.target.value === "true") {
      this.setState({
        properties: this.state.properties.map((prop, index) => {
          if (index == this.state.index) {
            let propertyToAdd = {
              key: this.state.properties[index].key,
              value: this.state.properties[index].value,
              scrape: {
                //then disable automatic scrape
                value: false,
                link: this.state.properties[index].scrape.link,
                property: this.state.properties[index].scrape.property,
              },
            };
            return propertyToAdd;
          } else {
            return prop;
          }
        }),
      });
    } else {
      //if the selected product property do not automatically get scrape data

      this.setState({
        properties: this.state.properties.map((prop, index) => {
          if (index == this.state.index) {
            let propertyToAdd = {
              key: this.state.properties[index].key,
              value: this.state.properties[index].value,
              scrape: {
                //enable automatic scrape

                value: true,
                link: this.state.properties[index].scrape.link,
                property: this.state.properties[index].scrape.property,
              },
            };
            return propertyToAdd;
          } else {
            return prop;
          }
        }),
      });
    }
  };

  //delete product properties
  onClickDelete() {
    console.log(this.state.idProductProperties);
    this.props.deleteProductProperties(this.state.idProductProperties);
  }
  //Question Alert when deleting product properties
  questionAlert = () => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "-100px" }}
          title="Would you like to remove these properties?  "
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
            this.props.deleteProductProperties(this.state.idProductProperties);
            //hiding the alert
            this.hideAlert();
            //showing success notification
            this.refs.notify.notificationAlert(
              NotificationAlertOptions(
                "success",
                "Success",
                "Properties Deleted with success"
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
        {/********************  ALERT   *********************/}
        {this.state.alert}
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      Update properties of &nbsp;
                      <b>{this.props.title}</b>
                    </h3>{" "}
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="danger"
                      size="sm"
                      onClick={this.questionAlert.bind(this)}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Col>
                  <Form role="form">
                    <FormGroup className="row ">
                      <Label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                        md="2"
                      >
                        <h4 className="text-primary font-weight-bold">
                          Category
                        </h4>
                      </Label>
                      <Col>
                        <Label
                          className="form-control-label"
                          htmlFor="exampleFormControlSelect3"
                          md="4"
                        >
                          {this.state.category.name}
                        </Label>
                      </Col>
                    </FormGroup>
                    <FormGroup className="row ">
                      <Label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                        md="2"
                      >
                        <h4 className="text-primary font-weight-bold">
                          Subcategory
                        </h4>
                      </Label>
                      <Col>
                        <Label
                          className="form-control-label"
                          htmlFor="exampleFormControlSelect3"
                          md="4"
                        >
                          {this.state.subcategory.name}
                        </Label>
                      </Col>
                    </FormGroup>
                    <>
                      <Col lg="12" className="ml--3">
                        <FormGroup>
                          <Label
                            className="form-control-label"
                            htmlFor="exampleFormControlSelect3"
                          >
                            <h4 className="text-primary font-weight-bold">
                              Properties
                            </h4>
                          </Label>
                          <Col>
                            <Label
                              className="form-control-label"
                              htmlFor="exampleFormControlSelect3"
                              md="4"
                            ></Label>
                          </Col>
                        </FormGroup>
                      </Col>
                      <Row>
                        <FormGroup className="row mt--4 ml-3">
                          {this.state.properties.map((prop, index) => {
                            return (
                              <React.Fragment key={index}>
                                <Col md="7">
                                  <InputGroup
                                    className={classnames(
                                      "input-group-merge  mb-4"
                                    )}
                                  >
                                    <InputGroupText>
                                      <b> {prop.key} </b>
                                    </InputGroupText>
                                    <Input
                                      placeholder="value"
                                      type="text"
                                      name={prop.key}
                                      onChange={(e) =>
                                        this.onChangeUpdateProperties(e, index)
                                      }
                                      value={prop.value}
                                    />
                                  </InputGroup>
                                </Col>
                                <Col>
                                  <Row>
                                    <Col>
                                      <Button
                                        color="secondary"
                                        outline
                                        type="button"
                                        onClick={(e) =>
                                          this.showScripUpdateCard(e, index)
                                        }
                                      >
                                        scrape
                                      </Button>
                                    </Col>
                                  </Row>
                                </Col>
                              </React.Fragment>
                            );
                          })}
                        </FormGroup>
                      </Row>
                    </>
                    <Row>
                      <Col lg="9" className="text-right">
                        <Button
                          //className="my-0"
                          color="btn btn-outline-default"
                          to="/admin/siteproducts"
                          tag={Link}
                        >
                          Back To Site Products
                        </Button>
                        <Button
                          //className="my-0"
                          color="btn btn-outline-primary"
                          type="submit"
                          onClick={(e) => this.onClickUpdate(e)}
                        >
                          Update
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </CardBody>
            </Card>
          </Col>
          {/****** SCRIP ADD FORM  *********/}
          {this.state.showScrip ? (
            <Col xl="4">
              {" "}
              <Card>
                <CardHeader>
                  <h3 className="mb-0">
                    Scrape property{" "}
                    <b> {this.state.properties[this.state.index].key} </b>
                  </h3>
                </CardHeader>
                <CardBody>
                  <FormGroup className="row">
                    <Label
                      className="form-control-label"
                      htmlFor="example-text-input"
                      md="4"
                    >
                      Link
                    </Label>
                    <Col md="7">
                      <InputGroup className={classnames("input-group-merge")}>
                        <Input
                          placeholder="Insert Website Link"
                          name="link"
                          type="text"
                          value={this.state.link}
                          onChange={this.onChange.bind(this)}
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup className="row">
                    <Label
                      className="form-control-label"
                      htmlFor="example-text-input"
                      md="4"
                    >
                      Property
                    </Label>
                    <Col md="7">
                      <InputGroup className={classnames("input-group-merge")}>
                        <Input
                          placeholder="Insert Property (XPath)"
                          name="property"
                          type="text"
                          //invalid={this.state.validation.title}
                          value={this.state.property}
                          onChange={this.onChange.bind(this)}
                        />
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup className="row">
                    <Label
                      className="form-control-label"
                      htmlFor="example-text-input"
                      md="4"
                    >
                      Activate Cron
                    </Label>
                    <Col md="7" className="mt-2">
                      <InputGroup className={classnames("input-group-merge")}>
                        <label className="custom-toggle custom-toggle-danger mr-1">
                          <input
                            checked={
                              this.state.properties[this.state.index].scrape
                                .value
                            }
                            value={
                              this.state.properties[this.state.index].scrape
                                .value
                            }
                            onChange={this.onChangeCheckboxValue}
                            name={this.state.properties[this.state.index].key}
                            type="checkbox"
                          />

                          <span
                            className="custom-toggle-slider rounded-circle"
                            data-label-off="no"
                            data-label-on="yes"
                          />
                        </label>
                      </InputGroup>
                    </Col>
                  </FormGroup>

                  <div className="text-right">
                    <Button
                      color="danger"
                      outline
                      type="button"
                      onClick={this.hideScripCard.bind(this)}
                    >
                      Close
                    </Button>
                    <Button
                      color="success"
                      outline
                      type="button"
                      onClick={this.onClickUpdateScrape.bind(this)}
                    >
                      Search
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          ) : (
            ""
          )}
        </Row>
      </>
    );
  }
}

export default connect(
  (state) => ({
    productProperties: state.products.productproperties,
    categories: state.categories.categories,
    properties: state.products.properties,
    scraped_data: state.products.scraped_data,
    errors: state.errors,
    products: state.products,
  }),
  {
    getProductProperties,
    getCategories,
    updateProductProperties,
    ScrapeUpdateProductProperties,
    ScrapeData,
    clearErrors,
    clearMessage,
    deleteProductProperties,
  }
)(UpdateProductProperties);
