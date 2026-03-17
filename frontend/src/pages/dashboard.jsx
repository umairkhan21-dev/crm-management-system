import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployee: 0,
    totalLeads: 0,
    openTickets: 0,
    inProgressTickets: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="dashboard-layout">
      
      <div className="dashboard-main">
       

        <div className="dashboard-content">
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of CRM Activity</p>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{stats.totalEmployee}</div>
              <div className="stat-label">Total Employees</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{stats.totalLeads}</div>
              <div className="stat-label">Total Leads</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{stats.openTickets}</div>
              <div className="stat-label">Open Tickets</div>
            </div>

            <div className="stat-card">
              <div className="stat-number">{stats.inProgressTickets}</div>
              <div className="stat-label">In Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
