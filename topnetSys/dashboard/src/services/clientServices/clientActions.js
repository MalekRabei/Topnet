import axios from 'axios';

import {
    ADD_CLIENT ,
    ADD_CONTACT,
    CLIENT_LOADING ,
    GET_CLIENT,
    GET_CLIENTM,
    GET_ALL_CLIENTS ,
    UPDATING_CLIENT ,
    CLEAR_MESSAGE,
    GET_ALL_CONTACTS,
    DELETE_CONTACT,
    GET_PRODUCTS_BY_COUNTRYCODE,
    GET_ERRORS
   } from './types';

   export const clearMessage = () => (dispatch) => {
    dispatch({
      type: CLEAR_MESSAGE,
    });
  };
// Create client
export const createClient = (clientData, history) => dispatch => {

  axios
    .post('/api/clients/client/add', clientData)
    .then(
      res => {history.push('/admin/clients')
      dispatch({
        type: ADD_CLIENT,
        payload: res.data
      })
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};


// Get client
export const getClient = id => dispatch => {
  return  axios
    .get(`/api/clients/${id}`)
    .then(res =>
      dispatch({
        type: GET_CLIENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CLIENT,
        payload: err.response
      })
    );
};

// Get client by matricule
export const getClientByMatricule = matricule => dispatch => {
  return  axios
    .get(`/api/clients/findClientByMatricule/${matricule}`)
    .then(res => {
      dispatch({
        type: GET_CLIENTM,
        payload: res.data
      }) }
    )
    .catch(err =>
      dispatch({
        type: GET_CLIENTM,
        payload: err.data
      })
    );
};


//get products by country code
export const getProductsByCountryCode = code  => dispatch => {
  axios
    .get(`/api/clients/countrycode/${code}`)
    .then((res) =>
      dispatch({
        type: GET_PRODUCTS_BY_COUNTRYCODE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PRODUCTS_BY_COUNTRYCODE,
        payload: err.data,
      })
    );
};
// Edit client
export const editClient = (id, clientData, history) => dispatch => {
    axios
      .put(`/api/clients/client/edit/${id}`, clientData)
      .then( 
        res =>{
           history.push('/admin/clients');
           dispatch({
            type: UPDATING_CLIENT,
            payload: res.data
          })
    })
      .catch(
        (err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      })
  };

/*************CONTACT */
// Create client
export const createContact = (contactData, history) => dispatch => {

  axios
    .post('/api/contact/add', contactData)
    .then(
      res => {//history.push('/admin/add-client')
      dispatch({
        type: ADD_CONTACT,
        payload: res.data
      })
    }).then(() => {
      dispatch(getAllContacts());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};


//get all contact
export const getAllContacts = () => (dispatch) => {
  axios
    .get("/api/contact/list")
    .then((res) =>
      dispatch({
        type: GET_ALL_CONTACTS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: null,
      });
    });
};


//delete contact
export const deleteContact = (id) => (dispatch) => {
  axios
    .delete(`/api/contact/delete/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_CONTACT,
        payload: id,
      })
    )
    .then(() => {
      dispatch(getAllContacts());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: null,
      });
    });
};