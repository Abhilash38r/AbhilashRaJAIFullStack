const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log('MongoDB Connection Error: ', err));

// Routes
app.use('/api', require('./routes/authRoutes')); // Maps to /api/register and /api/login
app.use('/api/grievances', require('./routes/grievanceRoutes'));

// Basic route
app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
