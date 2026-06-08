import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Sidebar from './components/sideBar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Expense from './pages/expense';
import Analytics from './pages/analytics';
import Budget from './pages/budget';

function App() {
  return (
    <>
    <Router>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/expenses' element={<Expense/>} />
        <Route path='/analytics' element={<Analytics/>} />
        <Route path='/budget' element={<Budget/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
