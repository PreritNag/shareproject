import React from "react";
import Header from "./component/Header/Header";
import Outlet from "./component/Outlet/Outlet";
import Outlet2 from "./component/Outlet/Outlet2";
import App from "./App";
import Sidebar from "./component/Sidebar/Sidebar";

function Layout(){
    return(
        <div>
        <Header/>
        {/* <App/> */}
        <Outlet/>
        <Outlet2/>
        </div>
    )
}
export default Layout;