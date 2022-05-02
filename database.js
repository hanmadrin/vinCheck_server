const sequelize = require('sequelize');
const env = require('dotenv').config();

module.exports =  new sequelize(
    process.env.DATABASE_NAME, 
    process.env.DATABASE_USERNAME, 
    process.env.DATABASE_PASSWORD, 
    {
        host: 'localhost',
        dialect: 'mysql',
        dialectOptions: {
            charset: 'utf8',
        }
    }
);