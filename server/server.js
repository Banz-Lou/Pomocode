const express = require('express');
if (process.env !== 'production') {
  require('dotenv').config();
}

const app = express();
const { PORT } = process.env;

//Initial setup
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Pomocode listening on port ${PORT}`);
});