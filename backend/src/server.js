const express = require('express');
const cookieParser = require('cookie-parser')
const dotev = require('dotenv')
const app = express();
const cors = require('cors')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const paymentRoutes = require('../src/routes/paymentRoutes')
const errorHandler = require('../src/middlewares/errorHandler')


// app.use(cors())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials:true,
  }));
dotev.config();
console.log(__dirname)
app.use('/uploads', express.static(path.join(__dirname,'uploads')))

app.use(express.json()) // To parse JSON bodies
app.use(cookieParser()); // To parse cookies (necessary for accessing cookies)
// app.use(express.urlencoded())
app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes);
app.use('/api/payment',paymentRoutes);

app.use(errorHandler)



    

app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT || 5000}`)
})