/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import ErrorLayout from './layouts/Error'

import { Provider } from "react-redux";
import store from "./services/store";
import {
  setCurrentUser,
  logoutUser,
} from "./services/userServices/authActions";
import setAuthToken from "./utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  clearCurrentProfile,
  setCurrentPermission,
} from "./services/userServices/authActions";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  console.log("decoded ", decoded.user.permission);
  // if (JSON.parse(localStorage.getItem("currentsite"))) {
  //   let permission_data = {
  //     site_id: JSON.parse(localStorage.getItem("currentsite"))._id,
  //     permissions: decoded.user.permission,
  //   };
  //   store.dispatch(setCurrentPermission(permission_data));
  // }
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = "/auth/login";
  }
}

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
    <Switch>
  
    <Route path="/admin"
       render={props => localStorage.jwtToken ? (
       <AdminLayout {...props} />) : (
        <Route path="/" render={props =><ErrorLayout {...props}/> } />
        ) } 
      />
    <Route path="/auth" render={props => <AuthLayout  {...props} />} />
    <Route path="/404" render={props =><ErrorLayout {...props}/> } />
    </Switch>
  </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
