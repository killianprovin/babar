import './App.css';
import {BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './pages/Home';
import Customers from './pages/Customers';
import Customer from './pages/Customer';
import Items from './pages/Items';
import Admin from './pages/admin/Admin';

function App() {
  return (

    <Router >
        <header>
          <div className='nav'>
            <img src='/babar-transparent.png' alt='logo' />
            <Link to="/">Home</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/items">Items</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </header>
        <h1>Bar</h1>
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="customers" element={<Customers />} />
                <Route path="/customer/:id" element={<Customer/>}/>
                <Route path="items" element={<Items />} />
                <Route path="admin/*" element={<Admin />} />
            </Routes>
        </div>
    </Router >

  );
}

export default App;
