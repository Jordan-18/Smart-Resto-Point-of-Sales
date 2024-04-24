const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const transaction = db.define('transaction', {
    transaction_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    transaction_user: {
        type:DataTypes.STRING(80),
    },
    transaction_total_price: {
        type:DataTypes.INTEGER(),
    },
    transaction_shipping_price: {
        type:DataTypes.INTEGER(),
    },
    transaction_status_payment: {
        type:DataTypes.STRING(32),
    },
    transaction_payment: {
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

module.exports = transaction