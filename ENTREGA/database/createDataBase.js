let config = require('../config');
const Sequelize = require('sequelize');

/******PARA CONEXIÓN REMOTA****/
//let dataDB = config.dataDB;

/******PARA CONEXIÓN LOCAL****/
let dataDB = config.dataDBLocal;


/******PARA CONEXIÓN REMOTA****/
//const sequelize = new Sequelize(`mysql://${dataDB.user}:${dataDB.password}@${dataDB.host}:${dataDB.port}/${dataDB.database}`); (remota)

/******PARA CONEXIÓN LOCAL****/
const sequelize = new Sequelize(`mysql://${dataDB.user}@${dataDB.host}:${dataDB.port}`); 

(async function createDatabase(){
    const query = 'CREATE DATABASE delilahResto'
    await sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
          .then(response=>console.log(response))
          .catch(e=>console.log(e))
})();