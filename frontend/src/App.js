import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/dashboard";
import Employees from "./pages/employees";
import Leads from "./pages/leads";
import Tickets from "./pages/tickets";
import ProtectedRoute from "./components/protectedroutes";
import Layout from "./components/layout";
import CreateStaff from "./pages/CreateStaff";

const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    
      <Route path="/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><Layout><Dashboard/></Layout></ProtectedRoute>}/>

      <Route path="/employees" element={<ProtectedRoute allowedRoles={["admin"]}><Layout><Employees/></Layout></ProtectedRoute>}/>

      <Route path="/leads" element={<ProtectedRoute allowedRoles={["admin","staff"]}><Layout><Leads /></Layout></ProtectedRoute>}/>

      <Route path="/tickets"element={<ProtectedRoute allowedRoles={["admin","staff"]}><Layout><Tickets /></Layout></ProtectedRoute>}/>

      <Route path="/create-staff" element={<ProtectedRoute allowedRoles={["admin"]}><Layout><CreateStaff/></Layout></ProtectedRoute>}/></Routes>
      </>
  );
};

export default App;
