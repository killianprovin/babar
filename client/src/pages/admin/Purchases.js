import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Purchases() {

  const [purchases, setPurchases] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Fonction pour récupérer les achats
  const fetchPurchases = () => {
      axios.get('http://localhost:3001/purchases').then(response => {
        setPurchases(response.data);
      });
  };

  // Fonction pour récupérer les clients
  const fetchCustomers = () => {
    axios.get('http://localhost:3001/customers').then(response => {
        setCustomers(response.data);
    });
  };

  // Fonction pour récupérer les items
  const fetchItems = () => {
    axios.get('http://localhost:3001/items').then(response => {
        setItems(response.data);
    });
  };

  // Appel des API pour récupérer les données lors du chargement du composant
  useEffect(() => {
    fetchPurchases();
    fetchCustomers();
    fetchItems();
  }, []);

  // Fonction pour supprimer un achat
  const deletePurchase = (id) => {
      axios.get(`http://localhost:3001/purchases/delete/${id}`).then(() => {
        fetchPurchases();
      });
  }

  // Fonction pour créer un achat
  const createPurchase = () => {
      // Trouver l'utilisateur et l'article sélectionnés
      const selectedCustomerObj = customers.find(customer => 
        `${customer.firstname} ${customer.lastname} (${customer.nickname})` === selectedCustomer
      );
      const selectedItemObj = items.find(item => item.name === selectedItem);

      if (!selectedCustomerObj || !selectedItemObj) {
          alert('Customer or Item not found');
          return;
      }

      axios.post('http://localhost:3001/purchases', {
          id_customer: selectedCustomerObj.id,
          id_item: selectedItemObj.id,
          quantity: quantity,
      }).then(() => {
        fetchPurchases();
      });
  }

  // Normaliser une chaîne de caractères pour la recherche
  const normalizeString = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtrer les achats selon le terme de recherche (par client ou article)
  const filteredPurchases = purchases.filter((purchase) => {
      const search = normalizeString(searchTerm);

      // Trouver le client correspondant à ce purchase
      const customer = customers.find(customer => customer.id === purchase.id_customer);
      // Trouver l'item correspondant à ce purchase
      const item = items.find(item => item.id === purchase.id_item);

      // Comparer la quantité, le prénom, le nom, le surnom du client et le nom de l'article
      return (
          normalizeString(purchase.quantity.toString()).includes(search) ||
          (customer && (
              normalizeString(customer.firstname).includes(search) ||
              normalizeString(customer.lastname).includes(search) ||
              normalizeString(customer.nickname).includes(search)
          )) ||
          (item && normalizeString(item.name).includes(search))
      );
  });

  // Trouver les informations du client basé sur l'ID
  const getCustomerName = (id_customer) => {
    const customer = customers.find(customer => customer.id === id_customer);
    if (customer) {
      return `${customer.firstname} ${customer.lastname} (${customer.nickname})`;
    }
    return 'Unknown Customer';
  };

  // Trouver les informations de l'item basé sur l'ID
  const getItemName = (id_item) => {
    const item = items.find(item => item.id === id_item);
    if (item) {
      return item.name;
    }
    return 'Unknown Item';
  };

  return (
      <div>
          <h1>Purchases</h1>

          <div>
              <input 
                  type="number" 
                  placeholder="quantity" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
              />
              
              {/* Liste déroulante des utilisateurs */}
              <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
                  <option value="">Select a customer</option>
                  {customers.map((customer, key) => (
                      <option 
                          key={key} 
                          value={`${customer.firstname} ${customer.lastname} (${customer.nickname})`}>
                          {`${customer.firstname} ${customer.lastname} (${customer.nickname})`}
                      </option>
                  ))}
              </select>

              {/* Liste déroulante des items */}
              <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                  <option value="">Select an item</option>
                  {items.map((item, key) => (
                      <option key={key} value={item.name}>
                          {item.name}
                      </option>
                  ))}
              </select>

              <button onClick={createPurchase}>Create Purchase</button>
          </div>

          <div>
              <input
                  type="text"
                  placeholder="Search by quantity, customer name, or item name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {/* Affichage des achats filtrés */}
          {filteredPurchases.map((value, key) => { 
              return (
                  <div key={key}> 
                      <div>
                          Item: { getItemName(value.id_item) }, Customer: { getCustomerName(value.id_customer) }, Quantity: { value.quantity }
                          <button onClick={() => deletePurchase(value.id)}>Delete</button>
                      </div>
                  </div>
              );
          })}
      </div>
  );
}

export default Purchases;
