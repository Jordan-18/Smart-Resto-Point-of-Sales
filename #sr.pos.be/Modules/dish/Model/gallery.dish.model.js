const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const dish_gallery = db.define('dish_gallery', {
    dish_gallery_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    dish_gallery_dish: {
        type:DataTypes.STRING(128),
    },
    dish_gallery_url: {
        type:DataTypes.TEXT(),
        allowNull: true
    }
}, {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTablename: true,
});


(async() => {
    await db.sync()
})();

module.exports = dish_gallery