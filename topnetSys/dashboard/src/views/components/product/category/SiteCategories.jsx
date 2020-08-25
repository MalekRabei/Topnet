import React from "react";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import BootstrapTable from "react-bootstrap-table-next";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  Container,
  Col,
  Row,
} from "reactstrap";
import SimpleHeader from "../../../../components/Headers/SimpleHeader";
import { connect } from "react-redux";
import {
  addSiteCategory,
  deleteSiteCategory,
  getCategories,
  getSiteCategories,
  getSiteCategoriesToAdd,
} from "../../../../services/categoryServices/categoryAction";
//notifications imports
import NotificationAlert from "react-notification-alert";
import { Link } from "react-router-dom";

const { SearchBar } = Search;

const pagination = paginationFactory({
  page: 1,
  alwaysShowAllBtns: true,
  showTotal: true,
  withFirstAndLast: false,
  sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
    <div className="dataTables_length" id="datatable-basic_length">
      <label>
        Show{" "}
        {
          <select
            name="datatable-basic_length"
            aria-controls="datatable-basic"
            className="form-control form-control-sm"
            onChange={(e) => onSizePerPageChange(e.target.value)}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        }{" "}
        entries.
      </label>
    </div>
  ),
});

class SiteCategories extends React.Component {
  constructor() {
    super();
    this.state = {
      siteCategories: [],
      categories: [],
      categories_toadd: [],
      redirecredirect: false,
      permission: {},
    };
  }
  //to get data from db
  componentWillMount() {
    //get all categories
    this.props.getCategories();
    // get all current site categories
    this.props.getSiteCategories();
    // get all categories not already affected to the current site
    this.props.getSiteCategoriesToAdd();
  }

  componentWillReceiveProps(nextProps) {
    //receiving all categories
    if (nextProps.categories.Categories) {
      this.setState({ Categories: nextProps.categories.Categories });
    }
    //receiving not already affected to the current site
    if (nextProps.categories.categories_toadd) {
      this.setState({
        categories_toadd: nextProps.categories.categories_toadd,
      });
    }
    //To receive user permission
    if (nextProps.permission) {
      console.log("permission ", nextProps.permission);
      this.setState({ permission: nextProps.permission });
    }
  }

  //remove category from current site
  delete(e, idCategory) {
    e.preventDefault();
    console.log("deleting ");
    this.props.deleteSiteCategory(idCategory);
  }
  //affect category to current site
  add(e, idCategory) {
    e.preventDefault();
    console.log("adding ", idCategory);
    this.props.addSiteCategory(idCategory);
  }

  render() {
    console.log("this.state", this.state)

    return (
      <>
        {/********************  NOTIFICATION DIV  *********************/}
        <div className="rna-wrapper">
          <NotificationAlert ref="notify" />
        </div>

        <SimpleHeader name="Site Categories" parentName="Categories" />
        <Container className="mt--6" fluid>
          <Card>
            <CardHeader>
              <Row className="align-items-center">
                <Col xs="8">
                  <h5 className="h3 mb-0"> Assign New Category</h5>
                </Col>

                {this.state.permission.publish || this.state.permission.edit ? (
                  <Col className="text-right" xs="4">
                    <Button
                      color="default"
                      size="sm"
                      to="/admin/category/add"
                      tag={Link}
                    >
                      Add New Category
                    </Button>
                  </Col>
                ) : null}
              </Row>
            </CardHeader>

            <CardBody>
              <ToolkitProvider
                data={this.state.categories_toadd}
                keyField="_id"
                columns={[
                  {
                    dataField: "name",
                    text: "name",
                    sort: true,
                  },
                  {
                    dataField: "slug",
                    text: "slug",
                    sort: true,
                  },

                  {
                    dataField: "link",
                    text: "ACTION",
                    formatter: (rowContent, row) => {
                      return (
                        <div>
                          {/* {this.state.permission.publish ||
                          this.state.permission.edit ? ( */}
                            <Button
                              className="btn-round btn-icon"
                              color="primary"
                              href="#pablo"
                              id="tooltip443412080"
                              onClick={(e) => this.add(e, row._id)}
                              size="sm"
                            >
                              <span className="btn-inner--icon mr-1">
                                <i className="ni ni-fat-add" />
                              </span>
                              <span className="btn-inner--text">Add</span>
                            </Button>
                          {/* ) : null} */}
                        </div>
                      );
                    },
                  },
                ]}
                search
              >
                {(props) => (
                  <div className="py-4 table-responsive">
                    <div
                      id="datatable-basic_filter"
                      className="dataTables_filter px-4 pb-1"
                    >
                      <label>
                        Search:
                        <SearchBar
                          className="form-control-sm"
                          placeholder=""
                          {...props.searchProps}
                        />
                      </label>
                    </div>
                    <BootstrapTable
                      {...props.baseProps}
                      bootstrap4={true}
                      pagination={pagination}
                      bordered={false}
                    />
                  </div>
                )}
              </ToolkitProvider>
           
            </CardBody>
          </Card>

          {this.state.Categories === [] ? (
            ""
          ) : (
            <Card>
              <CardHeader>
                <h3 className="mb-0">Categories </h3>
              </CardHeader>
              <CardBody>
                <ToolkitProvider
                  data={this.props.categories.Categories}
                  keyField="_id"
                  columns={[
                    {
                      dataField: "name",
                      text: "name",
                      sort: true,
                    },
                    {
                      dataField: "slug",
                      text: "slug",
                      sort: true,
                    },
// heere
                    {
                      dataField: "link",
                      text: "ACTION",
                      formatter: (rowContent, row) => {
                        return (
                          <>
                            {/* {this.state.permission.publish ||
                            this.state.permission.edit ? ( */}
                              <Button
                                className="btn-round btn-icon"
                                color="danger"
                                href="#pablo"
                                id="tooltip443412080"
                                onClick={(e) => this.delete(e, row._id)}
                                size="sm"
                              >
                                <span className="btn-inner--icon mr-1">
                                  <i className="fas fa-trash" />
                                </span>
                                <span className="btn-inner--text">Remove</span>
                              </Button>
                            {/* ) : null} */}
                          </>
                        );
                      },
                    }
                    
                    
                    ,
                  ]}
                  search
                >
                  {(props) => (
                    <div className="py-4 table-responsive">
                      <div
                        id="datatable-basic_filter"
                        className="dataTables_filter px-4 pb-1"
                      >
                        <label>
                          Search:
                          <SearchBar
                            className="form-control-sm"
                            placeholder=""
                            {...props.searchProps}
                          />
                        </label>
                      </div>
                      <BootstrapTable
                        {...props.baseProps}
                        bootstrap4={true}
                        pagination={pagination}
                        bordered={false}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </CardBody>
            </Card>
          )}
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  categories: state.categories,
  permission: state.auth.current_permission,
});
export default connect(mapStateToProps, {
  getCategories,
  getSiteCategories,
  deleteSiteCategory,
  addSiteCategory,
  getSiteCategoriesToAdd,
})(SiteCategories);
