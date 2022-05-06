const sequelize = require('sequelize');
const db = require('../configs/database.js');

const User = db.define('User',{
    serial: {
        primaryKey: true,
        type: sequelize.INTEGER(10),
        // autoIncrement: true,
        allowNull: false
    },
    username: {
        primaryKey: true,
        type: sequelize.STRING(100),
        allowNull: true
    },
    password: {
        type: sequelize.STRING(100),
        allowNull: true
    },
    authkey: {
        type: sequelize.STRING(100),
        allowNull: true
    },
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'user'
});
User.sync({force: true});
module.exports = User;