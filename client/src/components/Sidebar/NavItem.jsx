import { NavLink } from "react-router-dom";

export const NavItem = ({ icon, label, path }) => {
  return (
    <NavLink
      to={path}
      title={label}
      className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
    >
      <span className="material-icons-outlined">{icon}</span>
    </NavLink>
  );
};
