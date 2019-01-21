import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { loginUser } from "../../actions/authActions";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps !== this.props) {
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

    const loginAttempt = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(loginAttempt, this.props.history);
  };

  render() {
    const { errors } = this.state;

    return (
      <main id="login-page">
        <h1 className="page-heading">Login</h1>

        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />
            {errors.email ? <div className="error">{errors.email}</div> : null}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
            />
            {errors.password ? (
              <div className="error">{errors.password}</div>
            ) : null}
          </div>

          <div className="buttons">
            <button type="submit" className="btn">
              Login
            </button>
          </div>
        </form>

        <p className="switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </main>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default withRouter(
  connect(
    mapStateToProps,
    { loginUser }
  )(Login)
);
