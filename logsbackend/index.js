const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and Model
const logSchema = new mongoose.Schema({
  type: String,
  message: String,
  route: String,
  timestamp: Date,
});
const Log = mongoose.model('Log', logSchema, 'logentries');

// API Route
app.get('/api/read-log', async (req, res) => {
  try {
    const logs = await Log.find({ type: 'log' });
    res.json({ logs });
  } catch (error) {
    console.error("Error in /api/read-log:", error);
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

// Serve static files from React app
const frontendBuildPath = path.join(__dirname, '../logsfrontend/build');
app.use(express.static(frontendBuildPath));

// Handle React routing - return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${frontendBuildPath}`);
});