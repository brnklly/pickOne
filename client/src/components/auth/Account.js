import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { editUser } from "../../actions/authActions";

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      current: "",
      password: "",
      password2: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = () => {
    if (this.props.auth.user.email) {
      this.setState({
        email: this.props.auth.user.email
      });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.errors !== this.props.errors) {
      this.setState({
        errors: this.props.errors
      });
    }
  };

  onChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      current: this.state.current,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.editUser(userData, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <main id="account-page">
        <h1 className="page-heading">Account</h1>

        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              id="email"
              value={this.state.email}
              onChange={this.onChange}
            />
            {errors.email ? <div className="error">{errors.email}</div> : null}
          </div>
          <div className="form-group">
            <label htmlFor="current">Password</label>
            <input
              type="password"
              name="current"
              id="current"
              value={this.state.current}
              onChange={this.onChange}
            />
            {errors.current ? (
              <div className="error">{errors.current}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={this.state.password}
              onChange={this.onChange}
            />
            {errors.password ? (
              <div className="error">{errors.password}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label htmlFor="password2">Confirm New Password</label>
            <input
              type="password"
              name="password2"
              id="password2"
              value={this.state.password2}
              onChange={this.onChange}
            />
            {errors.password2 ? (
              <div className="error">{errors.password2}</div>
            ) : null}
          </div>

          <div className="buttons">
            <button type="submit" className="btn">
              Save Changes
            </button>
          </div>
        </form>
      </main>
    );
  }
}

Account.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  editUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(
    mapStateToProps,
    { editUser }
  )(Account)
);
