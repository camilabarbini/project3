const express = require('express');
const server = express();
const bodyParser = require('body-parser');

require('./database/index');
require('./authorization');
//require('./database/setup');
const products = require('./routes/products');

server.use(bodyParser.json());

server.listen(3000, () => {
    console.log('servidor iniciado...');
});

server.use(bodyParser.json());

server.use('/productos', products);


