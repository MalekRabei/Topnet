import React from "react";
import classnames from "classnames";
import Select from "react-select";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Col,
  Label,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Form,
  Row,
  Input,
  Badge,
} from "reactstrap";
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import {
  addCategory,
  addSubcategory,
  getCategories,
  clearMessage,
} from "../../../../services/categoryServices/categoryAction";
import { getAllProperties } from "../../../../services/productServices/productActions";
import { clearErrors } from "../../../../services/errorServices/errorAction";
//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../layouts/Alerts";
//table imports
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";

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

class AddCategorie extends React.Component {
  constructor() {
    super();
    this.state = {
      //category inputs
      parentcategorie: "",
      name: "",
      slug: "",
      //subcategory inputs
      tagsinput: [],
      selectParentCategorie: [],
      property: "",
      show: false,
      properties: [],
      allProperties: [],
      mappedProperties: [],
      //inputs for test validation
      validation: {
        name: true,
        slug: true,
        parentcategorie: null,
      },
      permission: {},
    };

    //to get the option selected of parent category
    this.SelectParentCategorieInputHandler = this.SelectParentCategorieInputHandler.bind(
      this
    );
    this.onChange = this.onChange.bind(this);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    let target = e.target.name;
    //change input validation
    this.state.validation[target] = true;
  };

  //OnChange Parent Category
  SelectParentCategorieInputHandler = (e) => {
    const inputState = {
      ...this.state,
    };
    const value = e !== null ? e.value : "";
    this.setState({ parentcategorie: value });
    if (value === "")
      //showing errors on the form
      this.setState((prevState) => {
        let validation = Object.assign({}, prevState.validation);
        validation.parentcategorie = true;
        return { validation };
      });
    else
      this.setState((prevState) => {
        let validation = Object.assign({}, prevState.validation);
        validation.parentcategorie = false;
        return { validation };
      });

    if (value.name == "None" || value == "") {
      //can't add properties in the view
      this.setState({ show: false });
    } else {
      //Adding properties to subcategory
      this.setState({ show: true });
    }
  };

