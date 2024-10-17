import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Container, Grid } from '@mui/material';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fonction pour récupérer les catégories
    const fetchCategories = () => {
        axios.get('http://localhost:3001/categories').then(response => {
            setCategories(response.data);
        });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Fonction pour supprimer une catégorie
    const deleteCategorie = (id) => {
        axios.get(`http://localhost:3001/categories/delete/${id}`).then(() => {
            fetchCategories();
        });
    }

    // Fonction pour créer une nouvelle catégorie
    const createCategorie = () => {
        let name = document.querySelector('input[name="name"]').value;

        axios.post('http://localhost:3001/categories', {
            name: name,
        }).then(() => {
            fetchCategories();
        });
    }

    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredCategories = categories.filter((categorie) => {
        const search = normalizeString(searchTerm);
        return (
            normalizeString(categorie.name).includes(search)
        );
    });

    return (
        <Container>
            {/* Formulaire pour créer une nouvelle catégorie */}
            <Box sx={{ mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={9}>
                        <TextField 
                            name="name" 
                            label="Category Name" 
                            fullWidth 
                            variant="outlined" 
                        />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={createCategorie}
                            fullWidth
                        >
                            Create Category
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            {/* Champ de recherche */}
            <Box sx={{ mb: 4 }}>
                <TextField
                    label="Search by name"
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            {/* Liste des catégories */}
            {filteredCategories.length > 0 ? (
                filteredCategories.map((value, key) => (
                    <Box 
                        key={key} 
                        sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}
                    >
                        <Typography variant="body1">
                            {value.name}
                        </Typography>
                        <Button 
                            variant="outlined" 
                            color="error"  // Couleur rouge pour le bouton de suppression
                            onClick={() => deleteCategorie(value.id)}
                            sx={{ mt: 1 }}
                        >
                            Delete
                        </Button>
                    </Box>
                ))
            ) : (
                <Typography>No categories found</Typography>
            )}
        </Container>
    );
}

export default Categories;
