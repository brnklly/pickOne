import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/authActions";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.onNavItemClick = this.onNavItemClick.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onNavItemClick = () => {
    const nav = Array.from(document.getElementsByTagName("nav"))[0];
    nav.classList.remove("show");
  };

  onLogoutClick = () => {
    this.onNavItemClick();
    this.props.logoutUser();
  };

  render() {
    const { user, isAuthenticated } = this.props.auth;

    return (
      <nav>
        <a href="/how-it-works.html" className="nav-item">
          How It Works
        </a>
        {isAuthenticated ? (
          <div>
            <Link
              to="/dashboard"
              className="nav-item"
              onClick={this.onNavItemClick}
            >
              Dashboard
            </Link>
            <Link
              to="/account"
              className="nav-item"
              onClick={this.onNavItemClick}
            >
              Account
            </Link>
            <div className="nav-item" onClick={this.onLogoutClick}>
              Logout
            </div>
          </div>
        ) : (
          <div>
            <Link
              to="/register"
              className="nav-item"
              onClick={this.onNavItemClick}
            >
              Register
            </Link>
            <Link
              to="/login"
              className="nav-item"
              onClick={this.onNavItemClick}
            >
              Login
            </Link>
          </div>
        )}
      </nav>
    );
  }
}

Nav.propTypes = {
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Nav);
