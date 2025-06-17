const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");

const app = express();
const __dirname=path.resolve();


app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ✅ Schema
const logSchema = new mongoose.Schema({
  type: String,
  message: String,
  route: String,
  timestamp: Date,
});

// ✅ Explicitly set collection to 'logentries'
const Log = mongoose.model('Log', logSchema, 'logentries');

// ✅ Route to get logs
app.get('/api/read-log', async (req, res) => {
  try {
    const logs = await Log.find({ type: 'log' });
    res.json({ logs });
  } catch (error) {
    console.error("Error in /api/read-log:", error);
    res.status(500).json({ error: 'Error fetching logs' });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../logsfrontend/build")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../logsfrontend", "build", "index.html"));
    });
  }
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
