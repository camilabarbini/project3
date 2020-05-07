const Sequelize = require('sequelize');
const sequelize = new Sequelize('mysql://sNUbrPBJdI:GdTXgKAFV9@remotemysql.com:3306/sNUbrPBJdI');

(async function databaseAuthenticate(){
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
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
