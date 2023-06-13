const express = require('express');
const router = express.Router();
const authenticateToken = require('../app.js');
// Get all products
router.get('/', (req, res) => {
  // Logic to fetch all products from the database
  res.json({ message: 'Get all products' });
});

// Get a single product
router.get('/:id', (req, res) => {
  const { id } = req.params;
  // Logic to fetch a single product by ID from the database
  res.json({ message: `Get product with ID: ${id}` });
});

// Create a new product
router.post('/',(req, res) => {
  const { name, description, price } = req.body;
  // Logic to create a new product in the database
  res.json({ message: 'Create new product' });
});

// Update a product
router.put('/:id',(req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  // Logic to update a product by ID in the database
  res.json({ message: `Update product with ID: ${id}` });
});

// Delete a product
router.delete('/:id',(req, res) => {
  const { id } = req.params;
  // Logic to delete a product by ID from the database
  res.json({ message: `Delete product with ID: ${id}` });
});

module.exports = router;
