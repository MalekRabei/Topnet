import React from "react";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// reactstrap components
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  ListGroupItem,
  ListGroup,
  Media,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Container,
  Row,
  Col,
  NavbarBrand,
} from "reactstrap";

import { connect } from "react-redux";
import {
  logoutUser,
  getProfile,
  clearCurrentProfile,
  setCurrentPermission,
} from "../../services/userServices/authActions";
import { Redirect } from "react-router";

class AdminNavbar extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      avatar: "",
      redirect: null,
      permissiontitle: "",
    };
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
    this.setState({ name: "", avatar: "", redirect: "/auth/login" });
  }
  onProfileClick(e) {
    console.log("click profile");
    e.preventDefault();
    //this.props.getProfile();

    window.location.href = "/admin/profile";
  }
  componentWillReceiveProps(nextProps) {
    if (!nextProps.auth.isAuthenticated) {
      this.props.history.push("/auth/login");
    }

    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
      console.log(nextProps.errors);
    }

    if (nextProps.auth.current_permission)
    {
      localStorage.setItem("permission", JSON.stringify( nextProps.auth.current_permission));
    }
  }
  preparePermissionTitle = (permission) => {
    console.log("preparePermissionTitle");
    let permissiontitle = "";
    if (permission.publish) {
      permissiontitle = "Read & Edit & Publish";
    } else {
      if (permission.edit) {
        permissiontitle = "Read & Edit";
      } else {
        permissiontitle = "Read Only";
      }
    }
    return permissiontitle;
  };
  // function that on mobile devices makes the search open
  openSearch = () => {
    document.body.classList.add("g-navbar-search-showing");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-showing");
      document.body.classList.add("g-navbar-search-show");
    }, 150);
    setTimeout(function () {
      document.body.classList.add("g-navbar-search-shown");
    }, 300);
  };
  // function that on mobile devices makes the search close
  closeSearch = () => {
    document.body.classList.remove("g-navbar-search-shown");
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-show");
      document.body.classList.add("g-navbar-search-hiding");
    }, 150);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hiding");
      document.body.classList.add("g-navbar-search-hidden");
    }, 300);
    setTimeout(function () {
      document.body.classList.remove("g-navbar-search-hidden");
    }, 500);
  };
  componentWillMount() {
    this.setState({
      name: this.props.auth.userconnected.user.name,
      avatar: this.props.auth.userconnected.user.avatar,
    });
  }
  render() {
    console.log("ADMIN NAVBAR", this.state);
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
    return (
      <>
        <Navbar
          className={classnames(
            "navbar-top navbar-expand border-bottom",
            { "navbar-dark bg-info": this.props.theme === "dark" },
            { "navbar-light bg-secondary": this.props.theme === "light" }
          )}
        >
          <Container fluid>
            <Collapse navbar isOpen={true}>
              <Form
                className={classnames(
                  "navbar-search form-inline mr-sm-3",
                  { "navbar-search-light": this.props.theme === "dark" },
                  { "navbar-search-dark": this.props.theme === "light" }
                )}
              ></Form>
              <Nav className="align-items-center ml-auto ml-md-0" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center ml--5">
                      <span>
                        <img
                          height="20"
                          width="175"
                          alt="..."
                          src={require("../../assets/img/brand/logo.png")}
                        />
                      </span>
                    </Media>
                  </DropdownToggle>
                </UncontrolledDropdown>
              </Nav>

              <Nav className="align-items-center ml-md-auto" navbar>
                <NavItem className="d-xl-none">
                  <div
                    className={classnames(
                      "pr-3 sidenav-toggler",
                      { active: this.props.sidenavOpen },
                      { "sidenav-toggler-dark": this.props.theme === "dark" }
                    )}
                    onClick={this.props.toggleSidenav}
                  >
                    <div className="sidenav-toggler-inner">
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                      <i className="sidenav-toggler-line" />
                    </div>
                  </div>
                </NavItem>
                <NavItem className="d-sm-none">
                  <NavLink onClick={this.openSearch}>
                    <i className="ni ni-zoom-split-in" />
                  </NavLink>
                </NavItem>
              </Nav>
              <Nav className="align-items-center ml-auto ml-md-0" navbar>
                <UncontrolledDropdown nav>
                  <DropdownToggle className="nav-link pr-0" color="" tag="a">
                    <Media className="align-items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={
                            process.env.PUBLIC_URL +
                            "/Images/" +
                            this.state.avatar
                          }
                        />
                      </span>
                      <Media className="ml-2 d-none d-lg-block">
                        <span className="mb-0 text-sm font-weight-bold">
                          {this.state.name}
                        </span>
                        <br />
                        <span className="mb-0 text-sm font-weight-bold">
                          {this.state.permissiontitle}
                        </span>
                      </Media>
                    </Media>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={this.onProfileClick.bind(this)}
                    >
                      <i className="ni ni-single-02" />
                      <span>My profile</span>
                    </DropdownItem>

                    <DropdownItem divider />
                    <DropdownItem onClick={this.onLogoutClick.bind(this)}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem
                      onClick={(e) =>
                        this.setState({ redirect: "/admin/index" })
                      }
                    >
                      <i className="ni ni-user-run" />
                      <span>Back to dashboard</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}
AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: "dark",
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"]),
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  getProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,

});

export default connect(mapStateToProps, {
  logoutUser,
  clearCurrentProfile,
  getProfile,
  setCurrentPermission,
})(AdminNavbar);
