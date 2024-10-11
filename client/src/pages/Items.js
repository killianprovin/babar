import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

function Items() {

  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/items').then(response => {
      setItems(response.data);
  });
  }, []);

  return (
    <div>
      {items.map((value, key) => { 
        return (
          <div className='customer'> 
            <div className='name'>{ value.name }</div>
          </div>
        );
      })}
    </div>
  )
}

export default Items
