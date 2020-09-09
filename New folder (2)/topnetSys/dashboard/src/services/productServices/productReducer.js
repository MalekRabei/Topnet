import {
  ADD_PRODUCT,
  GET_PRODUCTS,
  DELETE_PRODUCT,
  GET_PRODUCTS_BY_COUNTRYCODE,
  ADD_PRODUCT_PROPERTIES,
  UPDATE_PRODUCT_PROPERTIES,
  GET_PRODUCTPROP,
  DELETE_PRODUCT_PROPERTIES,
  SCRAPE_UPDATE,
  GET_PRODUCTS_BY_ID,
  SCRAPE_DATA,
  UPDATE_PRODUCT,
  CLEAR_MESSAGE,
  CLEAR_SCRAPED_DATA,
  GET_ALL_PROPERTIES,
  ADD_PROPERTY,
  UPDATE_PROPERTY,
} from "./productTypes";

const initialState = {
  products: [],
  product: {},
  products_country_code: [],
  productproperties: {},
  verifyProductProperties: {},
  product_byId: {},
  scraped_data: {},
  message: "",
  properties: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case CLEAR_MESSAGE:
      return {
        ...state,
        message: "",
      };
    case ADD_PRODUCT:
      return {
        ...state,
        message: action.payload.msg,
      };
    case ADD_PRODUCT_PROPERTIES:
      return {
        ...state,
        productproperties: action.payload,
      };
    case GET_PRODUCTS:
      return {
        ...state,
        products: action.payload,
      };
    case GET_PRODUCTS_BY_COUNTRYCODE:
      return {
        ...state,
        products_country_code: action.payload,
      };
    case UPDATE_PRODUCT_PROPERTIES:
      return {
        ...state,
        message: action.payload.msg,
      };
    case GET_PRODUCTPROP:
      return {
        ...state,
        productproperties: action.payload,
        properties: action.payload.properties,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
      };
    case DELETE_PRODUCT_PROPERTIES:
      return {
        ...state,
        productproperties: null,
      };
    case SCRAPE_UPDATE:
      return {
        ...state,
        properties: state.properties.map((pp, index) => {
          if (pp.key == action.payload.key) {
            return action.payload;
          } else {
            return pp;
          }
        }),
      };
    case GET_PRODUCTS_BY_ID:
      return {
        ...state,
        product_byId: action.payload,
      };
    case SCRAPE_DATA:
      console.log("action.payload scrape ", action.payload);
      return {
        ...state,
        scraped_data: action.payload,
      };
    case UPDATE_PRODUCT:
      return {
        ...state,
        message: action.payload.msg,
      };
    case CLEAR_SCRAPED_DATA:
      return {
        ...state,
        scraped_data: "",
      };
    case GET_ALL_PROPERTIES:
      return {
        ...state,
        properties: action.payload,
      };
    case ADD_PROPERTY:
      return {
        ...state,
        message: action.payload.msg,
      };
    case UPDATE_PROPERTY:
      return {
        ...state,
        message: action.payload.msg,
      };

    default:
      return state;
  }
}
