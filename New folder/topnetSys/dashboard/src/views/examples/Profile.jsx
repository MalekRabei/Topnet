/*!

=========================================================
* Argon Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardImg,
  CardTitle,
  FormGroup,
  Form,
  Input,
  ListGroupItem,
  ListGroup,
  Progress,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import ProfileHeader from "../../components/Headers/ProfileHeader.jsx";
import {
  createProfile,
  getCurrentProfile,
} from "../../services/userServices/profileAction";
import { connect } from "react-redux";
import classnames from "classnames";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import isEmpty from "../../validation/is-empty";
import PasswordModalLayout from "../../layouts/PasswordModalLayout";
import { uploadImage } from "../../services/ImageServices/ImageActions";
import ImageUpload from "../components/user/adding-user/ImageUpload";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      cin:"",
      telephone:"",
      adresse:"",
      role: "",
      countrycode: "",
      avatar: "",
      enabled: "",
      image: {},
      errors: {},
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  ImageUploadRecievedHandler = (img) => {
    this.setState({ image: img });
  };

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;
      console.log(nextProps.profile.profile);

      // If profile field doesnt exist, make empty string
      profile.name = !isEmpty(profile.name) ? profile.name : "";
      profile.email = !isEmpty(profile.email) ? profile.email : "";
      profile.role = !isEmpty(profile.role) ? profile.role : "";
      profile.avatar = !isEmpty(profile.avatar) ? profile.avatar : "";

      // Set component fields state
      this.setState({
        name: profile.name,
        email: profile.email,
        cin:profile.cin,
        adresse:profile.adresse,
        telephone:profile.telephone,
        role: profile.role,
        avatar: profile.avatar,
      });
      console.log(this.state);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.image.name !== undefined) {
      /* if user avatar selected */
      let path_to_upload = "users$avatar"; // $ /
      let imageName = this.state.image.name.toLowerCase().split(" ").join("-");
      this.state.avatar =
        path_to_upload.toLowerCase().split("$").join("/") + "/" + imageName;
      const formData = new FormData();
      formData.append("img", this.state.image);

      this.props.uploadImage(formData, path_to_upload);
    }
    const profileData = {
      name: this.state.name,
      email: this.state.email,
      cin: this.state.cin,
      adresse: this.state.adresse,
      telephone: this.state.telephone,
      role: this.state.role,
      avatar: this.state.avatar,
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    console.log(this.state)
    return (
      <>
        <ProfileHeader />
        <Container className="mt--6" fluid>
          <Row>
            <Col className="order-xl-2" xl="4">
              <Card className="card-profile">
                <CardImg
                  alt="..."
                  src={require("../../assets/img/theme/img-1-1000x600.jpg")}
                  top
                />
                <Row className="justify-content-center">
                  <Col className="order-lg-2" lg="3">
                    <div className="card-profile-image">
                      <a href="#pablo" onClick={(e) => e.preventDefault()}>
                        <img
                          alt="..."
                          className="rounded-circle"
                          src={
                            process.env.PUBLIC_URL +
                            "/Images/" +
                            this.state.avatar
                          }
                        />
                      </a>
                    </div>
                  </Col>
                </Row>
                <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4"></CardHeader>
                <CardBody className="pt-0">
                  <div className="text-center">
                    <h5 className="h3"></h5>
                    <div className="h5 font-weight-300">
                      <i className="ni location_pin mr-2" />
                      <h5 className="h3"> {this.state.name}</h5>,{" "}
                      {this.state.role}
                    </div>
                    <div className="h5 mt-4">
                      <i className="ni business_briefcase-24 mr-2" />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col className="order-xl-1" xl="8">
              <Card>
                <CardHeader>
                  <Row className="align-items-center">
                    <Col xs="8">
                      <h3 className="mb-0">Edit profile</h3>
                    </Col>
                    <Col className="text-right" xs="4">
                      <PasswordModalLayout
                        isOpen={true} /* {this.state.show} */
                      ></PasswordModalLayout>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Form onSubmit={this.onSubmit}>
                    <h6 className="heading-small text-muted mb-4">
                      User information
                    </h6>
                    <div className="pl-lg-4">
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              Username
                            </label>
                            <Input
                              id="input-username"
                              placeholder="Username"
                              type="text"
                              value={this.state.name}
                              onChange={this.onChange}
                              disabled
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Email address
                            </label>
                            <Input
                              id="input-email"
                              placeholder="jesse@example.com"
                              name="email"
                              type="email"
                              value={this.state.email}
                              onChange={this.onChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-first-name"
                            >
                              Full name
                            </label>
                            <Input
                              id="input-first-name"
                              placeholder="First name"
                              name="name"
                              type="text"
                              className={classnames("form-control mt-2", {
                                "is-invalid": errors.name,
                              })}
                              value={this.state.name}
                              onChange={this.onChange}
                            />
                            {errors.name && (
                              <div className="invalid-feedback">
                                {errors.name}
                              </div>
                            )}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-username"
                            >
                              CIN
                            </label>
                            <Input
                              id="input-username"
                              placeholder="cin"
                              type="text"
                              value={this.state.cin}
                              onChange={this.onChange}
                             
                            />
                          </FormGroup>
                        </Col>
                        <Col lg="6">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Telephone
                            </label>
                            <Input
                              id="input-email"
                              placeholder="jesse@example.com"
                              name="telephone"
                              type="number"
                              value={this.state.telephone}
                              onChange={this.onChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                      <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-email"
                            >
                              Adresse
                            </label>
                            <Input
                              id="input-email"
                              placeholder="jesse@example.com"
                              name="telephone"
                              type="number"
                              value={this.state.adresse}
                              onChange={this.onChange}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      
                      <Row>
                        <Col lg="12">
                          <FormGroup>
                            <label
                              className="form-control-label"
                              htmlFor="input-country"
                            >
                              {" "}
                              Avatar
                            </label>
                            <ImageUpload
                              ImageUpload={this.ImageUploadRecievedHandler}
                              image={this.state.avatar}
                            ></ImageUpload>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>
                  </Form>
                  <hr className="my-4" />

                  <Button color="primary" onClick={this.onSubmit}>
                    Edit
                  </Button>

                  <Link to="admin/users" className="btn btn-default ">
                    Cancel
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
Profile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});
export default connect(mapStateToProps, {
  createProfile,
  getCurrentProfile,
  uploadImage,
})(withRouter(Profile));
