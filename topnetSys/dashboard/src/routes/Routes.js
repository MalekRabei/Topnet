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
import Index from "../views/Index.js";
import Profile from "../views/examples/Profile";
import Maps from "../views/examples/Maps.js";
import Register from "../views/examples/Register.js";
import Login from "../views/examples/Login.jsx";
import Tables from "../views/examples/Tables.js";
import Icons from "../views/examples/Icons.js";
import ReactBSTables from "../views/examples/ReactBSTables"

//User
import Users from "../views/components/user/Users.jsx";
import AddUserContainer from "../views/components/user/adding-user/AddUser.jsx";

//Client 
import Clients from "../views/components/client/ListClient"
import AddClient from "../views/components/client/AddClient"
import Assign from "../views/components/client/Assign"
import UpdateClient from '../views/components/client/EditClient'
import Contact from '../views/components/client/Contact'


//product 
import Product from "../views/components/product/product/GlobalProducts"
import UpdateProduct from "../views/components/product/product/UpdateProduct"
import AddProperties from "../views/components/product/product/productProperties/AddProductProperties"
import UpdateProperties from "../views/components/product/product/productProperties/UpdateProductProperties"

//categories
import Categorie from "../views/components/product/category/SiteCategories"
import AddCategorie from "../views/components/product/category/AddCategorie"
import ManageCategorie from "../views/components/product/category/ManageProperties"
import UpdateCategorie from "../views/components/product/category/UpdateCategories"

//facturation

import ManagePublish from "../views/components/abonnement/validation/ManagePublish"
import Abonnement from "../views/components/abonnement/Abonnement"

//error
import ErrorPage from "../views/components/ErrorPage"


export const routes_admin = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
    layout: "/admin"
  },
  {
    path: "/404",
    name: "error",
    icon: "ni ni-tv-2 text-primary",
    component: ErrorPage,
    layout: "/error",
    invisible: true
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-tv-2 text-primary",
    component: Icons,
    layout: "/admin",
    invisible:true
  },
  //users
  {
    collapse: true,
    path: "/users",
    name: "Utilisateurs",
    icon: "ni ni-circle-08 text-primary",
    state: "UserCollapse",

    views: [
    {path: "/users",
    component: Users,
    layout: "/admin",
    name: "Utilisateurs" }, 

    { path: "/addUser",
      name: "Ajout Utilisateur",
      component: AddUserContainer,
      layout: "/admin" },
    ]

  },
  
  //client
  {
    collapse:true,
    path: "/clients",
    name: "Clients",
    icon: "ni ni-single-02 text-pink",
    component: Clients,
    layout: "/admin",
    state: "ClientCollapse",
    views:[
      { path: "/clients",
      name: "Liste clients",
      component: Clients,
      layout: "/admin",},
      {
        path: "/add-client",
        name: "Ajout Client",
        component: AddClient,
        layout: "/admin"
      },
      {
        path: "/add-client-contact",
        name: "Ajout Contact",
        component: Contact,
        layout: "/admin"
      },
      {
        path: "/update-client/:id",
        name: "Update Client",
        component: UpdateClient,
        layout: "/admin",
        invisible:true
      },
      {
        path: "/assign-product/:id",
        name: "Assign product",
        component: Assign,
        layout: "/admin",
        invisible: true
      },
    ]
  },
  

  
  {
    collapse:true,
    path: "/abonnement",
    name: "Abonnements",
    icon: "ni ni-single-copy-04 text-info",
    component: Abonnement,
    layout: "/admin",
    state: "AbonnementCollapse",
    views:[
      {path: "/abonnement",
      name: "Abonnements",
      icon: "ni ni-single-copy-04 text-purple",
      component: Abonnement,
      layout: "/admin",},
      {
        path:"/valider-abonnement",
        name:"Valider Abonnements",
        icon: "ni ni-check-bold text-green",
        component: ManagePublish,
        layout:"/admin"
      },
    ]

  },

  { collapse:true,
    path: "/product",
    name: "Produits",
    icon: "ni ni-cart text-red",
    component: Product,
    layout: "/admin",
    state: "productCollapse",
    views:[
      {
      path: "/product",
      name: "Produits",
      icon: "ni ni-cart text-yellow",
      component: Product,
      layout: "/admin",},

      {
        path: "/update-product/:id",
        name: "Modifier Produits",
        icon: "ni ni-settings text-black",
    
        component: UpdateProduct,
        layout: "/admin",
        invisible: true,

      },
     
      {
        path: "/manage-properties",
        name: "Properietés",
        icon: "ni ni-ui-04 text-green",
        component: ManageCategorie,
        layout: "/admin",
      },
      {
        path: "/update-property/:id",
        icon: "ni ni-settings text-black",
        name: "Update Properties",
        component: UpdateProperties,
        layout: "/admin",
        invisible: true,

      },
      {
        path: "/category",
        name: "Catégories",
        icon: "ni ni-box-2 text-yellow",
        component: Categorie,
        layout: "/admin",
        invisible:true
      },
      {
        path: "/add-category",
        name: "Add Category",
        icon: "ni ni-box-2 text-yellow",    
        component: AddCategorie,
        layout: "/admin",
        invisible : true
      },
      {
        path: "/update-category",
        name: "Catégories",
        icon: "ni ni-settings text-blue",
        component: UpdateCategorie,
        layout: "/admin",
      },
      
    ]
  },
  
 
  {
    path: "/user-profile",
    name: "Profil ",
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

];

export const routes_auth=[
  {
    path: "/404",
    name: "error",
    icon: "ni ni-tv-2 text-primary",
    component: ErrorPage,
    layout: "/error",
    invisible: true
  },
  {
    path: "/user-profile",
    name: "Profil",
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
];
export const routes_agent_dme=[
  {
    path: "/user-profile",
    name: " Profil",
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
    path: "/404",
    name: "error",
    icon: "ni ni-tv-2 text-primary",
    component: ErrorPage,
    layout: "/error",
    invisible: true
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
];
export const routes_agent=[
  {
    path: "/user-profile",
    name: "Profil",
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
    path: "/clients",
    name: "Clients",
    icon: "ni ni-single-02 text-pink",
    component: Clients,
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
    path: "/404",
    name: "error",
    icon: "ni ni-tv-2 text-primary",
    component: ErrorPage,
    layout: "/error",
    invisible: true
  },
];
