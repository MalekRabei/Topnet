import  { routes_auth , routes_admin, routes_agent,routes_agent_dme, 
} from "./routes/Routes.js";
import  {ADMIN, AGENT, AGENT_DME  } 
     from "./routes/roles.js"
const getRoutesArray = (localStorage)=> {
let routes ;
!localStorage.jwtToken ? routes = routes_auth:
localStorage.getItem("role").toString()=== ADMIN ?routes =  routes_admin : 
localStorage.getItem("role").toString()=== AGENT ? routes = routes_agent :  
localStorage.getItem("role").toString()=== AGENT_DME ?routes =  routes_agent_dme :  

routes =  []
return routes
} 

              

export default getRoutesArray;
