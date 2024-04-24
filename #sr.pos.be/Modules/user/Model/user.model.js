const Sequelize = require('sequelize');
const db = require('../../../config/db.js')

const DataTypes = Sequelize

const user = db.define('users', {
    user_id: {
        type:Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
    },
    user_name: {
        type:DataTypes.STRING(128),
    },
    user_username: {
        type:DataTypes.STRING(128),
    },
    user_email: {
        type:DataTypes.STRING(64),
    },
    user_useraccess: {
        type:DataTypes.STRING(64),
    },
    user_password: {
        type:DataTypes.STRING,
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

module.exports = user