require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const limiter = require('./utils/limiter');

const routes = require('./routes');

const { NODE_ENV, PORT, DB_URL } = process.env;

const app = express();

app.use(helmet());

app.use(cors({
  origin: 'movies.evgeniiyar.nomoreparties.sbs',
  credentials: true,
}));

app.use(cookieParser());

app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(routes);

app.listen(NODE_ENV === 'production' ? PORT : 3000);
