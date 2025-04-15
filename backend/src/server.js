const express = require('express');
const cookieParser = require('cookie-parser')
const dotev = require('dotenv')
const app = express();
const cors = require('cors')
const path = require('path')
const authRoutes = require('./routes/authRoutes')
const eventRoutes = require('./routes/eventRoutes')
const errorHandler = require('../src/middlewares/errorHandler')


app.use(cors())
dotev.config();
app.use('/uploads', express.static(path.join(__dirname,'uploads')))
app.use(express.json()) // To parse JSON bodies
app.use(cookieParser()); // To parse cookies (necessary for accessing cookies)
// app.use(express.urlencoded())
app.use('/api/auth', authRoutes);
app.use('/api/events',eventRoutes)

app.use(errorHandler)

// app.use('/api/event')
// app.use('/api/auth',authRoutes);cd

    

app.listen(process.env.PORT || 5000, () => {
    console.log(`Example app listening on port ${process.env.PORT || 5000}`)
})