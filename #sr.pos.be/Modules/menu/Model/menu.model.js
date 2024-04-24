const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const menu = db.define('menu', {
    menu_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    menu_kode: {
        type:DataTypes.STRING(64),
    },
    menu_name: {
        type:DataTypes.STRING(64),
    },
    menu_order: {
        type:DataTypes.STRING(64),
    },
    menu_parent: {
        type:DataTypes.STRING(64),
        allowNull: true
    },
    menu_level: {
        type:DataTypes.STRING(32),
    },
    menu_icon: {
        type:DataTypes.STRING(64),
        allowNull: true
    },
    menu_endpoint: {
        type:DataTypes.STRING(64),
    },
    menu_status: {
        type:DataTypes.BOOLEAN(12),
        defaultValue: true
    },
}, {
    paranoid:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTablename: true,
});

menu.hasMany(menu, { foreignKey: 'menu_parent' });

(async() => {
    await db.sync()
})();

module.exports = menu