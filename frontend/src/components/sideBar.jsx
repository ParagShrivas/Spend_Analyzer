import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/sidebar.css';

const Sidebar = () => {
     const navigate = useNavigate();

     return (
          <>
               <div className="sidebar">

                    {/* Logo */}
                    <div className="logo-box">
                         <i className="fa-solid fa-wallet"></i>
                         <h3>Spend Analyzer</h3>
                    </div>

                    {/* Menu */}
                    <div className="menu">

                         <div className="menu-item" onClick={() => navigate("/")}>
                              <i className="fa-solid fa-chart-pie"></i>
                              <span>Dashboard</span>
                         </div>

                         <div className="menu-item" onClick={() => navigate("/expenses")}>
                              <i className="fa-solid fa-money-bill-trend-up"></i>
                              <span>Expenses</span>
                         </div>

                         <div className="menu-item" onClick={() => navigate("/analytics")}>
                              <i className="fa-solid fa-chart-line"></i>
                              <span>Analytics</span>
                         </div>

                         <div className="menu-item" onClick={() => navigate("/budget")}>
                              <i className="fa-solid fa-wallet"></i>
                              <span>Budget</span>
                         </div>

                         <div className="menu-item" onClick={() => navigate("/transactions")}>
                              <i className="fa-solid fa-receipt"></i>
                              <span>Transactions</span>
                         </div>

                         <div className="menu-item" onClick={() => navigate("/settings")}>
                              <i className="fa-solid fa-gear"></i>
                              <span>Settings</span>
                         </div>

                    </div>

                    {/* Profile */}
                    <div className="profile-box menu-item" onClick={() => navigate("/login")}>
                         <i className="fas fa-user"></i>
                         <span>Profile</span>
                    </div>

               </div>
          </>
     );
};

export default Sidebar;