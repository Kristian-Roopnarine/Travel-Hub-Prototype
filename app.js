const express = require('express');
const app = express();

const morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    message: 'App running',
  });
});

module.exports = app;
