import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Customers from './Customers';
import Items from './Items';
import Prices from './Prices';
import Deposits from './Deposits';
import Purchases from './Purchases';
import Categories from './Categories';
import './Admin.css'; // Assurez-vous que ce fichier est bien importé

import Navbar from './Navbar';

function Admin() {
  return (
    <div className="admin-container">
        <Navbar />
        
        <div className="content">
            <Routes>
                <Route path="" element={<Customers />} />
                <Route path="categories" element={<Categories />} />
                <Route path="items" element={<Items />} />
                <Route path="prices" element={<Prices />} />
                <Route path="deposits" element={<Deposits />} />
                <Route path="purchases" element={<Purchases />} />
            </Routes>
        </div>
    </div>
  );
}

export default Admin;
