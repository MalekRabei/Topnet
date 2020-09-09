import {
   ADD_CLIENT ,
   CLIENT_LOADING ,
   GET_CLIENT,
   GET_CLIENTM,
   GET_ALL_CLIENTS ,
   UPDATING_CLIENT ,
   CLEAR_MESSAGE,
   ADD_CONTACT,
   DELETE_CONTACT,
 GET_PRODUCTS_BY_COUNTRYCODE,
 GET_ALL_CONTACTS
      
  } from './types';
  
  const initialState = {
    error: {},
    clients: [],
    loading: false,
    client : {} ,
    errors : {}, 
    products_country_code: [],
    message: "",
    contact: {},
    contacts: []
  };

  const FETCH_CLIENTS_PENDING = "FETCH_CLIENTS_PENDING";
  const FETCH_CLIENTS_SUCCESS = "FETCH_CLIENTS_SUCCESS";
  const FETCH_CLIENTS_FAILURE = "FETCH_CLIENTS_FAILURE";
  
  export default function(state = initialState, action) {
    switch (action.type) {
      case CLEAR_MESSAGE:
        return {
          ...state,
          message: "",
        };

      case FETCH_CLIENTS_PENDING: 
      return {...state, loading: true};

      case FETCH_CLIENTS_SUCCESS: 
      return {...state, loading: false, clients: action.payload};

      case FETCH_CLIENTS_FAILURE: 
      return {...state, loading: false, error: action.payload};


      case CLIENT_LOADING:
        return {
          ...state,
          loading: true
        };

      case ADD_CLIENT:
        return {
          ...state,
          message:action.payload.msg,
        };
        case GET_CLIENT:
        return {
          ...state,
          client: action.payload,
          loading: false
        };
        case GET_CLIENTM:
          return {
            ...state,
            client: action.payload,
            loading: false
          };
        case GET_ALL_CLIENTS:
       // console.log( action.payload.name);
        return {
          ...state,
          loading: false
        };
        case UPDATING_CLIENT:
            // console.log( action.payload.name);
             return {
               ...state,
               loading: false,
               message:action.payload.msg,
             };
        case GET_PRODUCTS_BY_COUNTRYCODE:
        return {
          ...state,
          products_country_code: action.payload,
          loading: false,
        };
        case ADD_CONTACT:
        return {
          ...state,
          message:action.payload.msg,
        };

        case GET_ALL_CONTACTS:
        return {
          ...state,
          contacts:action.payload,
          //loading: false,

        };

        case DELETE_CONTACT:
        return {
          ...state,
        };
      default:
        return state;
    }
  }
  