const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://sNUbrPBJdI:GdTXgKAFV9@remotemysql.com:3306/sNUbrPBJdI');


(function createProducts(){
    const query = 'CREATE TABLE PRODUCTS (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(60) NOT NULL, price INT NOT NULL, img VARCHAR(60) NOT NULL)'
    sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
        .then(response=>response.json(response))
})()



/* sequelize.authenticate().then(async()=>{
    const query = 'SELECT * FROM CAMILA'
    const results = await sequelize.query(query, { raw: true});
    console.log(results)
}); */

//sequelize.query('SELECT * FROM CAMILA',{
  //  type:sequelize.QueryTypes.SELECT}
//).then(function(resultados){res.json(resultados)
/* sequelize.authenticate().then(async()=>{
const query = 'SELECT * FROM CAMILA'
await sequelize.query(query, { raw: true}); */
//res.json(results)
//})