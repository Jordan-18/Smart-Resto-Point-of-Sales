const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const access = db.define('access', {
    access_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    access_kode: {
        type:DataTypes.STRING(128),
    },
    access_name: {
        type:DataTypes.STRING(128),
    },
}, {
    paranoid:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTablename: true,
});


(async() => {
    await db.sync()
})();

module.exports = access