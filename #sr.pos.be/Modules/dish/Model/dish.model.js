const Sequelize = require('sequelize');
const db = require('../../../config/db.js')
const dish_gallery = require('./gallery.dish.model.js')
const tagItem = require('../../tag/Model/item.tag.model.js')
const tag = require('../../tag/Model/tag.model.js')

const DataTypes = Sequelize

const dish = db.define('dish', {
    dish_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    dish_name: {
        type:DataTypes.STRING(128),
    },
    dish_price: {
        type:DataTypes.INTEGER(),
        allowNull: true
    },
    dish_description: {
        type:DataTypes.TEXT(),
        allowNull: true
    },
    dish_status: {
        type:DataTypes.STRING(),
        allowNull: true,
        defaultValue: 'ACTIVE'
    },
}, {
    paranoid:true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    freezeTablename: true,
});

dish.hasMany(dish_gallery, { foreignKey: 'dish_gallery_dish', sourceKey: 'dish_id' });
dish.hasMany(tagItem, { foreignKey: 'tag_item_dish', sourceKey: 'dish_id' });
tagItem.belongsTo(tag, { foreignKey: 'tag_item_tag', targetKey: 'tag_id' });

(async() => {
    await db.sync()
})();

module.exports = {dish, dish_gallery, tagItem, tag}