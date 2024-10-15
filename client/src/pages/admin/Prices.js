import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Prices() {
  const [prices, setPrices] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [price, setPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction pour récupérer les prix existants
  const fetchPrices = () => {
    axios.get('http://localhost:3001/prices').then(response => {
      setPrices(response.data);
    });
  };

  // Fonction pour récupérer les articles
  const fetchItems = () => {
    axios.get('http://localhost:3001/items').then(response => {
      setItems(response.data);
    });
  };

  // Charger les données des articles et des prix au chargement de la page
  useEffect(() => {
    fetchItems();
    fetchPrices();
  }, []);

  // Fonction pour créer un prix
  const createPrice = () => {
    const selectedItemObj = items.find(item => item.name === selectedItem);

    if (!selectedItemObj) {
      alert('Item not found');
      return;
    }

    axios.post('http://localhost:3001/prices', {
      id_item: selectedItemObj.id,
      price: price
    }).then(() => {
      fetchPrices(); // Mettre à jour la liste des prix
    });
  };

  // Fonction pour supprimer un prix
  const deletePrice = (id) => {
    axios.get(`http://localhost:3001/prices/delete/${id}`).then(() => {
      fetchPrices(); // Mettre à jour la liste des prix
    });
  };

  // Normaliser une chaîne de caractères pour la recherche
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtrer les prix par le terme de recherche (nom de l'item ou prix)
  const filteredPrices = prices.filter((priceObj) => {
    const search = normalizeString(searchTerm);
    
    // Trouver l'article correspondant à ce prix
    const item = items.find(item => item.id === priceObj.id_item);

    // Comparer le nom de l'article ou le prix avec le terme de recherche
    return (
      (item && normalizeString(item.name).includes(search)) ||
      normalizeString(priceObj.price.toString()).includes(search)
    );
  });

  return (
    <div>
      <h1>Prices</h1>

      <div>
        {/* Liste déroulante des articles */}
        <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
          <option value="">Select an item</option>
          {items.map((item, key) => (
            <option key={key} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button onClick={createPrice}>Set Price</button>
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by item name or price"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h2>Existing Prices</h2>
      {/* Affichage des prix filtrés */}
      {filteredPrices.map((priceObj, key) => {
        const item = items.find(item => item.id === priceObj.id_item);
        return (
          <div key={key}>
            {item ? item.name : 'Unknown Item'}: {priceObj.price}€
            <button onClick={() => deletePrice(priceObj.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}

export default Prices;
