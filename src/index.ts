import express from 'express';
import chessRoutes from './routes/chess';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(express.json()); // For parsing JSON request bodies

// Serve static files from the public folder
app.use(express.static('public'));

// Serve static files from node_modules
// TODO: FIXME! This is a security risk, as it allows serving any file from node_modules
app.use('/node_modules', express.static('node_modules'));

// Use the chessRoutes for all routes related to chess moves and game interaction
app.use('/api/chess', chessRoutes);

// Fallback route for handling undefined routes
app.use('*', (req, res) => {
  res.status(404).send('Page not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});