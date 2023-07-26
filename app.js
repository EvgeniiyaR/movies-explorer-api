require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const limiter = require('./utils/limiter');

const routes = require('./routes');

const { PORT_DEV, DB_URL_DEV } = require('./utils/constants');

const { NODE_ENV, PORT_PROD, DB_URL_PROD } = process.env;

const app = express();

app.use(helmet());

app.use(cors({
  origin: 'movies.evgeniiyar.nomoreparties.sbs',
  credentials: true,
}));

app.use(cookieParser());

app.use(limiter);

mongoose.connect(NODE_ENV === 'production' ? DB_URL_PROD : DB_URL_DEV, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(routes);

app.listen(NODE_ENV === 'production' ? PORT_PROD : PORT_DEV);
