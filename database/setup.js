const express = require('express');
const server = express();
const conectToDatabase = require ('../database/index');
const sequelize = conectToDatabase.sequelize;

server.listen(3000, () => {
  console.log('servidor iniciado...');
});



/***************************************CREAR TABLAS********************/
(function createProducts(){
    const query = 'CREATE TABLE PRODUCTS (productId INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(60) NOT NULL, price INT NOT NULL, img VARCHAR(160) NOT NULL)'
    createTable(query)
})();

(async function createOrders(){
    const query = 'CREATE TABLE ORDERS (orderId INT PRIMARY KEY AUTO_INCREMENT, userId INT NOT NULL, productsDetail JSON NOT NULL, status VARCHAR(60) NOT NULL, total INT NOT NULL, payloadMethod VARCHAR(60) NOT NULL, address VARCHAR(60) NOT NULL, date DATE, time TIME)'
    createTable(query)
})();

(async function createUsers(){
  const query = 'CREATE TABLE USERS (userId INT PRIMARY KEY AUTO_INCREMENT, fullName VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, password VARCHAR(60) NOT NULL, address VARCHAR(60) NOT NULL, celphone VARCHAR(60) NOT NULL, favoriteProductsById VARCHAR(60), isAdmin BOOLEAN NOT NULL DEFAULT FALSE)'
  createTable(query)
})();

(async function createStatus(){
  const query = 'CREATE TABLE STATUS (statusId INT PRIMARY KEY AUTO_INCREMENT, status VARCHAR(60) NOT NULL)'
  createTable(query)
})();

async function createTable(query){
  await sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
        .then(response=>response)
        .catch(e=>e);
}

/***************************************CARGAR PRODUCTOS********************/
let products = [
  {
    title: 'Sushi',
    price: 400,
    img: 'https://s3.eestatic.com/2015/05/11/cocinillas/Cocinillas_32506750_116175093_1706x960.jpg'
  },
  {
    title: 'Sandwich Veggie',
    price: 320,
    img: 'https://assets.bonappetit.com/photos/57aca69153e63daf11a4d915/master/pass/california-veggie-sandwich.jpg'
  },
  {   
    title: 'Hamburguesa Clásica',
    price: 350,
    img: 'https://recetinas.com/wp-content/uploads/2018/08/hamburguesas-clasicas-de-carne-picada.jpg'  
  },
  {    
    title: 'Ensalada Veggie',
    price: 340,
    img: 'https://www.madridvegano.es/wp-content/uploads/2016/05/ensalada-veggie.jpg'
  },
  {
    title: 'Veggie Abocado',
    price: 310,
    img: 'https://media-cdn.tripadvisor.com/media/photo-s/11/ed/98/a0/veggie-avocado-tomato.jpg'
  },
  {
    title: 'Panqueques con Dulce de Leche',
    price: 310,
    img: 'https://www.casanhelp.com.ar/wp-content/uploads/2017/05/1452-GR-panqueques-de-dulce-de-leche_1_web.jpg'
  },
  {
    title: 'Crema de Calabazas y Jengibre',
    price: 355,
    img: 'https://www.hola.com/imagenes/cocina/recetas/20180226120919/crema-calabaza-jengibre/0-724-626/crema-calabaza-m.jpg'
  }
]
let statusArray = ["nuevo", "confirmado", "preparando","enviando","entregado","cancelado"]


products.forEach((product,index)=>{
  let productId,title,price,img;
  productId = index+1;
  title=product.title;
  price=product.price;
  img=product.img;
  insertProduct(productId,title,price,img);
})
statusArray.forEach((element,index)=>{
  let statusId, status;
  statusId = index + 1;
  status = element;
  insertStatus(statusId,status)
})

async function insertProduct(productId,title, price, img){
  const query = 'INSERT INTO PRODUCTS (productId, title, price, img) VALUES(?,?,?,?)'
  await sequelize.query(query, {
      replacements: [productId,title, price, img],
      type: sequelize.QueryTypes.INSERT})
      .then(response=>console.log(response))
        .catch(e=>console.log(e))
}

async function insertStatus(statusId, status){
  const query = 'INSERT INTO STATUS (statusId,status) VALUES(?,?)'
  await sequelize.query(query, {
      replacements: [statusId, status],
      type: sequelize.QueryTypes.INSERT})
      .then(response=>console.log(response))
      .catch(e=>console.log(e))
}


