import React, { Component, Fragment } from "react";
import classnames from "classnames";
import Select from "react-select";

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
} from "reactstrap";

// core components
import { Link } from "react-router-dom";
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import CountriesData from "../../../../utils/CountryData/CountriesData.json";
import ImageUpload from "../../user/adding-user/ImageUpload";
import { connect } from "react-redux";
import {
  getProductById,
  updateProduct,
  clearMessage,
} from "../../../../services/productServices/productActions";
import { uploadImage } from "../../../../services/ImageServices/ImageActions";
import { clearErrors } from "../../../../services/errorServices/errorAction";

//notifications imports
import NotificationAlert from "react-notification-alert";
import NotificationAlertOptions from "../../../../layouts/Alerts";

class UpdateProduct extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.match.params,
      product: {},
      CountriesDataa: [],
      title: "",
      productImg: "",
      alt_pic: "",
      active: "",
      country_code: "",
      //input for test validation
      validation: {
        title: true,
        alt_pic: true,
        productImg: true,
        country_code: true,
      },
    };
  }
  componentWillMount() {
    this.props.getProductById(this.state.id.id);
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
  componentWillReceiveProps(nextProps) {
    //receive current product & set product state
    if (nextProps.product) {
      this.setState({
        product: nextProps.product,
        title: nextProps.product.title,
        productImg: nextProps.product.productImg,
        alt_pic: nextProps.product.alt_pic,
        active: nextProps.product.active,
        country_code: nextProps.product.country_code,
      });
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
    //product added => get success message
    if (nextProps.products.message) {
      if (nextProps.products.message !==  "") {
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
        //initial state
        this.setState({
          country_code: "",
          title: "",
          productImg: "",
          alt_pic: "",
          active: false,
        });
      }
    }
  }

  //OnChange Select Country Handler
  SelectInputHandler = (selectedOptions) => {
    const countrycodeState = selectedOptions;
    this.setState({ country_code: countrycodeState.value });
  };
  //on change checkbox value : Active producy
  onChangeCheckboxValue = (e) => {
    const value =
      e.target.name === "active" ? e.target.checked : e.target.value;
    this.setState({ active: value });
  };
  //to get simple input value
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onClickUpdate(e) {
    let product = this.state.product;
    product.alt_pic = this.state.alt_pic;
    product.country_code = this.state.country_code;
    product.title = this.state.title;
    product.active = this.state.active;
    if (this.state.productImg.name) {
      const formData = new FormData();
      formData.append("img", this.state.productImg);
      this.props.uploadImage(formData, `products$${this.state.country_code}`);

      //image changed => upload image
      product.productImg = `products/${this.state.country_code}/${this.state.productImg.name}`;
    } else {
      //get old product img
      product.productImg = this.state.productImg;
    }
    //update
    this.props.updateProduct(product);
    e.preventDefault();
  }
  //get image selected
  ImageUploadRecievedHandler = (img) => {
    this.setState({ productImg: img });
  };
  render() {
    console.log(this.state)
    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}
        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>
        <SimpleHeader name="Update Product " parentName="Products " />
        <Container className="mt--6" fluid>
          <Card>
            <CardHeader>
              <h3 className="mb-0">Modifier Produit </h3>
            </CardHeader>
            <CardBody>
              <Form role="form" onSubmit={this.onSubmit}>
                <Row className="text-center">
                  <Col>
                    <ImageUpload
                      ImageUpload={this.ImageUploadRecievedHandler}
                      image={this.state.productImg}
                    ></ImageUpload>
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
                        placeholder="Ajoute un texte alternative à l'image"
                        name="alt_pic"
                        type="text"
                        value={this.state.alt_pic}
                        onChange={this.onChange.bind(this)}
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
                      value={this.state.CountriesDataa.filter(
                        (option) => option.value === this.state.country_code
                      )}
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
                        placeholder="Inserer le nom du Produit"
                        name="title"
                        type="text"
                        value={this.state.title}
                        onChange={this.onChange.bind(this)}
                        invalid={!this.state.validation.title}
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
                          onChange={this.onChangeCheckboxValue.bind(this)}
                          name="active"
                          type="checkbox"
                        />

                        <span
                          className="custom-toggle-slider rounded-circle"
                          data-label-off="Yes"
                          data-label-on="No"
                        />
                      </label>
                    </InputGroup>
                  </Col>
                </FormGroup>

                <FormGroup className="row">
                  <Col md="10" className=" text-right">
                    <Col>
                      <Button
                        className="my-0"
                        color="btn btn-outline-default"
                        to="/admin/globalproducts"
                        tag={Link}
                      >
                        Retour
                      </Button>
                      <Button
                        className="my-4"
                        color="btn btn-outline-primary"
                        type="submit"
                        onClick={this.onClickUpdate.bind(this)}
                      >
                        Modifier
                      </Button>
                    </Col>
                  </Col>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  products: state.products,
  product: state.products.product_byId,
  errors: state.errors,
});
export default connect(mapStateToProps, {
  getProductById,
  uploadImage,
  updateProduct,
  clearMessage,
  clearErrors,
})(UpdateProduct);
