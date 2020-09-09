import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { EditUser, getUser } from "../../../../services/userServices/userActions";

class Edit extends Component {
  state = {
    name: "",
    email: "",
    avatar:"",
    role: "",
    _id: "",
    errors: {}
  };

  componentDidMount() {
    this.props.getUser(this.props.match.params.id);
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.user) {
      const { name, email,avatar,role, _id } = nextProps.user;
      this.setState({ name, email,avatar,role, _id });
    }
  }

  onSubmit = e => {
    e.preventDefault();

    const newData = {
      name: this.state.name,
      email: this.state.email,
      avatar:this.state.avatar,
      role:this.state.role,
      _id: this.state._id
    };

    this.props.EditUser(newData, this.props.history);
  };

  render() {
    const { errors } = this.state;
    const { error } = this.props.errors;
    return (
      <div className="container">
        {error ? (
          <h1>{error}</h1>
        ) : (
          <form className="border border-light p-5" onSubmit={this.onSubmit}>
            <input
              type="text"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.name
              })}
              placeholder="First Name"
              name="name"
              defaultValue={this.state.name}
              onChange={this.onChange}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}

            <input
              type="text"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.email
              })}
              placeholder="Last Name"
              name="email"
              defaultValue={this.state.email}
              onChange={this.onChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}


<input
              type="file"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.avatar
              })}
              placeholder="Last Name"
              name="avatar"
              defaultValue={this.state.avatar}
              onChange={this.onChange}
            />
            {errors.avatar && (
              <div className="invalid-feedback">{errors.avatar}</div>
            )}

<input
              type="text"
              className={classnames("form-control mt-2", {
                "is-invalid": errors.role
              })}
              placeholder="Last Name"
              name="role"
              defaultValue={this.state.role}
              onChange={this.onChange}
            />
            {errors.role && (
              <div className="invalid-feedback">{errors.role}</div>
            )}


            <button className="btn red accent-4 btn-block mt-4" type="submit">
              Save
            </button>
            <Link to="/" className="btn btn-outline-danger btn-block mt-2">
              Cancel
            </Link>
          </form>
        )}
      </div>
    );
  }
}

Edit.propTypes = {
  EditUser: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors,
  user: state.users.user
});

export default connect(
  mapStateToProps,
  { EditUser, getUser }
)(Edit);
