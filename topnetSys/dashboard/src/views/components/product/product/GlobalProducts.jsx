import React, { Fragment } from "react";
import classnames from "classnames";
import CountriesData from "../../../../utils/CountryData/CountriesData.json";
import Select from "react-select";
import { Link } from "react-router-dom";

// reactstrap components
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
  Input,
  Table,
  Badge,
  Row,
  UncontrolledTooltip,
} from "reactstrap";
// core components
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import {
  addProduct,
  getAllProducts,
  deleteProduct,
  clearMessage,
} from "../../../../services/productServices/productActions";
import { uploadImage } from "../../../../services/ImageServices/ImageActions";
import { clearErrors } from "../../../../services/errorServices/errorAction";

//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../layouts/Alerts";
import ReactBSAlert from "react-bootstrap-sweetalert";

import ImageUpload from "../../user/adding-user/ImageUpload";

class GlobalProducts extends React.Component {
  constructor(props) {
    super(props);
    // this.onSubmit = this.onSubmit.bind(this);
    this.onChangeCheckboxValue = this.onChangeCheckboxValue.bind(this);
    this.state = {
      //product
      country_code: "",
      title: "",
      productImg: "",
      alt_pic: "",
      active: true,
      CountriesDataa: [],
      //img default
      imgSrc: null,
      //input for test validation
      validation: {
        title: true,
        alt_pic: true,
        productImg: true,
        country_code: true,
      },
      permission: {},
      //alert
      alert: null,
      image: {},
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
      if (nextProps.products.message) {
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
          country_code: "",
          title: "",
          productImg: "",
          alt_pic: "",
          active: false,
        });
      }
    }
    //To receive user permission
    if (nextProps.permission) {
      console.log("permission ", nextProps.permission);
      this.setState({ permission: nextProps.permission });
    }
  }
  //getting existing product from db
  componentWillMount() {
    this.props.getAllProducts();

    //Insert Selector Data
    const SelectDataForm = [];
    const CountryData = [...CountriesData];
    CountryData.map((country) => {
      //country code and country name mapping to id: text:
      return SelectDataForm.push({
        value: country.code,
        label: country.name + " (" + country.code + ")",
      });
    });
    this.setState({ CountriesDataa: SelectDataForm });
  }

  // to get checkbox value : Active product
  onChangeCheckboxValue = (e) => {
    const value =
      e.target.name === "active" ? e.target.checked : e.target.value;
    this.setState({ active: value });
  };
  //to get simple input value
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    let target = e.target.name;
    //change input validation
    this.state.validation[target] = true;
  };

  //onSubmit(e)
  onClickAdd(e) {
    e.preventDefault();
    // product to add
    let product = {
      country_code: this.state.country_code,
      title: this.state.title,
      productImg: `products/${this.state.country_code}/${this.state.productImg.name}`,
      alt_pic: this.state.alt_pic,
      active: this.state.active,
    };
    //picture to add
    const formData = new FormData();
    const productImgState = this.state.productImg;
    if (productImgState) {
      productImgState.productDIR = "dirProduct";
      formData.append("img", productImgState);
      //adding picture
      this.props.uploadImage(formData, `products$${this.state.country_code}`);
    }
    //adding product
    this.props.addProduct(product);
  }
  //Question Alert when deleting product
  questionAlert = (e, id) => {
    this.setState({
      alert: (
        <ReactBSAlert
          custom
          style={{ display: "block", marginTop: "-100px" }}
          title="Would you like to remove this product?  "
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
            this.props.deleteProduct(id);
            //hiding the alert
            this.hideAlert();
            //showing success notification
            this.refs.notify.notificationAlert(
              NotificationAlertOptions(
                "success",
                "Success",
                "Product Deleted with success"
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

  //OnChange Select Country Handler
  SelectInputHandler = (selectedOptions) => {
    const countrycodeState = selectedOptions;
    this.setState({ country_code: countrycodeState.value });
    //set validation to true
    this.state.validation["country_code"] = true;
  };
  //getting the image selected
  ImageUploadRecievedHandler = (img) => {
    this.setState({ productImg: img });
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

        <SimpleHeader name="Global Products" parentName="Products" />
        {/********************  ADDING PRODUCT *********************/}
        <Container className="mt--6" fluid>
            <Card>
              <CardHeader>
                <h3 className="mb-0">Ajout Produit</h3>
              </CardHeader>
              <CardBody>
                <Form
                  role="form"
                  // onSubmit={this.onSubmit}
                >
                  <Row className="text-center">
                    <Col>
                      <ImageUpload
                        ImageUpload={this.ImageUploadRecievedHandler}
                        //  image = {this.state.productImg}
                      ></ImageUpload>
                      {!this.state.validation.productImg ? (
                        <InputGroup className="invalid-feedback">
                          Required State.
                        </InputGroup>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>

                  <FormGroup className="row">
                    <Label
                      className="form-control-label"
                      htmlFor="example-text-input"
                      md="2"
                    >
                      Image Alt 
                    </Label>
                    <Col md="7">
                      <InputGroup className={classnames("input-group-merge")}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-album-2" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="ajouter un texte alternative à l'image"
                          name="alt_pic"
                          type="text"
                          value={this.state.alt_pic}
                          onChange={this.onChange}
                          invalid={!this.state.validation.alt_pic}
                        />
                      </InputGroup>
                      {!this.state.validation.alt_pic ? (
                        <InputGroup className="invalid-feedback">
                          Required State.
                        </InputGroup>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col></Col>
                  </FormGroup>
                  <FormGroup className="row">
                    <Label
                      className="form-control-label"
                      htmlFor="example-select"
                      md="2"
                    >
                      Origine
                    </Label>
                    <Col md="7">
                      <Select
                        //value={this.state.country_code}
                        options={this.state.CountriesDataa}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.SelectInputHandler.bind(this)}
                        invalid={!this.state.validation.country_code}
                      />
                      {!this.state.validation.country_code ? (
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
                      Nom du produit
                    </Label>
                    <Col md="7">
                      <InputGroup className={classnames("input-group-merge")}>
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-box-2" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Inserer le nom du Produit "
                          name="title"
                          type="text"
                          invalid={!this.state.validation.title}
                          value={this.state.title}
                          onChange={this.onChange}
                        />
                      </InputGroup>
                      {!this.state.validation.title ? (
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
                      Active
                    </Label>
                    <Col md="7">
                      <InputGroup className={classnames("input-group-merge")}>
                        <label className="custom-toggle custom-toggle-danger mr-1">
                          <input
                            checked={this.state.active}
                            onChange={this.onChangeCheckboxValue}
                            name="active"
                            type="checkbox"
                          />

                          <span
                            className="custom-toggle-slider rounded-circle"
                            data-label-off="No"
                            data-label-on="Yes"
                          />
                        </label>
                      </InputGroup>
                    </Col>
                  </FormGroup>
                  <FormGroup className="row">
                    <Col md="10">
                      <Col className="text-right">
                        <Button
                          className="my-4"
                          color="primary"
                          type="submit"
                          onClick={this.onClickAdd.bind(this)}
                        >
                          Ajouter
                        </Button>
                      </Col>
                    </Col>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
         

          {/********************  ALL PRODUCTS  *********************/}

          <Card>
            <CardHeader>
              <h3 className="mb-0">Tous les Produits</h3>
            </CardHeader>
            <CardBody>
              <Table
                className="align-items-center table-flush"
                responsive
                striped
              >
                <thead className="thead-light">
                  <tr>
                    <th>Origine </th>
                    <th>Nom</th>
                    <th>Image</th>
                    <th>Image_alt</th>
                    <th>Etat</th>

                    
                      <th>Actions</th>
                   

                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.props.products.products.map((element) => (
                    <Fragment key={element._id}>
                      <tr>
                        <td>
                          <span className="text-muted">
                            {" "}
                            {element.country_code}
                          </span>
                        </td>
                        <td>
                          <a
                            className="font-weight-bold"
                            href="#pablo"
                            onClick={(e) => e.preventDefault()}
                          >
                            {element.title}
                          </a>
                        </td>
                        <td className="table-user">
                          <img
                            alt={element.alt_pic}
                            className="avatar rounded-circle mr-3"
                            src={
                              process.env.PUBLIC_URL +
                              "/Images/" +
                              element.productImg
                            }
                          />
                        </td>
                        <td>
                          <span className="text-muted"> {element.alt_pic}</span>
                        </td>
                        <td>
                          <span className="text-muted">
                            {" "}
                            {element.active ? (
                              <>
                                <Badge color="" className="badge-dot mr-4">
                                  <i className="bg-success" />
                                  <span className="status">Active</span>
                                </Badge>
                              </>
                            ) : (
                              <Badge color="" className="badge-dot mr-4">
                                <i className="bg-danger" />
                                <span className="status">Not Active</span>
                              </Badge>
                            )}
                          </span>
                        </td>
                        
                          <td className="table-actions">
                            <UncontrolledTooltip
                              delay={0}
                              trigger="hover focus"
                              target={`tooltip${element._id}`}
                            >
                              Supprimer
                            </UncontrolledTooltip>
                            <UncontrolledTooltip
                              delay={0}
                              trigger="hover focus"
                              target={`tooltip1${element._id}`}
                            >
                              Modifier
                            </UncontrolledTooltip>
                            <Button
                              className="mr-4"
                              color="danger"
                              onClick={(e) =>
                                this.questionAlert(e, element._id)
                              }
                              size="sm"
                              id={`tooltip${element._id}`}
                            >
                              <i className="fas fa-trash" />
                            </Button>
                            <Button
                              className="mr-4"
                              color="primary"
                              to={`/admin/update-product/${element._id}`}
                              size="sm"
                              tag={Link}
                              id={`tooltip1${element._id}`}
                            >
                              <i className="ni ni-ungroup" />
                            </Button>
                          </td>
                      
                      </tr>
                    </Fragment>
                  ))}
                </tbody>
              </Table>
            </CardBody>
          </Card>
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
  addProduct,
  getAllProducts,
  deleteProduct,
  uploadImage,
  clearMessage,
  clearErrors,
})(GlobalProducts);
