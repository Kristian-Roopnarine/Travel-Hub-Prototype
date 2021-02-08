const express = require('express');
const app = express();
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const morgan = require('morgan');

const authRouter = require('./routes/authRoutes');

app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    message: 'App running',
  });
});
app.use('/api/v1/auth', authRouter);
app.all('*', (req, res, next) => {
  next(
    new AppError(
      `Could not find the requested URL ${req.protocol}://${req.hostname}${req.url}`,
      404
    )
  );
});

app.use(globalErrorHandler);
module.exports = app;
