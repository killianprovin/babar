import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText } from '@mui/material';

function Customer() {
    let { id } = useParams();
    const [customer, setCustomer] = useState({});

    useEffect(() => {
      axios.get(`http://localhost:3001/customers/byId/${id}`).then(response => {
        setCustomer(response.data);
      });
    }, [id]);

    return (
      <Box sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Informations principales */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Infos
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Nom" secondary={customer.firstname || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Prénom" secondary={customer.lastname || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Surnom" secondary={customer.nickname || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Promo" secondary={customer.year || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Status" secondary={customer.status || '-'} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Montant investi" secondary={`${customer.amount_invested || 0} €`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Découvert autorisé" secondary={`${customer.allowed_overdraft || 0} €`} />
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Solde" secondary={`${customer.balance || 0} €`} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Achats (inversé avec Dépôts) */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Achats
                </Typography>
                <List>
                  {customer.purchases && customer.purchases.map((purchase, key) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={`${purchase.price} €`}
                        secondary={`${purchase.quantity} x ${purchase.item}`}
                        tertiary={new Date(purchase.createdAt).toLocaleString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      />
                    </ListItem>
                  ))}
                  {(!customer.purchases || customer.purchases.length === 0) && (
                    <Typography variant="body2" color="textSecondary">
                      Aucun achat trouvé.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Dépôts (inversé avec Achats) */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" gutterBottom>
                  Dépôts
                </Typography>
                <List>
                  {customer.deposits && customer.deposits.map((deposit, key) => (
                    <ListItem key={key}>
                      <ListItemText
                        primary={`${deposit.amount} €`}
                        secondary={new Date(deposit.createdAt).toLocaleString('fr-FR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      />
                    </ListItem>
                  ))}
                  {(!customer.deposits || customer.deposits.length === 0) && (
                    <Typography variant="body2" color="textSecondary">
                      Aucun dépôt trouvé.
                    </Typography>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
}

export default Customer;
