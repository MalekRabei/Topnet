import axios from 'axios';

import {
    ADD_ABONNEMENT ,
    GET_ERRORS,
    CLEAR_MESSAGE,
    VALIDER_ETAT,
    REJETER_ETAT
   } from './types';

   export const clearMessage = () => (dispatch) => {
    dispatch({
      type: CLEAR_MESSAGE,
    });
  };
// Create abonnement
export const createAbonnement = (abonnementData, history) => dispatch => {

  axios
    .post('/api/abonnements/abonnement/add', abonnementData)
    .then(
      res => {history.push('/admin/abonnements')
      dispatch({
        type: ADD_ABONNEMENT,
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


/****************************************Gestion etat abonnement */
//VALIDER
export const validerEtat = (id) => (dispatch) => {
  axios
    .post(`/api/abonnements/valider/${id}`)
    .then((res) => {
      dispatch({
        type: VALIDER_ETAT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};

//REJETER
export const rejeterEtat = (id) => (dispatch) => {
  axios
    .post(`/api/abonnements/rejeter/${id}`)
    .then((res) => {
      dispatch({
        type: REJETER_ETAT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};