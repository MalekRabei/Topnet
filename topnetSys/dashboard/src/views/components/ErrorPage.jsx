/*!

=========================================================
* Argon Design System React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-design-system-react/blob/master/LICENSE.md)

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
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Badge,
  Row,
  Col
} from "reactstrap";

   /**
  
*****Content variables : 

**contentRequired :
{this.state.preTitle}
{this.state.backHomeLink.link} Link
**contentOptional :
*****Setting variables : Design variables 

**settingsRequired : 


**settingsOptional :
 */
class ErrorPage extends React.Component {
  constructor(props){
    super(props);
    this.state= {

    }
  }
  componentWillMount(){
    /*this.props.pageContent.map((object) => {
      const variable = object["variable"];
      const value = object["value"];
      return this.setState({ [variable]: value });
    });
    if (this.props.CurrentSite !== undefined) {
      this.props.CurrentSite.settings_variables.map((object) => {
        const variable = object["variable"];
        const value = object["value"];
        return this.setState({ [variable]: value });
      });
    }*/
  }

  componentDidMount() {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    this.refs.main.scrollTop = 0;
  }
  render() {
    return (
      <>
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
                    src={require('../../assets/img/error.png')}  />
                 
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
      </>
    );
  }
}

export default ErrorPage;
