const sequelize = require('sequelize');
const db = require('../configs/database.js');

const VIN = db.define('VIN',{
    serial: {
        primaryKey: true,
        type: sequelize.INTEGER(10),
        autoIncrement: true,
        // allowNull: false
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
    mileage:{
        type: sequelize.STRING(10),
        allowNull: false,
        defaultValue: ''
    },
    kbb_status:{
        type: sequelize.STRING(15),
        allowNull: true,
    },
    kbb_year:{
        type: sequelize.STRING(10),
        allowNull: false,
        defaultValue: ''
    },
    kbb_vehicle:{
        type: sequelize.STRING(100),
        allowNull: false,
        defaultValue: ''
    },
    kbb_engine_trim:{
        type: sequelize.STRING(100),
        allowNull: false,
        defaultValue: ''
    },
    kbb_tradeInValue:{
        type: sequelize.STRING(10),
        allowNull: false,
        defaultValue: ''
    },
    failed:{
        type: sequelize.INTEGER(5),
        allowNull: false,
        defaultValue: 0
    }
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'vin'
});
// VIN.sync({force:true});
module.exports = VIN;
