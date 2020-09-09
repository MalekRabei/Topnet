import axios from "axios";

import {
  GET_USERS,
  GET_USER,
  DELETE_USER,
  PUT_USER,
  POST_USER,
  GET_ERRORS,
  SAVE_USER,
  POST_FREELANCER,
  UPDATE_USER
} from "./userTypes";

// Get Users
export const getUsers = () => dispatch => {
  axios
    .get("/api/users")
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: null
      })
    );
};

// Get User
export const getUser = id => dispatch => {
  axios
    .get(`/api/users/${id}`)
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Add User
export const registerUser = (data, history) => dispatch => {
  axios
    .post(`/api/users/register`, data)
    .then(res => {
      history.push('/admin/users')
      dispatch({
        type: POST_USER,
        payload: res.data
      });
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }))
};

// Add Freelancer
export const registerFreelancer = (data, history) => dispatch => {
  axios
    .post(`/api/users/registerFreelancer`, data)
    .then(res => {
      dispatch({
        type: POST_FREELANCER,
        payload: res.data
      });
      history.push("/");
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }))
};


// Delete User
export const deleteUser = id => dispatch => {
  axios
    .delete(`/api/users/${id}`)
    .then(res =>
      dispatch({
        type: DELETE_USER,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: DELETE_USER,
        payload: err.response.data
      })
    );
};

// Edit User
export const EditUser = (data, history) => dispatch => {
  axios
    .put(`/api/users/${data._id}`, data)
    .then(res => {
      dispatch({
        type: PUT_USER,
        payload: res.data
      });
      history.push("");
    })
    .catch(err =>
      dispatch({
        type: PUT_USER,
        payload: err.response.data
      })
    );
};
//edit permission 
export const editPermission = (data)=> dispatch => {
  axios.put(`/api/users/updatePermission/${data._id}`,data)
  .then(res => {
    dispatch({
      type: UPDATE_USER,
      payload: res.data
    });
    
  })
  .catch(err =>
    dispatch({
      type: UPDATE_USER,
      payload: err.response.data
    })
  );
}

//Saving user
export const saveUser=(register_user)=>{
  return {
    type: SAVE_USER,
   payload: register_user
  }
}

