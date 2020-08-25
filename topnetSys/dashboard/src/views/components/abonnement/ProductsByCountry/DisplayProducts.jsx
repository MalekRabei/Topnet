import React, { Component,Fragment } from "react";
import { Link } from "react-router-dom";

import Select from "react-select";
// nodejs library that concatenates classes
import axios from "axios";
import classnames from "classnames";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Label,
  Container,
  CardImg,
  ListGroupItem,
  ListGroup,
} from "reactstrap";
import { getAllProducts } from "../../../../services/productServices/productActions";

//Website Permission Form
class DisplayProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      selectedProducts:[],
      permission: {},
      err: [],
    };
  }
  SelectProduct = (e) => {
    const clientProduct = e.target.value;
    const prods = [];
    prods.push(clientProduct);
    this.setState({  selectedProducts: prods });

  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.products.products) {
      const products = nextProps.products.products;
      this.setState({ products: products });
    }

  }
  componentWillMount() {
    //get product of the current site coutry code
    this.props.getAllProducts();
  }



  //select products of country
  render() {
    console.log("Products",this.state.products)
    console.log("selected", this.state.selectedProducts)
    let productsRenderForm = null;
   
        productsRenderForm = this.state.products.map((element) => {
            return (
              <Fragment key={element._id}>
              <Col lg="2" xs="4">
                <Card>
                

              
                  <CardImg
                    alt="..."
                    src={
                      process.env.PUBLIC_URL + "/Images/" + element.productImg
                    }
                    top
                  />
                  <ListGroup flush>
                    <ListGroupItem>
                      {" "}
                      <b> {element.title} </b> 
                    </ListGroupItem>
                      
                  
                  </ListGroup>
                </Card>
              </Col>
            </Fragment>
          
            );
          });

    return (
      <Row>
        <Col>
          <Card className="bg-gradient-white">
          <CardHeader className="text-center">   
                 <h4 className="mb-0">
                  Available products on this websites
                  </h4>
           </CardHeader>
            <CardBody>
              <CardTitle tag="h3">{this.props.name}</CardTitle>
              <Row className="row-example">{productsRenderForm}</Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}


const mapStateToProps = (state) => ({
    products: state.products,
    permission: state.auth.current_permission,
});

export default connect(mapStateToProps,{ getAllProducts,
})(DisplayProducts);
