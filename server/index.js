const express = require('express'); // Import the Express framework
const cors = require('cors');
require('dotenv').config();


const app = express(); // Initialize an Express application
const port = process.env.PORT || 5000; // Define the port for the server, using environment variable or default to 3000

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
  res.send('Hello World from Express!'); // Send a response to the client
});

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies

// Import and use routes
const exampleRoutes = require('./routes/example');
app.use('/api/example', exampleRoutes);

// Root route (optional)
app.get('/', (req, res) => {
  res.send('API is running!');
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
