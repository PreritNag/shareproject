// // server.js
// require('dotenv').config(); // Load environment variables from .env file
// const express = require('express');
// const mongoose = require('mongoose');
// const stockRoutes = require('./routes/stockRoutes'); // Correct import of stockRoutes

// const app = express();

// // Middleware
// app.use(express.json()); // For parsing JSON requests

// // Database connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockSimulator', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('Failed to connect to MongoDB', err));

// // Use stock routes (make sure this is correctly imported)
// app.use('/api/stocks', stockRoutes); // Use the stockRoutes middleware correctly

// // Error handling for undefined routes
// app.use((req, res, next) => {
//   res.status(404).send({ message: 'Route not found' });
// });

// // Global error handler for unexpected errors
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send({ message: 'Something went wrong!' });
// });

// // Start the server
// const port = process.env.PORT || 5000;
// const server = app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// // Graceful shutdown (close MongoDB connection and stop server)
// process.on('SIGINT', async () => {
//   console.log('Shutting down server...');
//   await mongoose.connection.close();
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stockRoutes = require('./routes/stockRoutes'); // Import stockRoutes

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON requests

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stockSimulator', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);  // Exit the process with failure if MongoDB connection fails
  }
};

connectDB();

// Use stock routes
app.use('/api/stocks', stockRoutes);

// Fallback for undefined routes
app.use((req, res, next) => {
  res.status(404).send({ message: 'Route not found' });
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something went wrong!' });
});

// Start the server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown (close MongoDB connection and stop server)
const shutdown = async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);  // Handle Ctrl+C
process.on('SIGTERM', shutdown);  // Handle Docker/Kubernetes stop signal

