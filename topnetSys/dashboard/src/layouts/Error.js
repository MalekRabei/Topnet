/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// reactstrap components
import { Container, Row, Col } from "reactstrap";

// core components
import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/AuthFooter.js";

import getRoutesArray from "../routes.js";

class Error extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      routes:[]
    }
  }
  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillMount(){
    let routes = getRoutesArray(localStorage);
    this.setState({routes:routes});
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.layout === "/error") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <>
        <div className="main-content">
        <main ref="main">
          <section className="section section-shaped section-lg">
            <div className="shape shape-style-1 bg-gradient-default">
              <span />
              <span />
              <span />
              <span />
             
              <span />
              <span />
              <span />
              <span />
              <br/>
                  <br/>
                  <br/>
                 
            </div>
    <h4 style={{"color" : "white"}} className="text-center">404</h4>
            <Container className="pt-lg-7">
           
              <Row className="justify-content-center">
                <Col lg="8">
                <Container>
              <Row className="row-grid align-items-center">
                <Col >
                  <img
                    alt="..."
                    className="img-fluid floating"
                    style={{"height" : "400px", "width" : "600px"}}
                    src={require('../assets/img/error.png')}  />
                 
                </Col>
           
              </Row>
             
            </Container>
           
                    
           
            
                  <Row className="mt-3">
                    <Col md={{size:6 ,offset:3}}>
                      <a
                        className="text-white text-center"
                        href="/admin/index"
                        
                      >
                        <h4 className="text-white">Retour</h4>
                      </a>
                    </Col>
                   
                  </Row>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                </Col>
              </Row>
            </Container>
          </section>
        </main>
          
         {/* Page content */}
          <Container className="mt--8 pb-5">
            <Row className="justify-content-center">
              <Switch>
                {this.getRoutes(this.state.routes)}
                <Redirect from="*" to="/404" />
              </Switch>
            </Row>
          </Container>
        </div>
        <AuthFooter />
      </>
    );
  }
}

export default Error;
