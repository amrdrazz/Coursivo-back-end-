require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authControllers = require('./controllers/authControllers');
const authMiddleware = require('./middleware/authMinddleware')

const app = express();

const cors = require('cors');

app.use(cors({
  origin: ["http://localhost:5173", "https://coursivo-roan.vercel.app"],
  credentials: true
}));

// middleware
app.use(express.json());
app.use(cookieParser())

// connect DB
mongoose.connect(process.env.DATABASE_URI)
  .then((result) => {
    console.log('connected to DB');
  })
  .catch((err) => console.log(err));

// routes


app.post('/signup', authControllers.signup);
app.post('/verify', authControllers.verify);
app.post('/login', authControllers.login);
app.get('/auth-me', authMiddleware, (req, res) => {
  res.json({
    authenticated: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      enrolledCourses: req.user.enrolledCourses
    }
  });
});


module.exports = app;