import React, { Component } from "react";
import NotificationAlert from "react-notification-alert";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardImg,
  Badge,
  Collapse,
  ListGroup,
  ListGroupItem,
  Label,
  ListGroupItemHeading,
  ListGroupItemText,
  Pagination,
  PaginationItem,
  PaginationLink,
  CardBody,
  CardTitle,
  Table,
  UncontrolledTooltip,
} from "reactstrap";


class CommitHistory extends Component {
  constructor(props) {
    super(props);
    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);
    this.state = {
      history: [],
    };
  }
  componentDidMount() {
    this.fetchPages();
  }

  fetchPages() {
    axios
      .get(`${this.server}/api/pages/history`)
      .then((response) => {
        this.setState({ history: response.data });
      })
      .catch((err) => {
        console.log(err.response);
      });
  }

  render() {
    console.log("Pending PAGES", this.state.history);
    return (
      <>
        <CardBody>
          <div
            className="timeline timeline-one-side"
            data-timeline-axis-style="dashed"
            data-timeline-content="axis"
          >
         
                <div className="timeline-block">
                  <span className="timeline-step badge-success">
                    <i className="ni ni-bell-55" />
                  </span>
                  <div className="timeline-content">
                    <small className="text-muted font-weight-bold">
                      date
                    </small>
                    <h5 className="mt-3 mb-0">Malek</h5>
                    <p className="text-sm mt-1 mb-0">
                      {" "}
                      <b> Contrat Client : matricule</b> <br />
                       date creation {" "}
                      
                      <br />
                      à jour le {" "}
                      Date mise à jour
                    </p>
                    <div className="mt-3">
                      <Badge color="success" pill>
                        Validé
                      </Badge>
                    </div>
                  </div>
                </div>
 
          </div>
        </CardBody>
      </>
    );
  }
}

CommitHistory.propTypes = {
  getHistory: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  
});

// Connect the redux store
export default connect(mapStateToProps, {  })(CommitHistory);
