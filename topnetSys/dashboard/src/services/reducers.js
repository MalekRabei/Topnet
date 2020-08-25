import { combineReducers } from 'redux';

import authReducer from './userServices/authReducer';
import errorReducer from './errorServices/errorReducer';
import usersReducer from './userServices/usersReducer';
import profileReducer from './userServices/profileReducer';
import productReducer from './productServices/productReducer';
import categoryReducer from './categoryServices/categoryReducer';
import clientReducer from './clientServices/clientReducer';



export default combineReducers({
    auth: authReducer,
    errors: errorReducer,  
    users : usersReducer, 
    profile : profileReducer,
    products : productReducer, 
    categories: categoryReducer,
    clients: clientReducer,
    

});
