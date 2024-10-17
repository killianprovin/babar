import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Grid, Autocomplete } from '@mui/material';

function Items() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fonction pour récupérer les items
  const fetchItems = () => {
    axios.get('http://localhost:3001/items').then(response => {
      setItems(response.data);
    });
  };

  // Fonction pour récupérer les catégories
  const fetchCategories = () => {
    axios.get('http://localhost:3001/categories').then(response => {
      setCategories(response.data);
    });
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  // Fonction pour supprimer un item
  const deleteItem = (id) => {
    axios.get(`http://localhost:3001/items/delete/${id}`).then(() => {
      fetchItems();
    });
  };

  // Fonction pour créer un nouvel item
  const createsetItem = () => {
    let name = document.querySelector('input[name="name"]').value;

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
  };

  // Fonction de normalisation de chaîne de caractères
  const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Fonction pour filtrer les items
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

  const handleCategorySelect = (event, value) => {
    setSelectedCategory(value);
  };

  return (
    <Container>
      {/* Formulaire de création d'item */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              name="name" 
              label="Item Name" 
              fullWidth 
              variant="outlined" 
            />
          </Grid>

          {/* Autocomplete pour sélectionner une catégorie */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              disablePortal
              options={categories.map(category => category.name)}
              sx={{ width: '100%' }}
              renderInput={(params) => <TextField {...params} label="Category" />}
              onChange={handleCategorySelect}  // Gère la sélection de la catégorie
            />
          </Grid>

          {/* Bouton pour créer un item */}
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={createsetItem}
              fullWidth
              size="small"  // Bouton de petite taille
            >
              Create Item
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Champ de recherche */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search by item name or category"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* Liste des items filtrés */}
      {filteredItems.length > 0 ? (
        filteredItems.map((value, key) => { 
          // Trouver la catégorie associée à l'item
          const category = categories.find(cat => cat.id === value.id_category);

          return (
            <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
              <Typography variant="body1">
                {value.name} - {category ? category.name : 'Unknown Category'}
              </Typography>
              <Button 
                variant="outlined" 
                color="error"  // Couleur rouge pour le bouton de suppression
                onClick={() => deleteItem(value.id)}
                size="small"  // Bouton de petite taille
                sx={{ mt: 1 }}
              >
                Delete
              </Button>
            </Box>
          );
        })
      ) : (
        <Typography>No items found</Typography>
      )}
    </Container>
  );
}

export default Items;
