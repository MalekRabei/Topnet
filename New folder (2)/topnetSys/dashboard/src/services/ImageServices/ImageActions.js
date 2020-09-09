import axios from "axios";
import { UPLOAD_IMAGE } from "./ImageTypes";
import { GET_ERRORS } from "../errorServices/errorTypes";

export const uploadImage = (formData, Location) => (dispatch) => {
  console.log("location ", Location);
  axios
    .post(`/api/image/${Location}`, formData)
    .then((res) => {
      dispatch({
        type: UPLOAD_IMAGE,
        payload: res.data,
      });
    })
    // .catch((err) => {
    //   console.log("err reducer ", err);
    //   dispatch({
    //     type: GET_ERRORS,
    //     payload: err.response,
    //   });
    // });
};
