const express = require('express');
const server = express();

let dataDB = {
  user: "sNUbrPBJdI",
  password: "GdTXgKAFV9",
  host: "remotemysql.com",
  port: 3306,
  database: "sNUbrPBJdI",
}

const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${dataDB.user}:${dataDB.password}@${dataDB.host}:${dataDB.port}/${dataDB.database}`);


server.listen(3000, () => {
  console.log('servidor iniciado...');
});
/***************************************CREAR TABLAS********************/
(async function createProducts(){
    const query = 'CREATE TABLE PRODUCTS (productId INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(60) NOT NULL, price INT NOT NULL, img VARCHAR(160) NOT NULL, isFavorite BOOLEAN NOT NULL DEFAULT FALSE )'
    await sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
        .then(response=>response)
        .catch(e=>e);
})();

(async function createOrders(){
    const query = 'CREATE TABLE ORDERS (orderId INT PRIMARY KEY AUTO_INCREMENT, userId INT NOT NULL, productsId VARCHAR(60) NOT NULL, status VARCHAR(60) NOT NULL, total INT NOT NULL, payloadMethod VARCHAR(60) NOT NULL, address VARCHAR(60) NOT NULL)'
    await sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
        .then(response=>response)
        .catch(e=>e);
})();

(async function createPriceList(){
  const query = 'CREATE TABLE PRICELIST (productId INT PRIMARY KEY NOT NULL, PRICE INT NOT NULL)'
  await sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
        .then(response=>response)
        .catch(e=>e);
})();

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
products.forEach((product,index)=>{
  let productId,title,price,img;
  productId = index
  title=product.title;
  price=product.price;
  img=product.img;
  insertProduct(productId,title,price,img);
})
async function insertProduct(productId,title, price, img){
  const query = 'INSERT INTO PRODUCTS (productId, title, price, img, isFavorite) VALUES(?,?,?,?,?)'
  await sequelize.query(query, {
      replacements: [productId,title, price, img, 0],
      type: sequelize.QueryTypes.INSERT})
      .then(response=>{console.log(response), getAllProducts()})
        .catch(e=>console.log(e))
}
async function getAllProducts(){
  const query = 'SELECT * FROM PRODUCTS'
  const productsInDb = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT})
      .then(response=>response)
      .catch(e=>e);
  console.log(productsInDb)
  productsInDb.forEach(element => {
    updatePriceList(element.productId, element.price)
  });
};

async function updatePriceList(productId, price){
  const query = 'INSERT INTO PRICELIST (productId, price) VALUES(?,?)'
    await sequelize.query(query, {
        replacements: [productId, price],
        type: sequelize.QueryTypes.INSERT})
        .then(response=>console.log(response))
        .catch(e=>console.log(e))
}


