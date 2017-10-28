const express = require('express');
const app = express();
const port = process.PORT || 3000;

const morgan = require('morgan'); // HTTP request logger middleware 

app.use(morgan('dev'));

app.use('/', (req, res) => {
  res.send('First express program.')
})

app.listen(port, () => { console.log('Server up and running..') });
