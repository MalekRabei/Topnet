import axios from "axios";

import { CLEAR_ERRORS } from "./errorTypes";

export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};
