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