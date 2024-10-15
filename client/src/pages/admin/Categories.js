import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';

function Categories() {
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');


    const fetchCategories = () => {
        axios.get('http://localhost:3001/categories').then(response => {
            setCategories(response.data);
        });
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    const deleteCategorie = (id) => {
        axios.get(`http://localhost:3001/categories/delete/${id}`).then(() => {
            fetchCategories();
        });
    }

    const createCategorie = () => {
        let name = document.querySelector('input[placeholder="name"]').value;

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
        <div>
            <h1>Categories</h1>

            <div>
                <input type="text" placeholder="name" />

                <button onClick={createCategorie}>Create</button>
            </div>

            <div>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredCategories.map((value, key) => { 
                return (
                    <div key={key}> 
                        <div>
                            { value.name }
                            <button onClick={() => deleteCategorie(value.id)}>Delete</button>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default Categories
