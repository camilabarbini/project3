let config = require('../config');
const Sequelize = require('sequelize');

/******PARA CONEXIÓN REMOTA****/
//let dataDB = config.dataDB;

/******PARA CONEXIÓN LOCAL****/
let dataDB = config.dataDBLocal; //(local)


/******PARA CONEXIÓN REMOTA****/
//const sequelize = new Sequelize(`mysql://${dataDB.user}:${dataDB.password}@${dataDB.host}:${dataDB.port}/${dataDB.database}`); (remota)

/******PARA CONEXIÓN LOCAL****/
const sequelize = new Sequelize(`mysql://${dataDB.user}@${dataDB.host}:${dataDB.port}/${dataDB.database}`); 

(async function databaseAuthenticate(){
    try{
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})()

module.exports = { sequelize, Sequelize }