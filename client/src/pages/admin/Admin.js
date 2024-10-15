import React from 'react'
import { Route, Routes } from 'react-router-dom';

import Sidebar from './Sidebar'

import Customers from './Customers'
import Items from './Items'
import Prices from './Prices'
import Deposits from './Deposits'
import Purchases from './Purchases'
import Categories from './Categories';

function Admin() {
  return (
    <div>
        <Sidebar />
        <h1>Admin</h1>
        <div>
            <Routes>
                <Route path="customers" element={<Customers />} />
                <Route path="categories" element={<Categories />} />
                <Route path="items" element={<Items />} />
                <Route path="prices" element={<Prices />} />
                <Route path="deposits" element={<Deposits />} />
                <Route path="purchases" element={<Purchases />} />
            </Routes>
        </div>
    </div>
  )
}

export default Admin
