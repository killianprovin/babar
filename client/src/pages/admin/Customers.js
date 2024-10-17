import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Button, Checkbox, Box, Typography, Container, Grid, FormControlLabel } from '@mui/material';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCustomers = () => {
    axios.get('http://localhost:3001/customers').then((response) => {
      setCustomers(response.data);
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const deleteCustomer = (id) => {
    axios.get(`http://localhost:3001/customers/delete/${id}`).then(() => {
      fetchCustomers();
    });
  };

  const createCustomer = () => {
    let firstname = document.querySelector('input[name="firstname"]').value;
    let lastname = document.querySelector('input[name="lastname"]').value;
    let nickname = document.querySelector('input[name="nickname"]').value;
    let year = document.querySelector('input[name="year"]').value;
    let barman = document.querySelector('input[name="barman"]').checked;
    let status = document.querySelector('input[name="status"]').value;

    axios
      .post('http://localhost:3001/customers', {
        firstname: firstname,
        lastname: lastname,
        nickname: nickname,
        year: year,
        barman: barman,
        status: status
      })
      .then(() => {
        fetchCustomers();
      });
  };

  const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

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
    <Container>
      {/* Form Section */}
      <Box component="form" sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item sm={2}>
            <TextField name="firstname" label="First Name" fullWidth variant="outlined" />
          </Grid>
          <Grid item sm={2}>
            <TextField name="lastname" label="Last Name" fullWidth variant="outlined" />
          </Grid>
          <Grid item sm={2}>
            <TextField name="nickname" label="Nickname" fullWidth variant="outlined" />
          </Grid>
          <Grid item sm={2}>
            <TextField name="year" label="Year" fullWidth variant="outlined" type="number" />
          </Grid>
          <Grid item sm={2}>
            <TextField name="status" label="Status" fullWidth variant="outlined" />
          </Grid>
          <Grid item sm={2}>
            <FormControlLabel control={<Checkbox name="barman" />} label="Barman" />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" onClick={createCustomer} sx={{ mt: 2 }}>
          Create Customer
        </Button>
      </Box>

      {/* Search Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search by firstname, lastname, or nickname"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {/* List of Customers */}
      {filteredCustomers.length > 0 ? (
        filteredCustomers.map((value, key) => (
          <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
            <Typography variant="body1">
              {value.firstname} {value.lastname} {value.nickname} {value.year} {value.status}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              onClick={() => deleteCustomer(value.id)}
              sx={{ mt: 1 }}
            >
              Delete
            </Button>
          </Box>
        ))
      ) : (
        <Typography>No customers found</Typography>
      )}
    </Container>
  );
}

export default Customers;
