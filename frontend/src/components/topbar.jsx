import { useAuth } from "../context/authcontext";
import "./topbar.css";
import {LuLogOut} from "react-icons/lu"
const topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <input
          type="search"
          placeholder="Search..."
          className="topbar-search"
          autoComplete="off"
        />
      </div>

      <div className="topbar-right">
        <span className="topbar-user">
          Welcome, <strong>{user?.name}</strong>
        </span>

        <button className="topbar-logout" onClick={logout}>
          <LuLogOut size={18}/>
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default topbar;
