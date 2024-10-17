import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Grid, Autocomplete } from '@mui/material';

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
  };

  // Fonction pour créer un achat
  const createPurchase = () => {
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
      // Réinitialiser les champs après création
      setSelectedCustomer('');
      setSelectedItem('');
      setQuantity(1);
    });
  };

  // Fonction de normalisation de chaîne de caractères pour la recherche
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtrer les achats selon le terme de recherche
  const filteredPurchases = purchases.filter((purchase) => {
    const search = normalizeString(searchTerm);

    const customer = customers.find(customer => customer.id === purchase.id_customer);
    const item = items.find(item => item.id === purchase.id_item);

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

  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);
  };

  const handleItemSelect = (event, value) => {
    setSelectedItem(value);
  };

  const getCustomerName = (id_customer) => {
    const customer = customers.find(customer => customer.id === id_customer);
    return customer ? `${customer.firstname} ${customer.lastname} (${customer.nickname})` : 'Unknown Customer';
  };

  const getItemName = (id_item) => {
    const item = items.find(item => item.id === id_item);
    return item ? item.name : 'Unknown Item';
  };

  return (
    <Container>
      {/* Formulaire de création d'achat */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              variant="outlined"
            />
          </Grid>

          {/* Autocomplete pour sélectionner un client */}
          <Grid item xs={12} sm={5}>
            <Autocomplete
              disablePortal
              options={customers.map(customer => `${customer.firstname} ${customer.lastname} (${customer.nickname})`)}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Select Customer" />}
              onChange={handleCustomerSelect}  // Gérer la sélection d'un client
              value={selectedCustomer}
            />
          </Grid>

          {/* Autocomplete pour sélectionner un item */}
          <Grid item xs={12} sm={4}>
            <Autocomplete
              disablePortal
              options={items.map(item => item.name)}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Select Item" />}
              onChange={handleItemSelect}  // Gérer la sélection d'un item
              value={selectedItem}
            />
          </Grid>

          {/* Bouton pour créer l'achat */}
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={createPurchase}
              fullWidth
              size="small"  // Bouton de petite taille
            >
              Create Purchase
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search by quantity, customer name, or item name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Affichage des achats filtrés */}
      {filteredPurchases.map((value, key) => (
        <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
          <Typography variant="body1">
          {value.quantity} {getItemName(value.id_item)}, {getCustomerName(value.id_customer)}
          </Typography>
          <Button 
            variant="outlined" 
            color="error"  // Couleur rouge pour le bouton de suppression
            onClick={() => deletePurchase(value.id)}
            size="small"  // Bouton de petite taille
            sx={{ mt: 1 }}
          >
            Delete
          </Button>
        </Box>
      ))}
    </Container>
  );
}

export default Purchases;
