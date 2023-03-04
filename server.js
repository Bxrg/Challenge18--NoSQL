const mongoose = require('mongoose');
const routes = require('./routes');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/27017',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.set('debug', true);
app.use(require('./routes'));

app.listen(PORT, () => console.log(`Server running on port:${PORT}`));