import axios from 'axios';

import {
    ADD_ABONNEMENT ,
    GET_ERRORS,
    CLEAR_MESSAGE,
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



