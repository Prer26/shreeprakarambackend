import express from 'express';
import reviewRoutes from './routes/reviewRoutes.js'; // Adjust path as necessary

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
