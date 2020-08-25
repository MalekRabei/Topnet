import { UPLOAD_IMAGE } from "./ImageTypes";

const initialState = {};

export default function (state = initialState, action) {
  switch (action.type) {
    case UPLOAD_IMAGE:
      return {
        ...state,
      };

    default:
      return state;
  }
}
