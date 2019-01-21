import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

class Header extends Component {
  constructor(props) {
    super(props);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick = () => {
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated } = this.props.auth;

    return (
      <header>
        <Link to="/dashboard" className="logo">
          PickOne
        </Link>

        <div id="nav-button" onClick={this.props.onNavButtonClick}>
          <i className="fas fa-bars" />
        </div>

        {isAuthenticated ? (
          <div id="user-nav">
            <div className="nav-item" onClick={this.onLogoutClick}>
              Logout
            </div>
          </div>
        ) : (
          <div id="user-nav">
            <Link to="/register" className="nav-item">
              Register
            </Link>
            <Link to="/login" className="nav-item">
              Login
            </Link>
          </div>
        )}
      </header>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Header);
