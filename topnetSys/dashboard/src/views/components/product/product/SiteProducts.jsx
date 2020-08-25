import React, { Fragment } from "react";
import { Link } from "react-router-dom";
// reactstrap components
import {
  Row,
  Button,
  Card,
  Container,
  Col,
  CardImg,
  ListGroupItem,
  ListGroup,
} from "reactstrap";

// core components
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import { getProductsByCountryCode } from "../../../../services/productServices/productActions";

class SiteProducts extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      products: [],
      permission:{}
    };
  }
  componentWillMount() {
    //get product of the current site coutry code
    this.props.getProductsByCountryCode();
  }
  componentWillReceiveProps(nextProps) {
    //receiving products
    if (nextProps.products) {
      this.setState({ products: nextProps.products.products_country_code });
    }
    //To receive user permission
    if (nextProps.permission) {
      console.log("permission ", nextProps.permission);
      this.setState({ permission: nextProps.permission });
    }
  }
  onSubmit(e) {}

  render() {
    return (
      <>
        <SimpleHeader name="Site Products" parentName="Products" />
        <Container className="mt--6" fluid>
          <Row className="card-wrapper">
            {this.state.products.map((element) => (
              <Fragment key={element._id}>
                <Col lg="3" xs="6">
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
                        <b> Title </b> {element.title}
                      </ListGroupItem>
                      <ListGroupItem>
                        {" "}
                        <b> Active </b>{" "}
                        {element.active ? (
                          <i className="fas fa-check text-success" />
                        ) : (
                          <i className="ni ni-fat-remove text-warning" />
                        )}
                      </ListGroupItem>
                     
                        <ListGroupItem className="text-center">
                          {" "}
                          <Button
                            color="primary"
                            to={`/admin/productproperties/${element._id}`}
                            tag={Link}
                          >
                            Edit properties
                          </Button>
                        </ListGroupItem>
                     
                    </ListGroup>
                  </Card>
                </Col>
              </Fragment>
            ))}
          </Row>
        </Container>
      </>
    );
  }
}

export default connect(
  (state) => ({
    products: state.products,
    permission: state.auth.current_permission,
  }),
  {
    getProductsByCountryCode,
  }
)(SiteProducts);
