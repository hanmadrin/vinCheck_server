const sequelize = require('sequelize');
const db = require('../configs/database.js');

const VIN = db.define('VIN',{
    serial: {
        primaryKey: true,
        type: sequelize.INTEGER(10),
        autoIncrement: true,
        allowNull: false
    },
    vin: {
        type: sequelize.STRING(30),
        allowNull: false
    },
    status: {
        type: sequelize.STRING(15),
        allowNull: true
    },
    accident_count: {
        type: sequelize.INTEGER(10),
        allowNull: false,
        defaultValue: 0
    },
    problem_count: {
        type: sequelize.INTEGER(10),
        allowNull: false,
        defaultValue: 0
    },
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'vin'
});
// VIN.sync({force: true});
module.exports = VIN;