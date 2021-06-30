const express = require('express');
const app = express();
require('dotenv').config()

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");

const cookieParser = require('cookie-parser');
const cors = require('cors'); 


// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

// port
const port = process.env.PORT || 8000;

// starting server
app.listen(port, ()=>{
    console.log(`App is running at ${port}`);
})