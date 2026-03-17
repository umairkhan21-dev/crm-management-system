import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { useSearch } from "../context/searchcontext";
import "./layout.css";
import {LuLayoutDashboard, LuFileText, LuTickets, LuUser, LuUserPlus} from "react-icons/lu"

const Layout = ({ children }) => {
  const { search, setSearch } = useSearch();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme,setTheme] = useState("light");
  useEffect(()=>{
    const savedTheme = localStorage.getItem("crm-theme")
    if (savedTheme){
      setTheme(savedTheme);
      document.body.className = savedTheme;
    }
  },[]);
  const toggletheme = () =>{
    const newTheme = theme ==="light"?"dark":"light";
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem("crm-theme",newTheme);
  }
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="layout-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">CRM</h2>

        <nav className="nav-menu">
          <NavLink to="/dashboard" className="nav-link">
          <LuLayoutDashboard className="nav-icons"/>
            Dashboard
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/employees" className="nav-link">
              <LuUser className="nav-icons"/>
              Employees
            </NavLink>
          )}

          <NavLink to="/leads" className="nav-link">
          <LuFileText className="nav-icons"/>
            Leads
          </NavLink>

          <NavLink to="/tickets" className="nav-link">
          <LuTickets className="nav-icons"/>
            Tickets
          </NavLink>

          {user?.role === "admin" && (
            <NavLink to="/create-staff" className="nav-link">
              <LuUserPlus className="nav-icons"/>
              Create User
            </NavLink>
          )}
        </nav>

        <button className="theme-toggle" onClick={toggletheme}>
          {theme==="light"?"🌙 Dark Mode":"☀️ Light Mode"}
        </button>
      </aside>

      {/* MAIN AREA */}
      <div className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <input
            type="search"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
            name="crm-arch-ignore"
            autoComplete="new-password"
          />

          <div className="topbar-right">
            <span className="welcome-text">
              Welcome, {user?.name}
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
