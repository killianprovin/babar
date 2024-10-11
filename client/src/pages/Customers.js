import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Customers() {

  const [customers, setCustomers] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/customers').then(response => {
      setCustomers(response.data);
  });
  }, []);

  return (
    <div>
      {customers.map((value, key) => { 
        return (
          <div className='customer' onClick={() => {navigate(`/../customer/${value.id}`)}}> 
            <div className='name'>{ value.firstname } { value.lastname }</div>
          </div>
        );
      })}
    </div>
  )
}

export default Customers
