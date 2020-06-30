let config = require('../config');
//let dataDB = config.dataDB; (remota)
let dataDB = config.dataDBLocal;
const Sequelize = require('sequelize');

//const sequelize = new Sequelize(`mysql://${dataDB.user}:${dataDB.password}@${dataDB.host}:${dataDB.port}/${dataDB.database}`); (remota)
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