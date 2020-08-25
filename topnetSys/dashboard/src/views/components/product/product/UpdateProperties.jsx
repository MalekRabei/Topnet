import React from "react";
// reactstrap components
import { Container, Row, Col } from "reactstrap";
// core components
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import {
  getProductProperties,
  addProductProperties,
  getProductById,
} from "../../../../services/productServices/productActions";
import UpdateProductProperties from "./productProperties/UpdateProductProperties";
import AddProductProperties from "./productProperties/AddProductProperties";

class UpdateProperties extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      idProduct: this.props.match.params,
      nb_propperties: -1,
      product: {},
    };
  }
  componentWillMount() {
    //to get product properties
    this.props.getProductProperties(this.state.idProduct);
    //to get selected product
    this.props.getProductById(this.state.idProduct);
  }
  componentWillReceiveProps(nextProps) {
    //verif selected product
    if (nextProps.product_byId) {
      this.setState({ product: nextProps.product_byId });
    }

    //verif product properties
    if (nextProps.productProperties) {
      //verify the existance of product properties
      if (JSON.stringify(nextProps.productProperties) !== "{}") {
        this.setState({ nb_propperties: 1 });
      } else {
        this.setState({ nb_propperties: 0 });
      }
    } else {
      this.setState({ nb_propperties: 0 });
    }
  }

  render() {
    return (
      <>
        <SimpleHeader name="Add Product Properties" parentName="Product" />{" "}
        <Container className="mt--6" fluid>
          {this.state.nb_propperties === 0 ? (
            <AddProductProperties
              title={this.state.product.title}
              idProduct={this.state.idProduct}
            ></AddProductProperties>
          ) : (
            ""
          )}
          {/****** UPDATE PROPERTIES FORM  *********/}
          {this.state.nb_propperties === 1 ? (
            <Row>
              <Col>
                <UpdateProductProperties
                  idProduct={this.state.idProduct}
                  title={this.state.product.title}
                ></UpdateProductProperties>
              </Col>
            </Row>
          ) : (
            ""
          )}
        </Container>
      </>
    );
  }
}

export default connect(
  (state) => ({
    productProperties: state.products.productproperties,
    properties: state.products.properties,
    product_byId: state.products.product_byId,
  }),
  {
    getProductProperties,
    addProductProperties,
    getProductById,
  }
)(UpdateProperties);
