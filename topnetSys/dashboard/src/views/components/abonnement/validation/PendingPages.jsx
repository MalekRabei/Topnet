import * as React from "react";
import { Component } from "react";
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
//core


class PendingPages extends Component {
  constructor(props) {
    super(props);
    this.server = process.env.REACT_APP_API_URL || "";
    this.socket = io.connect(this.server);
    this.state = {
      pendingPages: [],
    };
    this.onClick = this.onClick.bind(this);
  }
  componentDidMount() {

  }
  notify = (type) => {
    let options = {
      place: "tc",
      message: (
        <div className="alert-text">
          <span className="alert-title" data-notify="title">
            {" "}
          </span>
          <span data-notify="message">page published successfully !</span>
        </div>
      ),
      type: type,
      icon: "ni ni-bell-55",
      autoDismiss: 7,
    };
    this.refs.notificationAlert.notificationAlert(options);
  };
  
  useEffect(){
    const timer = setTimeout(() => {
      console.log('This will run after 5 second!')
    }, 5000);
    return () => clearTimeout(timer);
  }

  onClick(id) {
    this.props.updatePublishingStatement(id);
        window.location.reload(false);

  }

  render() {
    console.log("Pending PAGES", this.state.pendingPages);
    return (
      <>
        <NotificationAlert ref="notificationAlert" />
        <Col lg="12">
          <Card>
            <CardHeader className="bg-transparent">
              <h3 className="mb-0">Liste d'attente</h3>
            </CardHeader>
            <Table className="align-items-center table-flush" responsive>
              <thead className="thead-light">
                <tr>
                  <th>Client</th>
                  <th>Mis à jour le</th>
                  <th>Contract</th>
                  <th></th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {this.state.pendingPages.map((pendingPage) => {
                  return (
                    <tr key={pendingPage._id}>
                      <td className="table-user">
                        <img
                          alt="..."
                          className="avatar rounded-circle mr-3"
                          src={
                            process.env.PUBLIC_URL +
                            "/Images/" +
                            pendingPage.user.avatar
                          }
                        />
                        <b> {pendingPage.user.name}</b>
                      </td>
                      <td>
                        <span className="text-muted">
                          {new Intl.DateTimeFormat().format(
                            Date.parse(pendingPage.updatedAt)
                          )}
                        </span>
                      </td>
                      <td>
                        <a
                          className="font-weight-bold"
                          href="#pablo"
                          onClick={(e) => e.preventDefault()}
                        >
                          {pendingPage.page.global_title}
                        </a>
                      </td>
                      <td className="table-actions">
                        <a
                          className="table-action"
                          id="tooltip564981685"
                         // href=""
                          onClick={(event) => {
                            this.onClick(pendingPage.page._id);
                            this.notify("success");
                          }}
                        >
                          <i className="fa fa-lg fa-check-double" />
                        </a>
                        <UncontrolledTooltip
                          delay={0}
                          target="tooltip564981685"
                        >
                          Publish Page
                        </UncontrolledTooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Col>
      </>
    );
  }
}

PendingPages.propTypes = {
  getPendingPages: PropTypes.func.isRequired,
  updatePublishingStatement: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  
});

// Connect the redux store
export default connect(mapStateToProps, {
})(PendingPages);