  //to get categories
  componentWillMount() {
    this.props.getCategories();
    this.props.getAllProperties();
  }
  //To Get data from the reducer
  componentWillReceiveProps(nextProps) {
    // getting categories
    if (nextProps.categories.categories) {
      let mappedCategories = nextProps.categories.categories.map((category) => {
        return {
          value: {
            _id: category._id,
            name: category.name,
            slug: category.slug,
          },
          label: category.name,
        };
      });
      mappedCategories.push({
        value: {
          _id: 0,
          name: "None",
          slug: "",
        },
        label: "None",
      });
      this.setState({ selectParentCategorie: mappedCategories });
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
    //category/subcategory added => get success message
    if (nextProps.categories.message) {
      if (nextProps.categories.message !== "") {
        //initial state
        let validation = {
          name: true,
          slug: true,
          parentcategorie: null,
        };
        this.setState({
          validation: validation,
          name: "",
          slug: "",
          properties: [],
        });
        // success notification
        this.refs.notify.notificationAlert(
          NotificationAlertOptions(
            "success",
            "Success",
            nextProps.categories.message
          )
        );
        // clear success message
        this.props.clearMessage();
      }
    }
    //To receive user permission
    if (nextProps.permission) {
      this.setState({ permission: nextProps.permission });
    }

    let allProp = [];
    //get properties
    if (nextProps.products.properties) {
      nextProps.products.properties.map((prop, index) => {
        let property = {
          key: prop._id,
          added: false,
          value: prop.property,
        };
        allProp.push(property);
      });

      this.setState({ allProperties: allProp });
    }
  }

  onClickSubmit(e) {
    e.preventDefault();
    //no parent category selected
    if (this.state.parentcategorie === "") {
      //error notification
      this.refs.notify.notificationAlert(
        NotificationAlertOptions("danger", "Error", "Required Inputs")
      );
    }
    //if inputs are not empty
    else if (this.state.parentcategorie.name === "None") {
      let category = {
        name: this.state.name,
        slug: this.state.slug,
      };

      //adding category
      this.props.addCategory(category);
      //adding subcategory : parentcategory != none
    } else {
      //subcategory to add
      let Subcategory = {
        name: this.state.name,
        slug: this.state.slug,
        properties: this.state.mappedProperties,
        category: this.state.parentcategorie,
      };

      //add subcategory
      this.props.addSubcategory(Subcategory);
    }
  }

  //to add property to a subcategory
  onClickAddProperty(e, row) {
    //verif if selected row is an added prop
    let selectedRow = row;
    selectedRow.added = !row.added;
    let allProp = this.state.allProperties;
    allProp.map((prop) => {
      if (prop.key == selectedRow.key) {
        return selectedRow;
      } else {
        return prop;
      }
    });
    this.setState({ allProperties: allProp });

    //updated shown properties with the appropriate properties selected
    if (!selectedRow.added) {
      let MappedProp = this.state.properties.filter(
        (prop) => prop != selectedRow.value
      );
      this.setState({ properties: MappedProp });
    }
    //update mappedProp to add
    if (this.state.properties.indexOf(row.value) === -1) {
      let MappedProp = this.state.properties;
      MappedProp.push(row.value);
      this.setState(
        { properties: MappedProp },

        () => {
          let mappedProp = this.state.properties.map((prop) => {
            return {
              key: prop,
              value: "",
              scrape: {
                value: false,
              },
            };
          });
          this.setState({ mappedProperties: mappedProp });
        }
      );
    }
  }
  render() {
    console.log("cat", this.state)
    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}
        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>
        {/************************************************************/}

        <SimpleHeader name="Add Category" parentName="Categories" />
        <Container className="mt--6" fluid>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col xs="8">
                  <h5 className="h3 mb-0"> Add Category</h5>
                </Col>
                
                  <Col className="text-right" xs="4">
                    <h4 className="h4 mb-0 text-danger">
                      {" "}
                      Add Permission Denied
                    </h4>
                  </Col>
               
              </Row>
            </CardHeader>
            <CardBody>
              <Form role="form" onSubmit={this.onSubmit}>
                <FormGroup className="row">
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                    md="2"
                  >
                    New Categorie Name
                  </Label>
                  <Col md="8">
                    <InputGroup className={classnames("input-group-merge")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-bullet-list-67"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Insert New Categorie"
                        invalid={!this.state.validation.name}
                        name="name"
                        type="text"
                        value={this.state.name}
                        onChange={this.onChange}
                      />
                    </InputGroup>
                    {!this.state.validation.name ? (
                      <InputGroup className="invalid-feedback">
                        Required State.
                      </InputGroup>
                    ) : (
                      ""
                    )}
                  </Col>
                </FormGroup>

                <FormGroup className="row">
                  <Label
                    className="form-control-label"
                    htmlFor="example-text-input"
                    md="2"
                  >
                    Slug
                  </Label>
                  <Col md="8">
                    <InputGroup className={classnames("input-group-merge")}>
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-world-2" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Url-friendly Version of the Name"
                        invalid={!this.state.validation.slug}
                        name="slug"
                        type="text"
                        value={this.state.slug}
                        onChange={this.onChange}
                      />
                    </InputGroup>
                    {!this.state.validation.slug ? (
                      <InputGroup className="invalid-feedback">
                        Required State.
                      </InputGroup>
                    ) : (
                      ""
                    )}
                  </Col>
                </FormGroup>
                <FormGroup className="row">
                  <Label
                    className="form-control-label"
                    htmlFor="exampleFormControlSelect3"
                    md="2"
                  >
                    Parent Categorie
                  </Label>
                  <Col md="8">
                    <Select
                      name="parentcategorie"
                      options={this.state.selectParentCategorie}
                      onChange={this.SelectParentCategorieInputHandler}
                      isClearable="true"
                      isSearchable="true"
                      invalid={this.state.validation.parentcategorie}
                    />
                    {this.state.validation.parentcategorie ? (
                      <InputGroup className="invalid-feedback">
                        Required State.
                      </InputGroup>
                    ) : (
                      ""
                    )}
                  </Col>
                </FormGroup>

                {this.state.show ? (
                  <>
                    <FormGroup className="row">
                      <Label
                        className="form-control-label"
                        htmlFor="example-text-input"
                        md="2"
                      >
                        Add Properties
                      </Label>
                      <Col md="8">
                        {this.state.properties.map((prop, index) => {
                          return (
                            <React.Fragment key={index}>
                              <Badge color="success" pill key={index}>
                                {prop}
                              </Badge>
                            </React.Fragment>
                          );
                        })}
                      </Col>
                    </FormGroup>
                    <FormGroup className="row">
                      {/* <Col md ="2"> </Col> */}
                      <Col md="12">
                        <ToolkitProvider
                          data={this.state.allProperties}
                          keyField="key"
                          columns={[
                            { dataField: "", text: "", sort: true },
                            {
                              dataField: "value",
                              text: "property",
                              sort: true,
                            },

                            {
                              dataField: "link",
                              text: "ACTION",
                              formatter: (rowContent, row) => {
                                return (
                                  <>
                                    <label className="custom-toggle">
                                      <input
                                        defaultChecked={row.added}
                                        type="checkbox"
                                        onChange={(e) =>
                                          this.onClickAddProperty(e, row)
                                        }
                                      />
                                      <span
                                        className="custom-toggle-slider rounded-circle"
                                        data-label-off="disable"
                                        data-label-on="enable"
                                      />
                                    </label>
                                  </>
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
                      </Col>
                    </FormGroup>
                  </>
                ) : (
                  ""
                )}
                <Col md="10" className=" text-right">
                  <Col>
                    <Button
                      className="my-0"
                      color="btn btn-outline-default"
                      to="/admin/category/update"
                      tag={Link}
                    >
                      Back To Categories
                    </Button>

                    
                      <Button
                        className="my-0"
                        color="btn btn-outline-primary"
                        onClick={this.onClickSubmit.bind(this)}
                      >
                        Add
                      </Button>
                    
                  </Col>
                </Col>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.categories,
  errors: state.errors,
  permission: state.auth.current_permission,
  products: state.products,
});
export default connect(mapStateToProps, {
  addCategory,
  addSubcategory,
  getCategories,
  clearMessage,
  clearErrors,
  getAllProperties,
})(AddCategorie);
