import React, { Fragment } from "react";
import TagsInput from "react-tagsinput";
import { Link } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Col,
  FormGroup,
  Form,
  DropdownItem,
  Collapse,
  Badge,
  Row,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  ListGroup,
  ListGroupItem,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import classnames from "classnames";
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import {
  getCategories,
  updateCategory,
  updateSubategory,
  deleteCategory,
  deleteSubcategory,
  clearMessage,
} from "../../../../services/categoryServices/categoryAction";
import { clearErrors } from "../../../../services/errorServices/errorAction";

//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../layouts/Alerts";
import ReactBSAlert from "react-bootstrap-sweetalert";

class UpdateCategories extends React.Component {
  constructor() {
    super();
    this.state = {
      /***** category inputs *******/
      idCategory: "",
      category: {
        name: "",
        slug: "",
      },
      /***** subcategory inputs *******/
      idSubcategory: "",
      slugSubcategory: "",
      tagsinput: [],
      tagsinputToUpdate: [],
      subcategory: {
        name: "",
        slug: "",
      },
      /****** handle view inputs  ******/
      showCategoryUpdate: false,
      showSubCategoryUpdate: false,
      showUpdate: false,
      /***** all categories from db *******/
      categories: [],

      openedCollapses: [],
      alert: null,
      //inputs for category update validation
      categoryValidation: {
        name: true,
        slug: true,
      },
      //inputs for subcategory update validation
      subcategoryValidation: {
        name: true,
        slug: true,
        parentcategorie: null,
      },
      //permission
      permission: {},
    };
  }
  //gett categories from db
  componentWillMount() {
    this.props.getCategories();
  }
  componentWillReceiveProps(nextProps) {
    //getting categories & subcategories
    if (nextProps.categories.categories) {
      const Categories = nextProps.categories.categories;
      const mappedCategories = Categories.map((category) => {
        return {
          value: {
            _id: category._id,
            name: category.name,
            slug: category.slug,
            subcategories: category.subcategories,
          },
          label: category.name,
        };
      });

      this.setState({ categories: mappedCategories });
    }
    // getting success message
    if (nextProps.categories.message) {
      if (nextProps.categories.message !== "") {
        // success notification
        this.refs.notificationAlert.notificationAlert(
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

    // in case of invalid inputs => getting errors
    if (nextProps.errors) {
      //invalid credentials => show error alert with error
      if (nextProps.errors.errors) {
        //categoryValidation
        let categoryValidation = this.state.categoryValidation;
        nextProps.errors.errors.map((value, index) => {
          if (value.value === "") {
            categoryValidation[value.param] = false;
          }
          this.setState({ categoryValidation: categoryValidation });
        });
        //subcategoryValidation
        let subcategoryValidation = this.state.subcategoryValidation;
        nextProps.errors.errors.map((value, index) => {
          if (value.value === "") {
            subcategoryValidation[value.param] = false;
          }
          this.setState({ subcategoryValidation: subcategoryValidation });
        });

        this.refs.notificationAlert.notificationAlert(
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
    //To receive user permission
    if (nextProps.permission) {
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
  //handle view to update the corresponding category
  showUpdatingCategory(e, ch) {
    e.preventDefault();
    let category = this.state.category;
    category.name = ch.value.name;
    category.slug = ch.value.slug;

    this.setState({
      //the category to update
      idCategory: ch.value._id,
      category: category,
      //handle view state
      showUpdate: true,
      showCategoryUpdate: true,
      showSubCategoryUpdate: false,
    });
  }
  //handle view to update the corresponding subcategory
  showUpdatingSubCategory(e, ch) {
    e.preventDefault(e);

    //tags input to show
    let mappedTagsInputs = [];
    ch.properties.map((prop) => {
      mappedTagsInputs.push(prop.key);
    });
    //subcategory to show
    let subcategory = {
      name: ch.name,
      slug: ch.slug,
    };
    this.setState({
      subcategory: subcategory,
      tagsinput: mappedTagsInputs,
      idSubcategory: ch._id,
      tagsinputToUpdate: ch.properties,
      // handle the view
      showUpdate: true,
      showCategoryUpdate: false,
      showSubCategoryUpdate: true,
    });
  }

  //onchange Category
  onChangeCategory = (e) => {
    let category = this.state.category;
    if (e.target.name === "name") {
      category.name = e.target.value;
    }
    if (e.target.name === "slug") {
      category.slug = e.target.value;
    }
    this.setState({ category: category });

    //change input validation
    let target = e.target.name;
    let categoryValidation = this.state.categoryValidation;
    categoryValidation[target] = true;
    this.setState({ categoryValidation: categoryValidation });
  };
  //onchange Subcategory
  onChangeSubcategory = (e) => {
    let subcategory = this.state.subcategory;
    if (e.target.name === "namesub") {
      subcategory.name = e.target.value;
      //name validation
      let subcategoryValidation = this.state.subcategoryValidation;
      subcategoryValidation["name"] = true;
      this.setState({ subcategoryValidation: subcategoryValidation });
    }
    if (e.target.name === "slugsub") {
      subcategory.slug = e.target.value;
      //slug validation
      let subcategoryValidation = this.state.subcategoryValidation;
      subcategoryValidation["slug"] = true;
      this.setState({ subcategoryValidation: subcategoryValidation });
    }
    this.setState({ subcategory: subcategory });
  };

  //updating the tags of subcategory properties
  handleTagsinput = (tagsinput) => {
    const mappedTagsinputToUpdate = tagsinput.map((prop) => {
      return {
        key: prop,
        value: "",
        scrape: {
          value: false,
        },
      };
    });
    this.setState({
      tagsinputToUpdate: mappedTagsinputToUpdate,
      tagsinput: tagsinput,
    });
  };
  //updating category action
  onClickUpdateCategory = (e) => {
    e.preventDefault();
    let Category = {
      _id: this.state.idCategory,
      name: this.state.category.name,
      slug: this.state.category.slug,
    };
    this.props.updateCategory(Category);
  };
  //updating subcategory action
  onClickUpdateSubcategory = (e) => {
    e.preventDefault();
    let Subcategory = {
      _id: this.state.idSubcategory,
      name: this.state.subcategory.name,
      slug: this.state.subcategory.slug,
      properties: this.state.tagsinputToUpdate,
    };

    this.props.updateSubategory(Subcategory);
  };
  //Question Alert when deleting category
  DeleteCategoryAlert = (e) => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "-100px" }}
          title="Would you like to remove this Category?  "
          customIcon={
            <div
              className="swal2-icon swal2-question swal2-animate-question-icon"
              style={{ display: "flex" }}
            >
              <span className="swal2-icon-text">?</span>
            </div>
          }
          onConfirm={() => {
            //deleting category
            this.props.deleteCategory(this.state.idCategory);
            //hide updating
            this.setState({
              showCategoryUpdate: false,
              showSubCategoryUpdate: false,
              showUpdate: false,
            });
            //hiding the alert
            this.hideAlert();
            //showing success notification
            this.refs.notificationAlert.notificationAlert(
              NotificationAlertOptions(
                "success",
                "Success",
                "Category Deleted with success"
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
  //Question Alert when deleting subcategory
  DeleteSubcategoryAlert = (e) => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "-100px" }}
          title="Would you like to remove this Subcategory?  "
          customIcon={
            <div
              className="swal2-icon swal2-question swal2-animate-question-icon"
              style={{ display: "flex" }}
            >
              <span className="swal2-icon-text">?</span>
            </div>
          }
          onConfirm={() => {
            //deleting subcategory
            this.props.deleteSubcategory(this.state.idSubcategory);
            this.props.getCategories();
            //hide updating
            this.setState({
              showCategoryUpdate: false,
              showSubCategoryUpdate: false,
              showUpdate: false,
            });
            //hiding the alert
            this.hideAlert();
            //showing success notification
            this.refs.notificationAlert.notificationAlert(
              NotificationAlertOptions(
                "success",
                "Success",
                "Subcategory Deleted with success"
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
  //close update card
  closeUpdate = () => {
    console.log("clicked");
    this.setState({
      showCategoryUpdate: false,
      showSubCategoryUpdate: false,
      showUpdate: false,
    });
  };
  render() {
    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}

        <div className="rna-wrapper">
          <NotificationAlert ref="notificationAlert" />
        </div>
        {/********************  ALERT DIV  *********************/}
        {this.state.alert}
        {/******************************************************/}

        <SimpleHeader name="Updating Category" parentName="Categories" />
        <Container className="mt--6" fluid>
          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h5 className="h3 mb-0"> Modifier Categories </h5>
                    </Col>
                   
                      <Col className="text-right" xs="4">
                        <Button
                          color="default"
                          size="sm"
                          to="/admin/add-category"
                          tag={Link}
                        >
                          Ajouter
                        </Button>
                      </Col>
                   
                  </Row>
                </CardHeader>
                {/********************  VIEW CATEGORIES AND SUBCATEGORIES  *********************/}
                <CardBody>
                  <Form role="form">
                    <FormGroup className="row">
                      <Col md="8">
                        <div className="accordion">
                          {this.state.categories.map((category, index) => (
                            <Fragment key={index}>
                              <Card className="card-plain">
                                <CardHeader
                                  role="tab"
                                  onClick={() =>
                                    this.collapsesToggle(
                                      category.value.subcategories
                                    )
                                  }
                                  aria-expanded={this.state.openedCollapses.includes(
                                    category.value.subcategories
                                  )}
                                >
                                  <h3 className="mb-0">
                                    {" "}
                                    {category.value.name}{" "}
                                    <Badge color="secondary">
                                      {" "}
                                      <span className="btn-inner--icon">
                                        <a
                                          onClick={(e) =>
                                            this.showUpdatingCategory(
                                              e,
                                              category
                                            )
                                          }
                                        >
                                          <UncontrolledTooltip
                                            delay={0}
                                            trigger="hover focus"
                                            target={`tooltip${category._id}`}
                                          >
                                            Modifier Categorie
                                          </UncontrolledTooltip>
                                          <i
                                            className="ni ni-settings-gear-65"
                                            id={`tooltip${category._id}`}
                                          />
                                        </a>
                                      </span>
                                    </Badge>
                                  </h3>
                                </CardHeader>
                                <Collapse
                                  role="tabpanel"
                                  isOpen={this.state.openedCollapses.includes(
                                    category.value.subcategories
                                  )}
                                >
                                  {category.value.subcategories.map(
                                    (sub, index) => (
                                      <Fragment key={index}>
                                        <CardBody>
                                          <div className="d-flex justify-content-between pt-1">
                                            <div>
                                              <span className="text-muted text-sm font-weight-bold">
                                                {sub.name}{" "}
                                                <Badge
                                                  color="primary"
                                                  className="badge-md badge-circle badge-floating border-white"
                                                >
                                                  {sub.properties != null
                                                    ? sub.properties.length
                                                    : 0}{" "}
                                                </Badge>
                                              </span>
                                            </div>
                                            <div className="text-right">
                                              <a
                                                onClick={(e) =>
                                                  this.showUpdatingSubCategory(
                                                    e,
                                                    sub
                                                  )
                                                }
                                                id={`tooltip${sub._id}`}
                                              >
                                                <i className=" ni ni-settings-gear-65 " />
                                              </a>
                                              <UncontrolledTooltip
                                                delay={0}
                                                trigger="hover focus"
                                                target={`tooltip${sub._id}`}
                                              >
                                                Modifier Sous-Categorie
                                              </UncontrolledTooltip>
                                            </div>
                                          </div>
                                        </CardBody>
                                        <DropdownItem divider />
                                      </Fragment>
                                    )
                                  )}
                                </Collapse>
                              </Card>
                            </Fragment>
                          ))}
                        </div>
                      </Col>
                    </FormGroup>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            {/***************************************  UPDATING CATEGORY or SUBCATEGORY  **************************************/}
            {this.state.showUpdate ? (
              <Col xl="4">
                <Card>
                  <CardHeader>
                    <Row className="align-items-center">
                      <Col xs="8">
                        <h5 className="h3 mb-0">
                          Modification{" "}
                          {this.state.showCategoryUpdate ? (
                            <>Categorie</>
                          ) : (
                            <>Sous-Categorie</>
                          )}
                        </h5>{" "}
                      </Col>
                      <Col className="text-right" xs="4">
                        <Button
                          color="danger"
                          size="sm"
                          onClick={this.closeUpdate.bind(this)}
                        >
                          fermer
                        </Button>
                      </Col>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <ListGroup className="list my--3" flush>
                      <ListGroupItem className="px-0">
                        {/***************************************  UPDATING CATEGORY **************************************/}

                        {this.state.showCategoryUpdate ? (
                          <>
                            <Row className="align-items-center">
                              <div className="col ml-2 ">
                                <h4 className="mb-2">
                                  <a
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Nom
                                  </a>
                                </h4>
                                <InputGroup
                                  className={
                                    (classnames("input-group-merge"), "mb-2")
                                  }
                                >
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-bullet-list-67"></i>
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    placeholder="Insert New Categorie"
                                    type="text"
                                    name="name"
                                    type="string"
                                    value={this.state.category.name}
                                    invalid={
                                      !this.state.categoryValidation.name
                                    }
                                    onChange={this.onChangeCategory.bind(this)}
                                  />
                                </InputGroup>
                                {!this.state.categoryValidation.name ? (
                                  <InputGroup className="invalid-feedback">
                                    Required State.
                                  </InputGroup>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Row>
                            <Row className="align-items-center">
                              <div className="col ml-2 ">
                                <h4 className="mb-2">
                                  <a
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Slug
                                  </a>
                                </h4>
                                <InputGroup
                                  className={
                                    (classnames("input-group-merge"), "mb-2")
                                  }
                                >
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-world-2"></i>
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    placeholder="Insert New Categorie"
                                    type="text"
                                    name="slug"
                                    type="string"
                                    value={this.state.category.slug}
                                    onChange={this.onChangeCategory.bind(this)}
                                    invalid={
                                      !this.state.categoryValidation.slug
                                    }
                                  />
                                </InputGroup>
                                {!this.state.categoryValidation.slug ? (
                                  <InputGroup className="invalid-feedback">
                                    Required State.
                                  </InputGroup>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Row>
                            
                              <Row className="text-right">
                                <div className="col ml-2 ">
                                  <Button
                                    className="btn-icon"
                                    color="info"
                                    type="button"
                                    outline
                                    onClick={this.onClickUpdateCategory}
                                    id={`tooltip123`}
                                  >
                                    <span className="btn-inner--icon">
                                      <i className="ni ni-check-bold" />
                                    </span>
                                  </Button>

                                  <UncontrolledTooltip
                                    delay={0}
                                    trigger="hover focus"
                                    target={`tooltip123`}
                                  >
                                    Modifier
                                  </UncontrolledTooltip>

                                  <Button
                                    className="btn-icon"
                                    color="danger"
                                    type="button"
                                    id={`tooltip1234`}
                                    onClick={this.DeleteCategoryAlert}
                                  >
                                    <span className="btn-inner--icon">
                                      <i className="fas fa-trash" />
                                    </span>
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    trigger="hover focus"
                                    target={`tooltip1234`}
                                  >
                                    Supprimer
                                  </UncontrolledTooltip>
                                </div>
                              </Row>
                            
                          </>
                        ) : (
                          ""
                        )}
                        {/***************************************  UPDATING SUBCATEGORY **************************************/}

                        {this.state.showSubCategoryUpdate ? (
                          <>
                            {" "}
                            <Row className="align-items-center">
                              <div className="col ml-2 ">
                                <h4 className="mb-2">
                                  <a
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Sous-categorie
                                  </a>
                                </h4>
                                <InputGroup
                                  className={
                                    (classnames("input-group-merge"), "mb-2")
                                  }
                                >
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-align-center"></i>
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    placeholder="Insert New Categorie"
                                    type="text"
                                    name="namesub"
                                    type="string"
                                    value={this.state.subcategory.name}
                                    invalid={
                                      !this.state.subcategoryValidation.name
                                    }
                                    onChange={this.onChangeSubcategory.bind(
                                      this
                                    )}
                                  />
                                </InputGroup>
                                {!this.state.subcategoryValidation.name ? (
                                  <InputGroup className="invalid-feedback">
                                    Required State.
                                  </InputGroup>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Row>
                            <Row className="align-items-center">
                              <div className="col ml-2 ">
                                <h4 className="mb-2">
                                  <a
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Slug
                                  </a>
                                </h4>
                                <InputGroup
                                  className={
                                    (classnames("input-group-merge"), "mb-2")
                                  }
                                >
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="ni ni-world-2"></i>
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    placeholder="Insert New Categorie"
                                    type="text"
                                    name="slugsub"
                                    type="string"
                                    value={this.state.subcategory.slug}
                                    onChange={this.onChangeSubcategory.bind(
                                      this
                                    )}
                                    invalid={
                                      !this.state.subcategoryValidation.slug
                                    }
                                  />
                                </InputGroup>
                                {!this.state.subcategoryValidation.slug ? (
                                  <InputGroup className="invalid-feedback">
                                    Required State.
                                  </InputGroup>
                                ) : (
                                  ""
                                )}
                              </div>
                            </Row>
                            <Row className="align-items-center">
                              <div className="col ml-2 ">
                                <h4 className="mb-2">
                                  <a
                                    href="#pablo"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    Properietés
                                  </a>
                                </h4>

                                <TagsInput
                                  onlyUnique
                                  className="bootstrap-tagsinput"
                                  onChange={this.handleTagsinput}
                                  value={this.state.tagsinput}
                                  tagProps={{ className: "tag badge mr-1" }}
                                  inputProps={{
                                    className: "",
                                    placeholder: "",
                                  }}
                                />
                              </div>
                            </Row>
                           
                              <Row className="text-right">
                                <div className="col ml-2 ">
                                  <Button
                                    className="btn-icon"
                                    color="info"
                                    type="button"
                                    outline
                                    onClick={this.onClickUpdateSubcategory}
                                    id="tooltip12345"
                                  >
                                    <span className="btn-inner--icon">
                                      <i className="ni ni-check-bold" />
                                    </span>
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    trigger="hover focus"
                                    target={`tooltip12345`}
                                  >
                                    Modifier
                                  </UncontrolledTooltip>
                                  <Button
                                    className="btn-icon"
                                    color="danger"
                                    type="button"
                                    onClick={this.DeleteSubcategoryAlert}
                                    id="tooltip123456"
                                  >
                                    <span className="btn-inner--icon">
                                      <i className="fas fa-trash" />
                                    </span>
                                  </Button>
                                  <UncontrolledTooltip
                                    delay={0}
                                    trigger="hover focus"
                                    target={`tooltip123456`}
                                  >
                                    Supprimer
                                  </UncontrolledTooltip>
                                </div>
                              </Row>
                           
                          </>
                        ) : (
                          ""
                        )}
                      </ListGroupItem>
                    </ListGroup>
                  </CardBody>
                </Card>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  categories: state.categories,
  errors: state.errors,
  permission: state.auth.current_permission,
});
export default connect(mapStateToProps, {
  getCategories,
  updateCategory,
  updateSubategory,
  deleteCategory,
  deleteSubcategory,
  clearErrors,
  clearMessage,
})(UpdateCategories);
