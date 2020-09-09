import isEmpty from "../../validation/is-empty";

import {
  SET_CURRENT_USER,
  GET_PROFILE,
  PROFILE_LOADING,
  VERIF_PASS,
  UPDATING_PASS,
} from "../userServices/userTypes";
import { CURRENT_PERMISSION } from "./types";
const initialState = {
  isAuthenticated: false,
  userconnected: {},
  user: {},
  profile: null,
  loading: false,
  verifPass: false,
  newPass: "" , 
  current_permission : "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
     // console.log("currenr site *** ", currentsite)
     let permission = {}
    //  if(JSON.parse(localStorage.getItem("currentsite"))!==undefined )
    //  permission = action.payload.user.permission.filter(perm => perm.siteId === JSON.parse(localStorage.getItem("currentsite"))._id)[0]

      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        userconnected: action.payload,
       // current_permission : permission

      };
    case CURRENT_PERMISSION:
     // console.log("current_permission ", action.payload)
      return {
        ...state,
        current_permission: action.payload.permissions.filter(perm => perm.siteId === action.payload.site_id)[0],
      };
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PROFILE:
      //console.log("GET_PROFILE", action.payload);
      return {
        ...state,
        profile: action.payload,
        loading: false,
      };
    case VERIF_PASS:
      return {
        ...state,
        verifPass: action.payload,
      };
    case UPDATING_PASS:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
