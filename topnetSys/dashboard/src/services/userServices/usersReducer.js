import {
  SAVE_USER,
  GET_USER,
  GET_USERS,
  POST_USER,
  DELETE_USER,
  PUT_USER,
  UPDATE_USER
} from "./userTypes";

const initialState = {
  users: [],
  user: {},
  update_user:{},
  register_user: {
    name: "",
    email: "",
    emailverif: "",
    countrycode: [],
    role: "",
    enabled: true,
    avatar:
      "users/avatar/default.png",
    permission:[]
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        register_user: action.payload
      };

    case GET_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      };
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case POST_USER:
      return {
        ...state,
        users: [action.payload, ...state.users]
      };

    case PUT_USER:
      return {
        ...state,
        users: [
          action.payload,
          ...state.users.filter(user => user._id !== action.payload)
        ]
      };
    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      };
    case UPDATE_USER:
      return {
        ...state,
        update_user:action.payload
      }
    default:
      return state;
  }
}
