import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  // État pour le terme de recherche
  let navigate = useNavigate();

  // Récupérer les clients depuis l'API
  useEffect(() => {
    axios.get('http://localhost:3001/customers').then(response => {
      setCustomers(response.data);
    });
  }, []);

  // Fonction pour normaliser les chaînes de caractères pour la recherche
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtrer les clients en fonction du terme de recherche
  const filteredCustomers = customers.filter((customer) => {
    const search = normalizeString(searchTerm);
    return (
      normalizeString(customer.firstname).includes(search) ||
      normalizeString(customer.lastname).includes(search) ||
      normalizeString(customer.nickname).includes(search) ||
      normalizeString(customer.year.toString()).includes(search) ||
      normalizeString(customer.status).includes(search)
    );
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Champ de recherche */}
      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}  // Mettre à jour le terme de recherche
        sx={{ mb: 4 }}  // Ajouter une marge inférieure
      />

      {/* Liste des clients filtrés */}
      <List>
        {filteredCustomers.map((value, key) => (
          <ListItem key={key} disablePadding>
            <ListItemButton onClick={() => navigate(`/customer/${value.id}`)}>
              <ListItemText 
                primary={`${value.firstname} ${value.lastname}`} 
                sx={{ textTransform: 'capitalize' }}  // Capitaliser les noms
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Message si aucun client n'est trouvé */}
      {filteredCustomers.length === 0 && (
        <Typography variant="body1" color="textSecondary">
          No customers found
        </Typography>
      )}
    </Box>
  );
}

export default Customers;
