import axios from "axios";
import setAuthToken from "../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  SET_CURRENT_USER,
  CLEAR_CURRENT_PROFILE,
  PROFILE_LOADING,
  GET_PROFILE,
  VERIF_PASS,
  UPDATING_PASS,
  UPDATE_STATUS,
} from "./userTypes";
import { GET_ERRORS } from "../errorServices/errorTypes";
import { CURRENT_PERMISSION } from "./types";

// Login - Get User Token
export const loginUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/auth", userData)
    .then((res) => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      //Set token to role
      localStorage.setItem("role", decoded.user.role);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch((err) => {
      dispatch({
        type: null,
        payload: err.response,
      });
    });
};

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
// Set current permission
export const setCurrentPermission = (permission) => {
  console.log("permission user data actionss ", permission);

  return {
    type: CURRENT_PERMISSION,
    payload: permission,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  //Remove current site from localStorage
  localStorage.removeItem("currentsite");

  //Remove role from localStorage
  localStorage.removeItem("role");

  //remove permission localstorage
  localStorage.removeItem("permission");

  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};
export const AddingUser = (userData) => (dispatch) => {
  axios
    .post("/api/users/register", userData)
    .then((res) => {
      //dispatch(setAddedUser(res));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

//get current profile
export const getProfile = () => (dispatch) => {
  console.log("GEETING PROFILE");
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/profile")
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

export const verifPassord = () => (dispatch) => {
  dispatch(setPassVerif());
  axios
    .get("/api/users/verifpass")
    .then((res) =>
      dispatch({
        type: VERIF_PASS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};

export const setPassVerif = () => {
  return {
    type: VERIF_PASS,
  };
};

export const updatePassword = (userData) => (dispatch) => {
  console.log("user daaaaaaata ", userData);
  dispatch(setPassUpdate());
  axios
    .post("/api/users/updatepassword", userData)
    .then((res) =>
      dispatch({
        type: UPDATING_PASS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};

export const setPassUpdate = () => {
  return {
    type: UPDATING_PASS,
  };
};

export const changeStatus = (data) => (dispatch) => {
  console.log("update status ", data);
  axios
    .put("/api/users/enableuser", data)
    .then((res) => {
      console.log("updated action ");

      dispatch({
        type: UPDATE_STATUS,
        payload: res.data,
      });
    })
    .catch((err) => {
      console.log("updated action error");

      dispatch({
        type: GET_ERRORS,
        payload: null,
      });
    });
};
