const dotenv = require('dotenv');dotenv.config()
const Sequelize = require('sequelize');

const db = new Sequelize(
    process.env.DATABSE_NAME,
    process.env.DATABSE_USER,
    process.env.DATABSE_PASSWORD,
    {
        host:process.env.DATABSE_HOST,
        dialect:'mysql'
    }
)

module.exports = db;