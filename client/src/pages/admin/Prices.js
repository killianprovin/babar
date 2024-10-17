import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Grid, Autocomplete } from '@mui/material';

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

  const handleItemSelect = (event, value) => {
    setSelectedItem(value);
  };

  return (
    <Container>
      {/* Formulaire pour créer un prix */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {/* Autocomplete pour sélectionner un article */}
            <Autocomplete
              disablePortal
              options={items.map(item => item.name)}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Select Item" />}
              onChange={handleItemSelect}  // Gère la sélection de l'item
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField 
              type="number"
              label="Enter Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth 
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={createPrice}
              fullWidth
              size="small"  // Bouton de petite taille
            >
              Set Price
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search by item name or price"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      
      {/* Affichage des prix filtrés */}
      {filteredPrices.map((priceObj, key) => {
        const item = items.find(item => item.id === priceObj.id_item);
        return (
          <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="body1">
              {item ? item.name : 'Unknown Item'}: {priceObj.price}€
            </Typography>
            <Button 
              variant="outlined" 
              color="error"  // Couleur rouge pour le bouton de suppression
              onClick={() => deletePrice(priceObj.id)}
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

export default Prices;
