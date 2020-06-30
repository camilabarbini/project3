const express = require('express');
const server = express();
const bodyParser = require('body-parser');

require('./database/index');
require('./authorization');

const products = require('./routes/products');
const orders = require('./routes/orders');
const users = require('./routes/users');

server.use(bodyParser.json());
server.use('/productos', products);
server.use('/pedidos', orders);
server.use('/usuarios', users);

server.listen(3000, () => {
    console.log('servidor iniciado...');
});



