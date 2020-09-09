import {
  POST_SUBCATEGORY,
  POST_CATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  UPDATE_SUBCATEGORY,
  DELETE_CATEGORY,
  DELETE_SUBCATEGORY,
  GET_SUBCATEGORIES_BY_ID,
  GET_SITE_CATEGORIES,
  GET_CATEGORIES_TO_ADD,
  ADD_SITE_CAT,
  DELETE_SITE_CAT,
  CLEAR_MESSAGE,
} from "./categoryTypes";

const initialState = {
  category: {},
  categories: [], //all categories
  siteCategories: [], // site categories
  categories_toadd: [], //categories you can add to a site
  subCategories_by_id: [],
  message: "", // to get success message
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: "",
      };
    /*********************** CATEGORY ************************/
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case POST_CATEGORY:
      return {
        ...state,
        message: action.payload.msg,
      };
    case UPDATE_CATEGORY:
      return {
        ...state,
        message: action.payload.msg,
      };

    case DELETE_CATEGORY:
      return {
        ...state,
      };
    /*********************** SUBCATEGORY ************************/

    case POST_SUBCATEGORY:
      return {
        ...state,
        message: action.payload.msg,
      };
      case UPDATE_SUBCATEGORY:
        return {
          ...state,
          message: action.payload.msg,
        };
    case DELETE_SUBCATEGORY:
      return {
        ...state,
      };
    
    case GET_SUBCATEGORIES_BY_ID:
      return {
        ...state,
        subCategories_by_id: [...state.subCategories_by_id, ...action.payload],
      };

    /******************************** AFFECTATION  ********************************/
    case GET_CATEGORIES_TO_ADD: //1
      return {
        ...state,
        categories_toadd: action.payload,
      };
    case ADD_SITE_CAT:
      return {
        ...state,
      };
    case GET_SITE_CATEGORIES:
      return {
        ...state,
        siteCategories: action.payload,
      };
    case DELETE_SITE_CAT:
      return {
        ...state,
      };

    default:
      return state;
  }
}
