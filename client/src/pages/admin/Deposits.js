import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Deposits() {

  const [deposits, setDeposits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // Fonction pour récupérer les dépôts
  const fetchDeposits = () => {
      axios.get('http://localhost:3001/deposits').then(response => {
        setDeposits(response.data);
      });
  };

  // Fonction pour récupérer les utilisateurs (customers)
  const fetchCustomers = () => {
    axios.get('http://localhost:3001/customers').then(response => {
        setCustomers(response.data);
    });
  };

  // Appel des API pour récupérer les données lors du chargement du composant
  useEffect(() => {
    fetchDeposits();
    fetchCustomers();
  }, []);

  // Fonction pour supprimer un dépôt
  const deleteDeposit = (id) => {
      axios.get(`http://localhost:3001/deposits/delete/${id}`).then(() => {
        fetchDeposits();
      });
  }

  // Fonction pour créer un dépôt
  const createsetDeposit = () => {
      let amount = document.querySelector('input[placeholder="amount"]').value;

      // Trouver l'utilisateur sélectionné
      const selectedCustomerObj = customers.find(customer => 
        `${customer.firstname} ${customer.lastname} ${customer.nickname}` === selectedCustomer
      );

      if (!selectedCustomerObj) {
          alert('Customer not found');
          return;
      }

      axios.post('http://localhost:3001/deposits', {
          id_customer: selectedCustomerObj.id,
          amount: amount,
      }).then(() => {
        fetchDeposits();
      });
  }

  // Normaliser une chaîne de caractères pour la recherche
  const normalizeString = (str) => {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtrer les dépôts selon le terme de recherche (sur le montant, prénom, nom ou surnom du client)
  const filteredDeposits = deposits.filter((deposit) => {
      const search = normalizeString(searchTerm);

      // Trouver le client correspondant à ce dépôt
      const customer = customers.find(customer => customer.id === deposit.id_customer);

      // Comparer le montant du dépôt et les informations du client (prénom, nom, surnom)
      return (
          normalizeString(deposit.amount.toString()).includes(search) ||
          (customer && (
              normalizeString(customer.firstname).includes(search) ||
              normalizeString(customer.lastname).includes(search) ||
              normalizeString(customer.nickname).includes(search)
          ))
      );
  });

  // Gestion de la sélection d'un utilisateur
  const handleCustomerSelect = (e) => {
    const selectedCustomerName = e.target.value;
    setSelectedCustomer(selectedCustomerName);
  };

  const getCustomerName = (id_customer) => {
    const customer = customers.find(customer => customer.id === id_customer);
    if (customer) {
      return `${customer.firstname} ${customer.lastname} (${customer.nickname})`;
    }
    return 'Unknown Customer';
  };

  return (
      <div>
          <h1>Deposits</h1>

          <div>
              <input type="number" placeholder="amount" />
              
              {/* Liste déroulante des utilisateurs */}
              <select value={selectedCustomer} onChange={handleCustomerSelect}>
                  <option value="">Select a customer</option>
                  {customers.map((customer, key) => (
                      <option 
                          key={key} 
                          value={`${customer.firstname} ${customer.lastname} ${customer.nickname}`}>
                          {`${customer.firstname} ${customer.lastname} (${customer.nickname})`}
                      </option>
                  ))}
              </select>

              <button onClick={createsetDeposit}>Create</button>
          </div>

          <div>
              <input
                  type="text"
                  placeholder="Search by deposit amount, firstname, lastname, or nickname"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {/* Affichage des dépôts filtrés */}
          {filteredDeposits.map((value, key) => { 
              return (
                  <div key={key}> 
                      <div>
                          { getCustomerName(value.id_customer) } - { value.amount }€
                          <button onClick={() => deleteDeposit(value.id)}>Delete</button>
                      </div>
                  </div>
              );
          })}
      </div>
  );
}

export default Deposits;
