const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const tag = db.define('tag', {
    tag_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    tag_name: {
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

module.exports = tag