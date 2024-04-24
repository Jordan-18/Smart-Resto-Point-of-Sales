const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const menuaccess = db.define('menuaccess', {
    menuaccess_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    menuaccess_menu: {
        type:DataTypes.STRING(64),
    },
    menuaccess_access: {
        type:DataTypes.STRING(64),
    },
    menuaccess_create: {
        type:DataTypes.INTEGER(),
        allowNull: true
    },
    menuaccess_read: {
        type:DataTypes.INTEGER(),
        allowNull: true
    },
    menuaccess_update: {
        type:DataTypes.INTEGER(),
        allowNull: true
    },
    menuaccess_delete: {
        type:DataTypes.INTEGER(),
        allowNull: true
    },
}, {
    // paranoid:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
    freezeTablename: true,
});


(async() => {
    await db.sync()
})();

module.exports = menuaccess