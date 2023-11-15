require('dotenv').config();
const express = require('express');
const cors = require('cors');
const spotifyRoutes = require('./routes/spotifyRoutes');
const axios = require('axios');

const app = express();

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Add this line to parse JSON payloads


// Routes
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

app.use('/api/spotify', spotifyRoutes);


// Server setup
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

