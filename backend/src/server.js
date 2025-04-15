const express = require('express');
const cookieParser = require('cookie-parser')
const dotev = require('dotenv')
const app = express();
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const errorHandler = require('../src/middlewares/errorHandler')

dotev.config();
app.use(express.json()) // To parse JSON bodies
app.use(cookieParser()); // To parse cookies (necessary for accessing cookies)
// app.use(express.urlencoded())
app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes)

app.use(errorHandler)

// app.use('/api/event')
// app.use('/api/auth',authRoutes);

    

app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT || 5000}`)
})