const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const tagItem = db.define('tag_item', {
    tag_item_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    tag_item_tag: {
        type:DataTypes.STRING(128),
    },
    tag_item_dish: {
        type:DataTypes.STRING(128),
    },
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTablename: true,
});

(async() => {
    await db.sync()
})();

module.exports = tagItem