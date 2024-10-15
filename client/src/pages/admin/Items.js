import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Items() {

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchItems = () => {
      axios.get('http://localhost:3001/items').then(response => {
        setItems(response.data);
      });
  };

  const fetchCategories = () => {
      axios.get('http://localhost:3001/categories').then(response => {
        setCategories(response.data);
      });
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const deleteItem = (id) => {
      axios.get(`http://localhost:3001/items/delete/${id}`).then(() => {
        fetchItems();
      });
  }

  const createsetItem = () => {
      let name = document.querySelector('input[placeholder="name"]').value;

      // Trouver l'ID de la catégorie sélectionnée
      const selectedCategoryObj = categories.find(cat => cat.name === selectedCategory);

      if (!selectedCategoryObj) {
          alert('Category not found');
          return;
      }

      axios.post('http://localhost:3001/items', {
          name: name,
          id_category: selectedCategoryObj.id, // Utilisez l'ID de la catégorie ici
      }).then(() => {
        fetchItems();
      });
  }

  const normalizeString = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Fonction pour filtrer les items en fonction du nom de l'item ou de la catégorie
  const filteredItems = items.filter((item) => {
      const search = normalizeString(searchTerm);

      // Trouver la catégorie correspondante à l'item
      const category = categories.find(category => category.id === item.id_category);

      // Comparer à la fois le nom de l'item et le nom de la catégorie
      return (
          normalizeString(item.name).includes(search) ||
          (category && normalizeString(category.name).includes(search))
      );
  });

  const handleCategorySelect = (e) => {
    const selectedCategoryName = e.target.value;
    setSelectedCategory(selectedCategoryName);
  };

  return (
      <div>
          <h1>Items</h1>

          <div>
              <input type="text" placeholder="name" />
              
              {/* Liste déroulante des catégories */}
              <select value={selectedCategory} onChange={handleCategorySelect}>
                  <option value="">Select a category</option>
                  {categories.map((category, key) => (
                      <option key={key} value={category.name}>
                          {category.name}
                      </option>
                  ))}
              </select>

              <button onClick={createsetItem}>Create</button>
          </div>

          <div>
              <input
                  type="text"
                  placeholder="Search by item name or category"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {filteredItems.map((value, key) => { 
              // Trouver la catégorie associée à l'item
              const category = categories.find(cat => cat.id === value.id_category);

              return (
                  <div key={key}> 
                      <div>
                          { value.name } - { category ? category.name : 'Unknown Category' } 
                          <button onClick={() => deleteItem(value.id)}>Delete</button>
                      </div>
                  </div>
              );
          })}
      </div>
  )
}

export default Items;
