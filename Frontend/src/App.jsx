import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "./App.css";
import "./index.css";
import Landing from "./pages/Landing";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";
// import Add from "./pages/Add";
// import Budget from "./pages/Budget";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFound from "./pages/NotFound";
import Layout from "./layouts/Layout";
import AccountPage from "./pages/AccountPage";
import AddTransaction from "./pages/TransactionPage";

function App() {
  const isLoggedIn = true; // temp mock

  return (
    <>
    <Routes>
      {/* Public Routes */}
      
      
      <Route element={<Layout />}> 
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
      </Route>
      
      
      {/* Protected Routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account/:id" element={<AccountPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/transaction/create" element={<AddTransaction />} />
        {/* Add more protected routes here */}
      </Route>

      {/* 404 Not found */}
      <Route path="*" element={<NotFound />} />   
    </Routes>
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick={false} pauseOnHover={false} draggable={false} progress={undefined} />
    </>
  );
}

export default App;
