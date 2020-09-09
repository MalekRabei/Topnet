import React from "react";
import classnames from "classnames";
import Select from "react-select";
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

// core components
import { connect } from "react-redux";
import {
  //  getProductProperties,
  addProductProperties,
  ScrapeUpdateProductProperties,
  ScrapeData,
  CleanScrapedData,
} from "../../../../../services/productServices/productActions";
import { getCategories } from "../../../../../services/categoryServices/categoryAction";
import { clearErrors } from "../../../../../services/errorServices/errorAction";
//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../../layouts/Alerts";

class AddProductProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //categories state
      categories: [],
      selectCategoriesData: [],
      selectSubategoriesData: [],
      selectedProperties: [],
      subcategories: [],
      idSubcategorySelected: "",
      selectedCategory: "",
      subcategorySelected: "",
      propertiesToAdd: [],

      showSubcategories: false,
      showProperties: false,
      showScrip: false,
      redirectUpdate: false,

      index: -1,

      property: "",
      link: "",
    };
  }

  componentWillMount() {
    //get categories
    this.props.getCategories();
  }

  componentWillReceiveProps(nextProps) {
    //verif categories
    if (nextProps.categories) {
      this.setState({ categories: nextProps.categories });
      const categories = nextProps.categories;
      //categories to push in the option form
      const mappedCategories = categories.map((category) => {
        return {
          value: { name: category.name, _id: category._id },
          label: category.slug,
        };
      });
      this.setState({ selectCategoriesData: mappedCategories });
    }
    //receiving scraped data
    if (nextProps.scraped_data) {
      //update properties state with new scraped values
      this.setState({
        selectedProperties: this.state.selectedProperties.map((prop, index) => {
          if (index == this.state.index) {
            let propertyToAdd = {
              key: this.state.selectedProperties[index].key,
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
    //invalid scrap input => show error alert with error
  /*  if (nextProps.errors.errors) {
      this.refs.notify.notificationAlert(
        NotificationAlertOptions(
          "danger",
          "Error",
          nextProps.errors.errors[0].msg
        )
      );
      //clear errors
      this.props.clearErrors();
    }*/
  }
  //select category handler
  SelectCategoryInputHandler(e) {
    //if we select category
    if (e !== null) {
      let selectedCategory = this.state.categories.filter(
        (category) => category._id === e.value._id
      );
      //subcategories to push in the option form
      const mappedSubategories = selectedCategory[0].subcategories.map(
        (sub) => {
          return {
            value: {
              name: sub.name,
              _id: sub._id,
              category: selectedCategory[0]._id,
            },
            label: sub.slug,
          };
        }
      );
      //update state values
      this.setState({
        selectSubategoriesData: mappedSubategories,
        showSubcategories: true,
        selectedCategory: selectedCategory[0].slug,
        showProperties: false,
      });
      //when no category selected
    } else {
      this.setState({
        subcategories: [],
        showSubcategories: false,
        showProperties: false,
      });
    }
  }
  SelectSubategoryInputHandler(e) {
    if (e !== null) {
      //get the category of the subcategory selected
      let selectedCategory = this.state.categories.filter(
        (category) => category._id === e.value.category
      );
      //get details of the subcategory selected
      let SelectedSubcategory = selectedCategory[0].subcategories.filter(
        (sub) => sub._id === e.value._id
      );
      //update state with the details of the subcategory selected
      this.setState({
        selectedProperties: SelectedSubcategory[0].properties,
        idSubcategorySelected: SelectedSubcategory[0]._id,
        subcategorySelected: SelectedSubcategory[0].slug,
        showProperties: true,
      });
    } else {
      this.setState({
        //  subcategories: [],
        showProperties: false,
      });
    }
  }

  //on change properties handler
  onChangeAddProperties(e, index) {
    //changed property
    let propertyToAdd = {
      key: this.state.selectedProperties[index].key,
      value: e.target.value,
      scrape: {
        value: false,
      },
    };
    //update state with the new value
    this.setState({
      selectedProperties: this.state.selectedProperties.map((prop, index1) => {
        if (index1 == index) {
          return propertyToAdd;
        } else {
          return prop;
        }
      }),
    });
  }

  //affect properties to the current product
  onClickAdd(e) {
    e.preventDefault();
    let productProperties = {
      idProduct: this.props.idProduct,
      idSubcategory: this.state.idSubcategorySelected,
      properties: this.state.selectedProperties,
      path:
        this.state.selectedCategory +
        "/" +
        this.state.subcategorySelected +
        "/" +
        this.props.title,
    };
    this.props.addProductProperties(productProperties);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  //show script card
  showScripAddCard = (e, index) => {
    this.props.CleanScrapedData();
    this.setState({ showScrip: true, index: index, link: "", property: "" });
  };
  //hide script card
  hideScripCard = () => {
    this.setState({ showScrip: false });
  };

  //scrape selected property
  onClickAddScrape(e) {
    let data = {
      link: this.state.link,
      property: this.state.property,
    };
    this.props.ScrapeData(data);
  }

  // handle automatic scrape for the selected property
  onChangeCheckboxValue = (e) => {
    // if the selected property is scraped automatically
    if (e.target.value === "true") {
      this.setState({
        selectedProperties: this.state.selectedProperties.map((prop, index) => {
          if (index == this.state.index) {
            let propertyToAdd = {
              key: this.state.selectedProperties[index].key,
              value: this.state.selectedProperties[index].value,
              scrape: {
                //then set automatic scrape to false
                value: false,
                link: this.state.selectedProperties[index].scrape.link,
                property: this.state.selectedProperties[index].scrape.property,
              },
            };
            return propertyToAdd;
          } else {
            return prop;
          }
        }),
      });
    } else {
      // if the selected property is not scraped automatically
      this.setState({
        selectedProperties: this.state.selectedProperties.map((prop, index) => {
          if (index == this.state.index) {
            let propertyToAdd = {
              key: this.state.selectedProperties[index].key,
              value: this.state.selectedProperties[index].value,
              scrape: {
                //then set automatic scrape to true
                value: true,
                link: this.state.selectedProperties[index].scrape.link,
                property: this.state.selectedProperties[index].scrape.property,
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
  render() {
    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}
        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                <h3 className="mb-0">
                  Add properties to
                  <b> &nbsp; {this.props.title} </b>
                </h3>
              </CardHeader>
              <CardBody>
                <Col>
                  <Form role="form">
                    <FormGroup className="row">
                      <Label
                        className="form-control-label"
                        htmlFor="exampleFormControlSelect3"
                        md="2"
                      >
                        Select Category
                      </Label>
                      <Col md="7">
                        <Select
                          name="category"
                          options={this.state.selectCategoriesData}
                          onChange={(e) => this.SelectCategoryInputHandler(e)}
                          isClearable="true"
                          isSearchable="true"
                        />
                      </Col>
                    </FormGroup>
                    {this.state.showSubcategories ? (
                      <FormGroup className="row">
                        <Label
                          className="form-control-label"
                          htmlFor="exampleFormControlSelect3"
                          md="2"
                        >
                          Select Subcategory
                        </Label>
                        <Col md="7">
                          <Select
                            name="subcategories"
                            options={this.state.selectSubategoriesData}
                            onChange={(e) =>
                              this.SelectSubategoryInputHandler(e)
                            }
                            isClearable="true"
                            isSearchable="true"
                          />
                        </Col>
                      </FormGroup>
                    ) : (
                      ""
                    )}

                    {this.state.showProperties ? (
                      <>
                        {" "}
                        <FormGroup className="row">
                          <Label
                            className="form-control-label"
                            htmlFor="exampleFormControlSelect3"
                            md="2"
                          >
                            Properties
                          </Label>
                          <Col md="10">
                            {this.state.selectedProperties.map(
                              (prop, index) => {
                                return (
                                  <React.Fragment key={index}>
                                    <Row>
                                      <Col>
                                        {" "}
                                        <InputGroup
                                          className={classnames(
                                            "input-group-merge  mb-4"
                                          )}
                                        >
                                          <InputGroupText>
                                            {prop.key}
                                          </InputGroupText>
                                          <Input
                                            placeholder=""
                                            type="text"
                                            name={prop.key}
                                            onChange={(e) =>
                                              this.onChangeAddProperties(
                                                e,
                                                index
                                              )
                                            }
                                            value={
                                              this.state.selectedProperties[
                                                index
                                              ].value
                                            }
                                          />
                                        </InputGroup>{" "}
                                      </Col>
                                      <Col>
                                        <Button
                                          color="secondary"
                                          outline
                                          type="button"
                                          onClick={(e) =>
                                            this.showScripAddCard(e, index)
                                          }
                                        >
                                          scrape
                                        </Button>
                                      </Col>
                                    </Row>
                                  </React.Fragment>
                                );
                              }
                            )}
                          </Col>
                        </FormGroup>
                      </>
                    ) : (
                      ""
                    )}
                  </Form>
                </Col>
                <Row>
                  <Col lg="9" className="text-right">
                    <Button
                      color="btn btn-outline-default"
                      to="/admin/siteproducts"
                      tag={Link}
                    >
                      Back To Site Products
                    </Button>
                    <Button
                      color="btn btn-outline-primary"
                      type="submit"
                      onClick={(e) => this.onClickAdd(e)}
                    >
                      Add
                    </Button>
                  </Col>
                </Row>
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
                    Scrape Property{" "}
                    <b>
                      {" "}
                      {this.state.selectedProperties[this.state.index].key}{" "}
                    </b>
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
                              this.state.selectedProperties[this.state.index]
                                .scrape.value
                            }
                            value={
                              this.state.selectedProperties[this.state.index]
                                .scrape.value
                            }
                            onChange={this.onChangeCheckboxValue}
                            name={
                              this.state.selectedProperties[this.state.index]
                                .key
                            }
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
                      onClick={this.onClickAddScrape.bind(this)}
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
    categories: state.categories.categories,
    properties: state.products.properties,
    scraped_data: state.products.scraped_data,
    errors: state.errors,
  }),
  {
    getCategories,
    addProductProperties,
    ScrapeUpdateProductProperties,
    ScrapeData,
    clearErrors,
    CleanScrapedData,
  }
)(AddProductProperties);
