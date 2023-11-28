require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connection = require('./config/db');
const userRoutes = require('./routes/userRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
app.use('/user',userRoutes)

app.listen(PORT, () => {
    connection();
    console.log(`app listening on port ${PORT}`);
});
