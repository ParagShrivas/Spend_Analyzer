import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ExpenseProvider } from "./context/ExpenseContext";
import Sidebar from './components/sideBar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Expense from './pages/expense';
import Analytics from './pages/analytics';
import Budget from './pages/budget';
import Reminders from './pages/reminders';
import Reports from './pages/reports';
import ScrollToTop from "./components/ScrollToTop";
import Settings from './pages/settings';
import Profile from './pages/profile';

function App() {
  return (
    <>
      <Router>
        <ExpenseProvider>
          <Sidebar />
          <ScrollToTop />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/expenses' element={<Expense />} />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/budget' element={<Budget />} />
            <Route path='/reminders' element={<Reminders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </ExpenseProvider>
      </Router>
    </>
  );
}

export default App;
