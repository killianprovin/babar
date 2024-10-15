import React from 'react';
import './Sidebar.css';
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/admin/customers">Customers</Link></li>
                <li><Link to="/admin/categories">Categories</Link></li>
                <li><Link to="/admin/items">Items</Link></li>
                <li><Link to="/admin/prices">Prices</Link></li>
                <li><Link to="/admin/deposits">Deposits</Link></li>
                <li><Link to="/admin/purchases">Purchases</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;
