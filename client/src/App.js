import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import "./css/App.scss";
import { Provider } from "react-redux";
import store from "./store";

import Header from "./components/layout/Header";
import Nav from "./components/layout/Nav";
import Register from "./components/Register";
import Login from "./components/Login";

// check for token
if (localStorage.jwtToken) {
  // set auth header
  setAuthToken(localStorage.jwtToken);
  // decode token and get user
  const decoded = jwt_decode(localStorage.jwtToken);
  // set user
  store.dispatch(setCurrentUser(decoded));
}

class App extends Component {
  constructor(props) {
    super(props);
    this.onNavButtonClick = this.onNavButtonClick.bind(this);
  }

  onNavButtonClick = () => {
    const nav = Array.from(document.getElementsByTagName("nav"))[0];
    const isShown = nav.classList.contains("show");
    if (isShown) {
      nav.classList.remove("show");
    } else {
      nav.classList.add("show");
    }
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Header onNavButtonClick={this.onNavButtonClick} />
            <Nav />

            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
