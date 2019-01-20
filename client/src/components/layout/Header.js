import React, { Component } from "react";
import { Link } from "react-router-dom";

class Header extends Component {
  render() {
    return (
      <header>
        <Link to="/dashboard" className="logo">
          PickOne
        </Link>

        <div id="nav-button" onClick={this.props.onNavButtonClick}>
          <i className="fas fa-bars" />
        </div>

        <div id="user-nav">
          <Link to="/register" className="nav-item">
            Register
          </Link>
          <Link to="/login" className="nav-item">
            Login
          </Link>
          <Link to="/" className="nav-item">
            Logout
          </Link>
        </div>
      </header>
    );
  }
}

export default Header;
