const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const transaction_item = db.define('transaction_item', {
    transaction_item_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    transaction_item_user: {
        type:DataTypes.STRING(80),
    },
    transaction_item_transaction: {
        type:DataTypes.INTEGER(),
    },
    transaction_item_dish: {
        type:DataTypes.INTEGER(),
    },
    transaction_item_description: {
        type:DataTypes.TEXT(),
    },
    transaction_item_quantity: {
        type:DataTypes.INTEGER(),
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

module.exports = transaction_item