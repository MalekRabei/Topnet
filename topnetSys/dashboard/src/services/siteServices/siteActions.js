import axios from "axios";
import {
  ADD_SITE,
  ADD_SITE_GENERAL_CONTENT,
  GET_ERRORS,
  CLEAR_ERRORS,
  ADD_SITE_PICTURE,
  GET_SITES,
  GET_SITE,
  SITE_LOADING,
  DELETE_SITE,
  PUT_SITE,
  GET_SITES_BY_COUNTRY,
  GET_CURRENT_SETTINGS,
  GET_SITE_BY_DOMAINE,
  GET_ALL_SETTINGS,
  GET_SETTINGS_VARIABLES,
  GET_SETTINGS_VARIABLES_TO_UPDATE,
  DELETE_SETTINGS_VARIABLES,
  UPDATE_SETTINGS_VARIABLES,
  UPDATE_SITE_PAGES,
  UPDATE_PUBLISHING_STATEMENT,
  GET_PENDING_PAGES,
  GET_HISTORY,
  GET_CURRENT_SITE,
  GET_SITES_SITESELECTOR,
  UPDATE_SITEPAGE,
  ADD_PENDING_PAGES
} from "./types";

export const addSitetPicture = (formData) => (dispatch) => {
  console.log("form data  ", formData);
  axios
    .post("http://localhost:5001/api/sites/addpicture", formData, {})
    .then((res) => {
      console.log("action picture ");
      dispatch({
        type: ADD_SITE_PICTURE,
        payload: res.data,
      });
    })
    .then(() => dispatch({ type: GET_ERRORS, payload: {} }));
};
// Add Site
export const addSite = (siteData) => (dispatch) => {
  axios
    .post("/api/sites", siteData)
    .then((res) =>
      dispatch({
        type: ADD_SITE,
        payload: res.data,
      })
    )
    .catch((err) => {
      console.log("err reducer ", err);
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Add Site
export const addSiteGeneralContent = (siteGeneralContentData) => (dispatch) => {
  console.log("adding action ", siteGeneralContentData);
  // dispatch(clearErrors());
  axios
    .post("/api/currentsitesettings", siteGeneralContentData)
    .then((res) =>
      dispatch({
        type: ADD_SITE_GENERAL_CONTENT,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};
// Get Sites By Country
export const getSitesByCountry = (CountryCode) => (dispatch) => {
  axios
    .get(`/api/sites/searchByCountry/${CountryCode}`)
    .then((res) =>
      dispatch({
        type: GET_SITES_BY_COUNTRY,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get Sites
export const getSites = () => (dispatch) => {
  dispatch(setSitetLoading());
  axios
    .get("/api/sites")
    .then((res) =>
      dispatch({
        type: GET_SITES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_SITES,
        payload: null,
      })
    );
};

//get Siteselector's sites
export const getSitesForSiteselector = (iduser) => (dispatch) => {
  axios
    .get(`/api/sites/siteselector/${iduser}`)
    .then((res) => {
      dispatch({
        type: GET_SITES_SITESELECTOR,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SITE,
        payload: null,
      })
    );
};

// Get Site
export const getSite = (id) => (dispatch) => {
  dispatch(setSitetLoading());
  axios
    .get(`/api/sites/${id}`)
    .then((res) =>
      dispatch({
        type: GET_SITE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_SITE,
        payload: null,
      })
    );
};

// Delete Site
export const deleteSite = (id) => (dispatch) => {
  axios
    .delete(`/api/sites/${id}`)
    .then((res) =>
      dispatch({
        type: DELETE_SITE,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Edit Site
export const EditSite = (data, history) => (dispatch) => {
  axios.put(`/api/sites/${data._id}`, data).then((res) => {
    dispatch({
      type: PUT_SITE,
      payload: res.data,
    });
  });
};

// Set loading state
export const setSitetLoading = () => {
  return {
    type: SITE_LOADING,
  };
};
//GetAll website settings
export const getAllSettings = () => (dispatch) => {
  axios
    .get("/api/currentsitesettings")
    .then((res) =>
      dispatch({
        type: GET_ALL_SETTINGS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ALL_SETTINGS,
        payload: null,
      })
    );
};

// Get Sites By Country

export const getSitesByDomain = () => (dispatch) => {
  dispatch(setSitetLoading());
  axios
    .get(`/api/sites/searchByDomain/domain`)
    .then((res) =>
      dispatch({
        type: GET_SITE_BY_DOMAINE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_SITE_BY_DOMAINE,
        payload: null,
      })
    );
};
// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

//get Setting variables to add
export const getSettingVariables = () => (dispatch) => {
  axios
    .get(`/api/sites/getsettingvariables`)
    .then((res) =>
      dispatch({
        type: GET_SETTINGS_VARIABLES,
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

//get setting variables to update
export const getSettingVariablesToUpdate = () => (dispatch) => {
  axios
    .get("/api/sites/getconfiguredsettingvariables")
    .then((res) => {
      dispatch({
        type: GET_SETTINGS_VARIABLES_TO_UPDATE,
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

//update Setting variables
export const updateSettingVariables = (data) => (dispatch) => {
  axios
    .put(`/api/sites/updatesettingvariables`, data)
    .then((res) => {
      console.log("updated");
    })
    .then(() => {
      dispatch(getSettingVariablesToUpdate());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};

//delete Settings variables

export const deleteSettingsVariables = () => (dispatch) => {
  axios
    .put(`/api/sites/deletesettingvariables`)
    .then((res) =>
      dispatch({
        type: DELETE_SETTINGS_VARIABLES,
        payload: res.data,
      })
    )
    .then(() => {
      dispatch(getSettingVariablesToUpdate());
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: null,
      })
    );
};

//update site pages
// export const updateSitePages =(site)=> (dispatch)=>{
//   console.log("UPDATE ACTION SITE ", site)
//  return dispatch({
//     type: UPDATE_SITE_PAGES,
//     payload: site,
//   })
// }

export const updateSitePages = (site) => {
  return {
    type: UPDATE_SITE_PAGES,
    payload: site,
  };
};
// export const updateSitePageAction = (pages) => (dispatch)  => {
//   console.log("site action ", pages)
//   axios
//   .put(`/api/sites/updatesitepage`, pages  )
//   // .then((res) => {
//   //   dispatch({
//   //     type: UPDATE_SITEPAGE,
//   //     payload: res.data,
//   //   });
//   // })
//   .catch((err) => {
//     dispatch({
//       type: GET_ERRORS,
//       payload: err.response.data,
//     });
//   });
// };



//update publishing statement
export const updatePublishingStatement = (id) => (dispatch) => {
  axios
    .post(`/api/pages/manageStatement/${id}`)
    .then((res) => {
      dispatch({
        type: UPDATE_PUBLISHING_STATEMENT,
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

//add pending page
export const addPendingPage = (id) => (dispatch) => {
  axios
    .post(`/api/pages/addpendingpage/${id}`)
    .then((res) => {
      dispatch({
        type: ADD_PENDING_PAGES,
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

//get pending pages
export const getPendingPages = () => (dispatch) => {
  axios
    .get("/api/pages/pendingPages")
    .then((res) => {
      dispatch({
        type: GET_PENDING_PAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: [],
      })
    );
};

//get pending pages
export const getHistory = () => (dispatch) => {
  axios
    .get("/api/pages/history")
    .then((res) => {
      dispatch({
        type: GET_HISTORY,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: [],
      })
    );
};
//get pending pages
export const getCurrentSite = () => (dispatch) => {
  axios
    .get("/api/sites/currentsite")
    .then((res) => {
      dispatch({
        type: GET_CURRENT_SITE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: [],
      })
    );
};
