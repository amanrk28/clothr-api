require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const paymentBRoutes = require('./routes/payment');
const corsOptions = require('./config/corsOptions');

// DB Connection
let connectionString = 'mongodb://localhost:27017/tshirt';
if (process.env.ENV == 'production') {
    connectionString = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.DATABASE_URI}.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`
}

mongoose
    .connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log(`DB CONNECTED`);
    })
    .catch(() => {
        console.log('DB CONNECTION FAILED!!!');
    });

// Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);
app.use('/api', paymentBRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`App is running at ${port} on ${process.env.ENV} environment`);
});
