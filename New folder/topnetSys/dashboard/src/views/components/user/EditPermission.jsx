import React, { Component } from "react";
import CountriesData from "../../../utils/CountryData/CountriesData.json";
import { saveUser,editPermission } from "../../../services/userServices/userActions";
import Select from "react-select";
import axios from "axios";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Form,
  FormGroup,
  Col,
  Label,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Media,
} from "reactstrap";

// nodejs library that concatenates classes
import classnames from "classnames";
// core components
import SimpleHeader from "../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
class EditPermission extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usertoUpdate: {},
      user: {},
      notfound: null,
      countrycode: [],
      CountriesDataa: [],
      redirect:null
    };
    this.UpdatePermissionHandler = this.UpdatePermissionHandler.bind(this);
  }
 async UpdatePermissionHandler  (event) {
  event.preventDefault();
  let data = {
    _id:this.state.usertoUpdate._id,
    countrycode:this.state.user.countrycode,
    permission:this.state.user.permission
  }
    await this.props.editPermission(data);
    this.setState({redirect:"/admin/users"})
  }
  //OnChange Select Country Handler
  SelectInputHandler = (selectedOptions) => {
    const countrycodeState = selectedOptions;

    this.setState(
      { countrycode: countrycodeState },
      () =>{
        this.storeUserTypeInformation();
      }
    );
  };
  // Store User type information in the redux
  storeUserTypeInformation() {
    var CountriesCodeSelectedList = [];
    if (this.state.countrycode !== null) {
      CountriesCodeSelectedList = this.state.countrycode.map((country) => {
        return country.value;
      }); // ['TN','FR']
    }
    const OnlypermissionsForCountrySelected = this.state.user.permission.filter(
      (e) => {
        return CountriesCodeSelectedList.includes(e.CountryCode);
      }
    );
    this.props.saveUser({
      name: this.state.user.name,
      email: this.state.user.email,
      countrycode: this.state.countrycode,
      role: this.state.user.role,
      enabled: this.state.user.enabled,
      avatar: this.state.user.avatar,
      permission: OnlypermissionsForCountrySelected,
    });
  }

  componentWillMount() {
    axios
      .get(`/api/users/${this.props.match.params.id}`)
      .then((res) => {
        this.setState({
          user:res.data,
          usertoUpdate: res.data,
          countrycode: res.data.countrycode,
        },()=> {this.storeUserTypeInformation()});
      })
      .catch((err) => this.setState({ notfound: true }));



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
     //To Get data from the reducer 
     componentWillReceiveProps(nextProps){
      if (nextProps.users)
      {
        this.setState({ user: nextProps.users})
       
      }
    }
  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
  
    return (
      <>
        <SimpleHeader name="Update Permission" parentName="Users" />
        <Container className="mt--6" fluid>
          <Card>
            <CardHeader className="text-center">
            <Media className="align-items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img alt="..." src={process.env.PUBLIC_URL+"/Images/"+this.state.usertoUpdate.avatar} />
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {this.state.usertoUpdate.name}
                        </span>
                      </Media>
              </Media>
              <h3 className="mb-0">
                Edit {this.state.usertoUpdate.name} permission
              </h3>
            </CardHeader>
            <CardBody className="text-center">
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
              <button
                className="btn btn-outline-primary mr-1 float-right"
                type="submit"
                onClick={this.UpdatePermissionHandler}
              >
                Finish Updating
              </button>
              <Link
                to="/admin/users"
                className="btn btn-outline-default mr-1 float-left"
              >
                Back To Users
              </Link>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

// Connect the redux store
export default connect((state) => ({ users: state.users.register_user }), {
  saveUser,editPermission
})(EditPermission);
