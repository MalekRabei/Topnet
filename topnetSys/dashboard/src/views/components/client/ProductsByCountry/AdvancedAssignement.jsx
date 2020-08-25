import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import CountriesData from "../../../../utils/CountryData/CountriesData.json";
import Select from "react-select";
import { connect } from "react-redux";
import {
  saveUser,
  registerUser,
} from "../../../../services/userServices/userActions";
import { uploadImage } from "../../../../services/ImageServices/ImageActions";
// reactstrap components
import { Col, Label, FormGroup, Form, Button } from "reactstrap";
import DisplayProducts from "./DisplayProducts";
import PropTypes from "prop-types";

class AdvancedPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.users, // Geting data from Redux store
      products : props.products,
      countrycode: [],
      CountriesDataa: [],
      status: true,
      redirect:null
    };
    this.storeInformation = this.storeInformation.bind(this);
  }

  //OnChange Select Country Handler
  SelectInputHandler = (selectedOptions) => {
    const countrycodeState = selectedOptions;

    this.setState(
      { countrycode: countrycodeState },
      function stateUpdateComplete() {
        this.storeInformation();
      }.bind(this)
    );
  };
 
  componentWillMount() {
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

  // Store User type information in the redux
  storeInformation() {
    var CountriesCodeSelectedList = [];
    if (this.state.countrycode !== null) {
      CountriesCodeSelectedList = this.state.countrycode.map((country) => {
        return country.value;
      }); // ['TN','FR']
    }
    const OnlyProductForCountrySelected = this.state.user.permission.filter(
      (e) => {
        return CountriesCodeSelectedList.includes(e.CountryCode);
      }
    );

   /* this.props.saveUser({
      name: this.state.user.name,
      email: this.state.user.email,
      emailverif: this.state.user.emailverif,
      countrycode: this.state.countrycode,
      role: this.state.user.role,
      enabled: this.state.user.enabled,
      avatar: this.state.user.avatar,
      permission: OnlyProductForCountrySelected,
    });*/
  }
  //To Get data from the reducer
  componentWillReceiveProps(nextProps) {
    if (nextProps.products) {
      this.setState({ products: nextProps.products });
    }
  }

  render() {
    /* redirect if form submitted and all form inputs valid  */
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    //render Country form
    let CountriesForm = null;
    if (this.state.countrycode !== null) {
      const CountriesSelected = [...this.state.countrycode];
      CountriesForm = CountriesSelected.map((country) => {
        return (
          <DisplayProducts
            name={country.label}
            value={country.value}
            key={country.value}
          />
        );
      });
    }
    return (
      <>
        <Form>
          <FormGroup className="row">
            <Label
              className="form-control-label"
              htmlFor="example-select"
              md="2"
            >
              Select Country Access
            </Label>
            <Col md="10">
              <Select
                isMulti
                value={this.state.countrycode}
                options={this.state.CountriesDataa}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={this.SelectInputHandler}
              />
            </Col>
          </FormGroup>
        </Form>
        {CountriesForm}
      </>
    );
  }
}

// Connect the redux store
export default connect((state) => ({ users: state.users.register_user }), {
  saveUser,
  registerUser,
  uploadImage,
})(AdvancedPermission);
