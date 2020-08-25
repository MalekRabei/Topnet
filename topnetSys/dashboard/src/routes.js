/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "./views/Index.js";
import Profile from "./views/examples/Profile";
import Maps from "./views/examples/Maps.js";
import Register from "./views/examples/Register.js";
import Login from "./views/examples/Login.jsx";
import Tables from "./views/examples/Tables.js";
import Icons from "./views/examples/Icons.js";


//User
import Users from "./views/components/user/Users.jsx";
import AddUserContainer from "./views/components/user/adding-user/AddUser.jsx";

//Client 
import Clients from "./views/components/client/ListClient"
import AddClient from "./views/components/client/AddClient"
import Assign from "./views/components/client/Assign"
import UpdateClient from './views/components/client/EditClient'


//product 
import Product from "./views/components/product/product/GlobalProducts"
import UpdateProduct from "./views/components/product/product/UpdateProduct"
import AddProperties from "./views/components/product/product/productProperties/AddProductProperties"
import UpdateProperties from "./views/components/product/product/productProperties/UpdateProductProperties"

//categories
import Categorie from "./views/components/product/category/SiteCategories"
import AddCategorie from "./views/components/product/category/AddCategorie"
import ManageCategorie from "./views/components/product/category/ManageProperties"
import UpdateCategorie from "./views/components/product/category/UpdateCategories"

//facturation

import ManagePublish from "./views/components/abonnement/validation/ManagePublish"
import Abonnement from "./views/components/abonnement/Abonnement"


var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  //users
  {
        collapse: true,
    path: "/users",
    component: Users,
    layout: "/admin",
    name: "Users",
    icon: "ni ni-circle-08 text-primary",

  },
  {
    path: "/add-user",
    name: "Adding user",
    component: AddUserContainer,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/clients",
    name: "Clients",
    icon: "ni ni-single-02 text-pink",
    component: Clients,
    layout: "/admin"
  },
  {
    path: "/add-client",
    name: "Add Client",
    icon: "ni ni-fat-add text-black",
    component: AddClient,
    layout: "/admin"
  },
  {
    path: "/update-client/:id",
    name: "Update Client",
    icon: "ni ni-settings text-black",
    component: UpdateClient,
    layout: "/admin"
  },
  {
    path: "/assign-product/:id",
    name: "Assign product",
    component: Assign,
    layout: "/admin"
  },
  {
    path: "/abonnement",
    name: "Abonnement",
    icon: "ni ni-single-copy-04 text-purple",
    component: Abonnement,
    layout: "/admin"
  },
  {
    path:"/valider-abonnement",
    name:"Valider Abonnement",
    icon: "ni ni-check-bold text-green",
    component: ManagePublish,
    layout:"/admin"
  },
  {
    path: "/product",
    name: "Products",
    icon: "ni ni-cart text-red",
    component: Product,
    layout: "/admin",
  },
  {
    path: "/update-product/:id",
    name: "Update Products",
    icon: "ni ni-settings text-black",

    component: UpdateProduct,
    layout: "/admin",
  },
 
  {
    path: "/manage-properties",
    name: "Properties",
    icon: "ni ni-ui-04 text-black",
    component: ManageCategorie,
    layout: "/admin",
  },
  {
    path: "/update-property/:id",
    icon: "ni ni-settings text-black",
    name: "Update Properties",
    component: UpdateProperties,
    layout: "/admin",
  },
  {
    path: "/category",
    name: "Categories",
    icon: "ni ni-box-2 text-yellow",
    component: Categorie,
    layout: "/admin",
  },
  {
    path: "/add-category",
    name: "Add Category",
    icon: "ni ni-fat-add text-black",

    component: AddCategorie,
    layout: "/admin",
  },
  {
    path: "/update-category",
    name: "Update Categories",
    icon: "ni ni-settings text-black",
    component: UpdateCategorie,
    layout: "/admin",
  },
  
 
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-single-02 text-blue",
    component: Profile,
    layout: "/admin",
    invisible: true,
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
    invisible: true,
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin"
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "/admin"
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin"
  },
];
export default routes;
