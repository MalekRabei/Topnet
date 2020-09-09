import React from "react";
// react library for routing
import { Link } from "react-router-dom";
// reactstrap components
import {
  UncontrolledCollapse,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  DropdownItem,
  Media,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import PasswordModalLayout from "../../layouts/PasswordModalLayout";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  verifPassord,
  logoutUser,
  getProfile,
  clearCurrentProfile,
} from "../../services/userServices/authActions";
import { Redirect } from "react-router-dom";

class AuthNavbar extends React.Component {
  state = {
    show: false,
    redirect: null,
  };

  constructor() {
    super();
    this.state = {
      name: "",
      avatar: "",
    };
  }
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
    this.setState({ name: "", avatar: "", redirect: '/auth/login' });
  }
  onProfileClick(e) {
    console.log("click profile");
    e.preventDefault();
    //this.props.getProfile();

    window.location.href = "/admin/profile";
  }
 
  componentDidMount()
  {
    this.setState({
    name: this.props.auth.userconnected.user.name,
    avatar: this.props.auth.userconnected.user.avatar,
  });
  }
  //To Get data from the reducer 
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      console.log(nextProps.errors);
    }
   
    
  }
 
  render() {
    console.log("user name render ", this.state.name);

    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
        <Navbar
          className="navbar-horizontal navbar-main navbar-dark navbar-transparent"
          expand="lg"
          id="navbar-main"
        >
          <Container>
            <NavbarBrand to="/" tag={Link}>
              <img
                alt="..."
                src={require("../../assets/img/brand/logo.png")}
              />
            </NavbarBrand>
            <button
              aria-controls="navbar-collapse"
              aria-expanded={false}
              aria-label="Toggle navigation"
              className="navbar-toggler"
              data-target="#navbar-collapse"
              data-toggle="collapse"
              id="navbar-collapse"
              type="button"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <UncontrolledCollapse
              className="navbar-custom-collapse"
              navbar
              toggler="#navbar-collapse"
            >
              <div className="navbar-collapse-header">
                <Row>
                  <Col className="collapse-brand" xs="6">
                    <Link to="/admin/dashboard">
                      <img
                        alt="..."
                        src={require("../../assets/img/brand/logo.png")}
                      />
                    </Link>
                  </Col>
                  <Col className="collapse-close" xs="6">
                    <button
                      aria-controls="navbar-collapse"
                      aria-expanded={false}
                      aria-label="Toggle navigation"
                      className="navbar-toggler"
                      data-target="#navbar-collapse"
                      data-toggle="collapse"
                      id="navbar-collapse"
                      type="button"
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>
              <Nav className="align-items-center ml-auto ml-md-0 " navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img alt="..." src={process.env.PUBLIC_URL+"/Images/"+this.state.avatar} />
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {this.state.name}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      href="#pablo"
                      onClick={this.onLogoutClick.bind(this)}
                    >
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
              <hr className="d-lg-none" />
            </UncontrolledCollapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

AuthNavbar.propTypes = {
  verifPassord: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getProfile: PropTypes.func.isRequired,
  // newPass : PropTypes.string
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  verifPassord,
  logoutUser,
  clearCurrentProfile,
  getProfile,
})(AuthNavbar);
