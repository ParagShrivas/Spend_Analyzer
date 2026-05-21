import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Sidebar from './components/sideBar';
import Home from './pages/home';
import Login from './pages/login';
import Register from './pages/register';
import Expense from './pages/expense';

function App() {
  return (
    <>
    <Router>
      <Sidebar />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/expenses' element={<Expense/>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
