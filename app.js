const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const mongoose = require('mongoose');
const products = require("./routes/products");
// Set up Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function startApplication() {
  try {
    app.use('/protected/products', products);
  } catch (error) {
    console.log(error)
  }
}

startApplication();


mongoose.connect('mongodb://localhost/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Route for user registration
app.post('/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
const secret_key = "secretbaba"
// Route for user login and generating JWT
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, secret_key, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Protected route that requires JWT authentication
app.get('/protected', authenticateToken,(req, res) => {
  //console.log(req);
  res.json({ message: 'Protected route accessed successfully.' });
});

// Middleware to authenticate JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'].split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // Unauthorized
  }
  
  jwt.verify(token, secret_key, (err, decoded) => {
    if (err) {
        console.log(err)
      return res.sendStatus(403);
       // Forbidden
    }

    req.user = decoded;
    next();
  });
}

// Start the server
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

module.exports =  {authenticateToken};