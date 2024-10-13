const express = require('express');
const { auth } = require('express-openid-connect');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const config = {
  authRequired: false, // Activer l'authentification uniquement sur certaines routes
  auth0Logout: true,
  secret: "reofjiuerjfiujeriujfierjfiujerijfiuerf",
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  clientSecret: process.env.CLIENT_SECRET,
  authorizationParams: {
    redirect_uri: 'http://localhost:3001/',
  },
};

app.use(auth(config));

const db = require('./models');

// Routers (ajoutez une protection si nécessaire sur certaines routes)
const categoryRouter = require('./routes/Categories');
app.use('/categories', categoryRouter);

const customerRouter = require('./routes/Customers');
app.use('/customers', customerRouter);

const itemRouter = require('./routes/Items');
app.use('/items', itemRouter);

const priceRouter = require('./routes/Prices');
app.use('/prices', priceRouter);

const depositRouter = require('./routes/Deposits');
app.use('/deposits', depositRouter);

const purchaseRouter = require('./routes/Purchases');
app.use('/purchases', purchaseRouter);

// Route d'exemple pour vérifier l'authentification
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// Exemples de routes protégées
app.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send(JSON.stringify(req.oidc.user));
  } else {
    res.status(401).send('You are not authenticated');
  }
});


db.sequelize.sync().then(() => {
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
});
