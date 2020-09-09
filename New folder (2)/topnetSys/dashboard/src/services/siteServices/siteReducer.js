import {
  ADD_SITE,
  ADD_SITE_GENERAL_CONTENT,
  GET_SITES,
  GET_SITE,
  DELETE_SITE,
  SITE_LOADING,
  PUT_SITE,
  GET_ALL_SETTINGS,
  GET_SITES_BY_COUNTRY,
  GET_SITE_BY_DOMAINE,
  GET_SETTINGS_VARIABLES,
  UPDATE_SETTINGS_VARIABLES,
  GET_SETTINGS_VARIABLES_TO_UPDATE,
  DELETE_SETTINGS_VARIABLES,
  UPDATE_SITE_PAGES,
  ADD_SITE_PICTURE,
  UPDATE_PUBLISHING_STATEMENT,
  GET_PENDING_PAGES,
  GET_HISTORY,
  GET_CURRENT_SITE,
  GET_SITES_SITESELECTOR,
  CLEAR_MESSAGE,
  ADD_PENDING_PAGES,
  ADDING_PAGE,
} from "./types";

export const initialState = {
  sites: [],
  site: {},
  loading: false,
  added: null,
  configurations: [],
  SettingsRequired: [],
  SettingsOptional: [],
  SettingsVariables: [],
  updated: "",
  siteselector_sites: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: "",
      };
    case ADD_SITE_PICTURE:
      return {
        ...state,
        addPicture: action.payload,
      };
    case SITE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_SITES:
      return {
        ...state,
        sites: action.payload,
        loading: false,
      };
    case GET_SITES_SITESELECTOR:
      return {
        ...state,
        siteselector_sites: action.payload,
      };
    case GET_SITE:
      return {
        ...state,
        site: action.payload,
        loading: false,
      };
    case ADD_SITE:
      return {
        ...state,
        added: action.payload,
        message: action.payload.msg,
      };
    case ADD_SITE_GENERAL_CONTENT:
      return {
        ...state,
        added: action.payload,
      };
    case DELETE_SITE:
      return {
        ...state,
        sites: state.sites.filter((site) => site._id !== action.payload),
      };
    case PUT_SITE:
      return {
        ...state,
        sites: state.sites.filter((site) => site._id !== action.payload),
      };
    case GET_SITE_BY_DOMAINE:
      return {
        ...state,
        site: action.payload,
      };
    case GET_SITES_BY_COUNTRY:
      return {
        ...state,
        sites: action.payload,
      };
    case GET_ALL_SETTINGS:
      return {
        ...state,
        configurations: action.payload,
      };
    case GET_SETTINGS_VARIABLES:
      return {
        ...state,
        SettingsRequired: action.payload.settings_variables.SettingsRequired,
        SettingsOptional: action.payload.settings_variables.SettingsOptional,
      };
    case UPDATE_SETTINGS_VARIABLES:
      return {
        ...state,
        SettingsRequired: [],
        SettingsOptional: [],
      };

    case GET_SETTINGS_VARIABLES_TO_UPDATE:
      return {
        ...state,
        SettingsVariables: action.payload.settings_variables,
      };

    case DELETE_SETTINGS_VARIABLES:
      return {
        ...state,
        SettingsVariables: [],
      };
    case UPDATE_SITE_PAGES:
      return {
        ...state,
        site: [...action.payload],
      };

    case UPDATE_PUBLISHING_STATEMENT:
      return {
        ...state,
        SettingsRequired: [],
        SettingsOptional: [],
      };

  case ADD_PENDING_PAGES:
      return {
        ...state,
        SettingsRequired: [],
        SettingsOptional: [],
      };
    case GET_PENDING_PAGES:
      return {
        ...state,
        PendingPages: action.payload,
      };

    case GET_HISTORY:
      return {
        ...state,
        History: action.payload,
      };

    case GET_CURRENT_SITE:
      return {
        ...state,
        currentsite: action.payload,
      };
    case ADDING_PAGE:
      if(state.site[0] !== undefined){
        return {
          ...state,
          site:state.site[0].pages.push(action.payload) ,
        }
      }
     
    default:
      return state;
  }
}
