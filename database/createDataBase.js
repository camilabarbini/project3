let config = require('../config');
let dataDB = config.dataDBLocal;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(`mysql://${dataDB.user}@${dataDB.host}:${dataDB.port}`); 

(async function createDatabase(){
    const query = 'CREATE DATABASE delilahResto'
    await sequelize.query(query, {type: sequelize.QueryTypes.CREATE})
          .then(response=>console.log(response))
          .catch(e=>console.log(e))
})();