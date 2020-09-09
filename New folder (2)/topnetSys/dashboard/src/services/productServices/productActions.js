import axios from "axios";
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
  ADD_PROPERTY,
  UPDATE_PROPERTY,
  GET_ALL_PROPERTIES,
  DELETE_PROPERTY,
} from "./productTypes";
import { GET_ERRORS } from "../errorServices/errorTypes";

export const clearMessage = () => (dispatch) => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};
/****************************** MANAGE GLOBAL PRODUCT *******************************/
//add product
export const addProduct = (data) => (dispatch) => {
  axios
    .post(`/api/product/add`, data)
    .then((res) => {
      dispatch({
        type: ADD_PRODUCT,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getAllProducts());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//update product
export const updateProduct = (data) => (dispatch) => {
  axios
    .put(`/api/product/update`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_PRODUCT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//get all products
export const getAllProducts = () => (dispatch) => {
  axios
    .get("/api/product")
    .then((res) =>
      dispatch({
        type: GET_PRODUCTS,
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

//get product by id
export const getProductById = (id) => (dispatch) => {
  axios
    .get(`/api/product/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PRODUCTS_BY_ID,
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

//delete product
export const deleteProduct = (id) => (dispatch) => {
  axios
    .delete(`/api/product/delete/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_PRODUCT,
        payload: id,
      })
    )
    .then(() => {
      dispatch(getAllProducts());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: null,
      });
    });
};

//get products by country code
export const getProductsByCountryCode = () => (dispatch) => {
  axios
    .get("/api/product/countrycode")
    .then((res) =>
      dispatch({
        type: GET_PRODUCTS_BY_COUNTRYCODE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PRODUCTS_BY_COUNTRYCODE,
        payload: null,
      })
    );
};

/****************************** MANAGE PRODUCT PROPERTIES *******************************/

//add product properties
export const addProductProperties = (data) => (dispatch) => {
  axios
    .post(`/api/productproperties/add`, data)
    .then((res) => {
      dispatch({
        type: ADD_PRODUCT_PROPERTIES,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getProductProperties(data.idProduct));
    })
    .then(() => {
      dispatch();
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//update product properties
export const updateProductProperties = (data) => (dispatch) => {
  axios
    .put(`/api/productproperties/update`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_PRODUCT_PROPERTIES,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getProductProperties(data.idProduct));
    })
    .then(() => {
      dispatch();
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//Get product properties
export const getProductProperties = (data) => (dispatch) => {
  axios
    .get(`/api/productproperties/${data.id}`)
    .then((res) => {
      dispatch({
        type: GET_PRODUCTPROP,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: null,
      });
    });
};

//delete product properties
export const deleteProductProperties = (id) => (dispatch) => {
  axios
    .delete(`/api/productproperties/delete/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_PRODUCT_PROPERTIES,
        payload: res.data,
      })
    )
    .then(() => {
      dispatch();
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//ScrapeUpdateProductProperties
export const ScrapeUpdateProductProperties = (data) => (dispatch) => {
  console.log("data to scrape ", data);
  dispatch({
    type: SCRAPE_UPDATE,
    payload: data,
  });
};

//scrapeData
export const ScrapeData = (data) => (dispatch) => {
  axios
    .post(`/api/productproperties/scrapetxt`, data)
    .then((res) =>
      dispatch({
        type: SCRAPE_DATA,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//clean scraped Data
export const CleanScrapedData = (data) => (dispatch) => {
  dispatch({
    type: CLEAR_SCRAPED_DATA,
  });
};

/****************************** MANAGE PROPERTIES *******************************/
//add property
export const addProperty = (data) => (dispatch) => {
  console.log("property to add actions ", data)
  axios
    .post(`/api/property/add`, data)
    .then((res) => {
      dispatch({
        type: ADD_PROPERTY,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getAllProperties());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//update property
export const updateProperty = (data) => (dispatch) => {
  axios
    .put(`/api/property/update`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_PROPERTY,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getAllProperties());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

//get all properties
export const getAllProperties = () => (dispatch) => {
  axios
    .get("/api/property")
    .then((res) =>
      dispatch({
        type: GET_ALL_PROPERTIES,
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

//delete property
export const deleteProperty = (id) => (dispatch) => {
  axios
    .delete(`/api/property/delete/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_PROPERTY,
        payload: id,
      })
    )
    .then(() => {
      dispatch(getAllProperties());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: null,
      });
    });
};
