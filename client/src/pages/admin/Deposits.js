import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Grid, Autocomplete } from '@mui/material';

function Deposits() {
  const [deposits, setDeposits] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [amount, setAmount] = useState('');

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
  };

  // Fonction pour créer un dépôt
  const createsetDeposit = () => {
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
  };

  // Normaliser une chaîne de caractères pour la recherche
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtrer les dépôts selon le terme de recherche
  const filteredDeposits = deposits.filter((deposit) => {
    const search = normalizeString(searchTerm);
    const customer = customers.find(customer => customer.id === deposit.id_customer);

    return (
      normalizeString(deposit.amount.toString()).includes(search) ||
      (customer && (
        normalizeString(customer.firstname).includes(search) ||
        normalizeString(customer.lastname).includes(search) ||
        normalizeString(customer.nickname).includes(search)
      ))
    );
  });

  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);
  };

  const getCustomerName = (id_customer) => {
    const customer = customers.find(customer => customer.id === id_customer);
    return customer ? `${customer.firstname} ${customer.lastname} (${customer.nickname})` : 'Unknown Customer';
  };

  return (
    <Container>
      {/* Formulaire de création de dépôt */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="number"
              label="Amount"
              placeholder="Enter deposit amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>

          {/* Autocomplete pour sélectionner un utilisateur */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={customers.map(customer => `${customer.firstname} ${customer.lastname} ${customer.nickname}`)}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Select Customer" />}
              onChange={handleCustomerSelect}  // Gère la sélection d'un client
            />
          </Grid>

          {/* Bouton pour créer le dépôt */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={createsetDeposit}
              fullWidth
              size="small"  // Bouton de petite taille
            >
              Create Deposit
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search by deposit amount, firstname, lastname, or nickname"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Affichage des dépôts filtrés */}
      <h2>Deposits</h2>
      {filteredDeposits.map((value, key) => {
        return (
          <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="body1">
              {getCustomerName(value.id_customer)} - {value.amount}€
            </Typography>
            <Button
              variant="outlined"
              color="error"  // Couleur rouge pour le bouton de suppression
              onClick={() => deleteDeposit(value.id)}
              size="small"  // Bouton de petite taille
              sx={{ mt: 1 }}
            >
              Delete
            </Button>
          </Box>
        );
      })}
    </Container>
  );
}

export default Deposits;
