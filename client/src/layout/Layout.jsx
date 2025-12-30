import { Outlet, useNavigate } from "react-router-dom";
import "./Layout.css";
import Sidebar from "../components/sidebar/newSidebar/SideBar";

const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
