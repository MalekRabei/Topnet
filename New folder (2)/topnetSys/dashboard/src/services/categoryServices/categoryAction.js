import axios from "axios";
import {
  POST_CATEGORY,
  POST_SUBCATEGORY,
  GET_CATEGORIES,
  UPDATE_CATEGORY,
  UPDATE_SUBCATEGORY,
  DELETE_CATEGORY,
  DELETE_SUBCATEGORY,
  GET_SITE_CATEGORIES,
  GET_SUBCATEGORIES_BY_ID,
  DELETE_SITE_CAT,
  ADD_SITE_CAT,
  GET_CATEGORIES_TO_ADD,
  CLEAR_MESSAGE,
} from "./categoryTypes";
import { GET_ERRORS } from "../errorServices/errorTypes";
import { getCurrentSite } from "../siteServices/siteActions";

export const clearMessage = () => (dispatch) => {
  dispatch({
    type: CLEAR_MESSAGE,
  });
};

/*********************** CATEGORY ************************/

// get categories
export const getCategories = () => (dispatch) => {
  axios.get(`/api/category/`).then((res) => {
    dispatch({
      type: GET_CATEGORIES,
      payload: res.data,
    });
  });
};

// Add Category
export const addCategory = (data) => (dispatch) => {
  axios
    .post(`/api/category/add`, data)
    .then((res) => {
      dispatch({
        type: POST_CATEGORY,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getSiteCategoriesToAdd());
      dispatch(getSiteCategories());
      dispatch(getCategories());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// update Category
export const updateCategory = (data) => (dispatch) => {
  axios
    .put(`/api/category/update`, data)
    .then((res) => {
      dispatch({
        type: UPDATE_CATEGORY,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getCategories());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// delete Category
export const deleteCategory = (id) => (dispatch) => {
  axios
    .delete(`/api/category/delete/${id}`)
    .then((res) => {
      dispatch({
        type: DELETE_CATEGORY,
        payload: id,
      });
    })
    .then(() => {
      dispatch(getCategories());
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};

/*********************** SUBCATEGORY ************************/

// Add Subcategory
export const addSubcategory = (data) => (dispatch) => {
  axios
    .post(`/api/category/add/subcategory/${data.category._id}`, data)
    .then((res) => {
      dispatch({
        type: POST_SUBCATEGORY,
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

// update subategory
export const updateSubategory = (data) => (dispatch) => {
  axios
    .put(`/api/category/update/subcategory`, data)

    .then((res) => {
      dispatch({
        type: UPDATE_SUBCATEGORY,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getCategories());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// delete Subcategory
export const deleteSubcategory = (id) => (dispatch) => {
  axios
    .delete(`/api/category/subcategory/delete/${id}`)
    .then((res) => {
      dispatch({
        type: DELETE_SUBCATEGORY,
        payload: res.data,
      });
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};

//get sub categories by id
export const getSubCategoriesbyIds = (data) => (dispatch) => {
  axios
    .get(`/api/category/subcategories/${data}`)
    .then((res) =>
      dispatch({
        type: GET_SUBCATEGORIES_BY_ID,
        payload: res.data,
      })
    )
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};

/******************************** AFFECTATION  ********************************/
//add site category
export const addSiteCategory = (idCategory) => (dispatch) => {
  axios
    .put(`/api/category/addcategorytosite/${idCategory}`)
    .then((res) => {
      dispatch({
        type: ADD_SITE_CAT,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getSiteCategoriesToAdd());
      dispatch(getSiteCategories());
      dispatch(getCurrentSite());
    })

    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};
// get site categories to add
export const getSiteCategoriesToAdd = () => (dispatch) => {
  axios
    .get(`/api/category/toaddcategories`)
    .then((res) => {
      dispatch({
        type: GET_CATEGORIES_TO_ADD,
        payload: res.data,
      });
    })
    .then(() => {
      dispatch(getCurrentSite());
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};

// get site categories
export const getSiteCategories = () => (dispatch) => {
  axios
    .get(`/api/category/sites/`)
    .then((res) => {
      dispatch({
        type: GET_SITE_CATEGORIES,
        payload: res.data[0].categories,
      });
    })
    .then(() => {
      dispatch(getCurrentSite());
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};

//delete Site Category
export const deleteSiteCategory = (idCategory) => (dispatch) => {
  axios
    .put(`/api/category/updatesite/${idCategory}`)
    .then((res) => {
      dispatch({
        type: DELETE_SITE_CAT,
        payload: res.data,
        //idCategory: idCategory
      });
    })
    .then(() => {
      dispatch(getSiteCategoriesToAdd());
      dispatch(getSiteCategories());
    })
    .then(() => {
      dispatch(getCurrentSite());
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};
