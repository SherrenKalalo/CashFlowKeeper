// rrd imports
import { Form, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

// assets
import logomark from "../assets/logomark.svg";
import { useEffect, useState } from "react";

// library imports
import { BanknotesIcon } from "@heroicons/react/24/outline";

const Nav = () => {
  const navigate = useNavigate();
  const [cekLogin, setCekLogin] = useState(false);

  const cekUser = async (e) => {
    try {
      const response = await axios.get("http://localhost:3000/budget/list/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const status = response.data.status;

      if (status === "success") {
        setCekLogin(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setCekLogin(false);
    }
  };

  useEffect(() => {
    cekUser();
  }, []);

  const handleLogout = () => {
    // Hapus informasi dari localStorage saat logout
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("id");

    setCekLogin(false);
    navigate("/");
  };

  return (
    <nav>
      {cekLogin ? (
        <>
          <NavLink to="/dashboard" aria-label="Go to home">
            <img src={logomark} alt="" height={26} />
            <span className="text-logo">CashFlowKeeper</span>
          </NavLink>
          <button
            to="/"
            type="button"
            className="btn btn--warning"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <NavLink to="/" aria-label="Go to home">
          <BanknotesIcon width={20} />
          <span className="text-logo">CashFlowKeeper</span>
        </NavLink>
      )}
    </nav>
  );
};
export default Nav;
