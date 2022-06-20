const sequelize = require('sequelize');
const db = require('../configs/database.js');

const Meta = db.define('Meta',{
    serial: {
        primaryKey: true,
        type: sequelize.INTEGER(10),
        autoIncrement: true,
    },
    meta_key: {
        primaryKey: true,
        type: sequelize.STRING(100),
        allowNull: false
    },
    meta_value: {
        type: sequelize.STRING(100),
        allowNull: true
    },
},{
    timestamps: false,
    freezeTableName: true,
    tableName: 'meta'
});
// Meta.sync({force:true});
module.exports = Meta;