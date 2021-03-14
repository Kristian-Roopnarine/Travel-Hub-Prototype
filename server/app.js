const express = require('express');
const app = express();
const cors = require('cors');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRoutes');
const itineraryRouter = require('./routes/itineraryRoutes');
const placesRouter = require('./routes/placesRoutes');
const lodgeRouter = require('./routes/lodgeRoutes');
const cityRouter = require('./routes/cityRoutes');
const { protect } = require('./controllers/authController');
const passport = require('passport');
require('./passport-google');

app.use(express.json());
if (process.env.NODE_ENV === 'dev') {
  app.use(morgan('dev'));
}
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());

app.get('/', (req, res, next) => {
  res.status(200).json({
    status: 'Success',
    message: 'App running',
  });
});
app.get('/test-jwt', protect, (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Your jwt is valid',
  });
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/itinerary', itineraryRouter);
app.use('/api/v1/place', placesRouter);
app.use('/api/v1/lodge', lodgeRouter);
app.use('/api/v1/city', cityRouter);

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
