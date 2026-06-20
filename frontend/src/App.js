import "./App.css";
import {
     BrowserRouter as Router,
     Routes,
     Route,
     Navigate,
     Outlet
} from "react-router-dom";

import { ExpenseProvider } from "./context/ExpenseContext";
import { LoginProvider, useLogin } from "./context/LoginContext";

import Sidebar from "./components/sideBar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Expense from "./pages/expense";
import Analytics from "./pages/analytics";
import Budget from "./pages/budget";
import Reminders from "./pages/reminders";
import Reports from "./pages/reports";
import Settings from "./pages/settings";
import Profile from "./pages/profile";

function ProtectedLayout() {
     const { user, checkingLogin } = useLogin();

     if (checkingLogin) {
          return (
               <div className="app-loading">
                    <div className="settings-loader"></div>
                    <p>Checking login...</p>
               </div>
          );
     }

     if (!user) {
          return <Navigate to="/login" replace />;
     }

     return (
          <ExpenseProvider>
               <Sidebar />
               <ScrollToTop />

               <main className="app-main-content">
                    <Outlet />
               </main>
          </ExpenseProvider>
     );
}

function App() {
     return (
          <Router>
               <LoginProvider>
                    <Routes>
                         {/* Public pages */}
                         <Route path="/" element={<Home />} />
                         <Route path="/login" element={<Login />} />
                         <Route path="/register" element={<Register />} />

                         {/* Protected pages */}
                         <Route element={<ProtectedLayout />}>
                              <Route path="/dashboard" element={<Dashboard />} />
                              <Route path="/expenses" element={<Expense />} />
                              <Route path="/analytics" element={<Analytics />} />
                              <Route path="/budget" element={<Budget />} />
                              <Route path="/reminders" element={<Reminders />} />
                              <Route path="/reports" element={<Reports />} />
                              <Route path="/settings" element={<Settings />} />
                              <Route path="/profile" element={<Profile />} />
                         </Route>

                         {/* Invalid URL */}
                         <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
               </LoginProvider>
          </Router>
     );
}

export default App;