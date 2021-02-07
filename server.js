const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config');

process.on('uncaughtException', (err) => {
  console.log('Uncaught exception. Shutting down...');
  console.log(err.name, err.message);
});

const port = config.app.port;

mongoose
  .connect(config.db.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Connection to database successful'));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('Unhandled rejection.');
  server.close(() => {
    process.exit(1);
  });
});
