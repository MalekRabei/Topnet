import React from "react";
// react library for routing
import { Route, Switch , Redirect} from "react-router-dom";

// core components
import AuthFooter from "../components/Footers/AuthFooter.jsx";

import getRoutesArray from "../routes";
class Auth extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      routes:[]
    }
  }
  componentDidMount() {
    document.body.classList.add("bg-default");
  }
  componentWillUnmount() {
    document.body.classList.remove("bg-default");
  }
  componentDidUpdate(e) {
    if (e.history.pathname !== e.location.pathname) {
      document.documentElement.scrollTop = 0;
      document.scrollingElement.scrollTop = 0;
      this.refs.mainContent.scrollTop = 0;
    }
  }
  componentWillMount(){
    let routes = getRoutesArray(localStorage);
    this.setState({routes:routes});
  }
  getRoutes = routes => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      if (prop.path==="/index" && !localStorage.jwtToken)   return (<Redirect to="/" key={key} />)
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  render() {
    return (
      <>
        <div className="main-content" ref="mainContent">
       
          <Switch>{this.getRoutes(this.state.routes)}  <Redirect from="*" to="/" /></Switch>
          </div>
        <AuthFooter />
      </>
    );
  }
}

export default Auth;
