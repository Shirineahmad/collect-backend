require('dotenv').config();
const { initializeApp } = require('firebase/app');
const firebaseConfig = require('./config/firebase');
const express = require('express');
const cors = require('cors');
const connection = require('./config/db');
initializeApp(firebaseConfig);

const userRoutes = require('./routes/userRoutes');
const categoryRoute = require('./routes/categoryRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/user',userRoutes);
app.use('/category', categoryRoute);

app.listen(PORT, () => {
    connection();
    console.log(`app listening on port ${PORT}`);
});
