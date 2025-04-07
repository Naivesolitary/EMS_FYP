const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 3000;
const authRoutes = require('./routes/authRoutes')

app.use(express.json()) // To parse JSON bodies
app.use(cookieParser()); // To parse cookies (necessary for accessing cookies)
app.use('/api/auth', authRoutes);
// app.use('/api/auth',authRoutes);

    

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})