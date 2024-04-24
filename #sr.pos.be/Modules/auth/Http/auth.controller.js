const authService = require('./auth.service.js');
const {validationResult} = require('express-validator');
const sequelize = require('../../../config/db.js')

module.exports = class authController{
    constructor() {
        this.authService = new authService()
    }
    login = async (req, res) => {
        try {
            const response = await this.authService.login(req.body)

            req.session.user_id = response.data.dataValues.user_id;
            req.session.user_username = response.data.dataValues.user_username;
            req.session.user_name = response.data.dataValues.user_name;
            req.session.user_useraccess = response.data.dataValues.user_useraccess;
            req.session.user_email = response.data.dataValues.user_email;
            
            delete response.data

            // if(!response.data.dataValues.user_useraccess){
            //     response.data.dataValues.user_useraccess = '7af23d14-7922-48c9-a816-2c75354147bf'
            // }

            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }
    register = async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
            const response = await this.authService.register(req.body)
            
            req.session.user_id = response.data.dataValues.user_id;
            req.session.user_username = response.data.dataValues.user_username;
            req.session.user_name = response.data.dataValues.user_name;
            req.session.user_useraccess = response.data.dataValues.user_useraccess;
            req.session.user_email = response.data.dataValues.user_email;

            delete response.data

            await transaction.commit();
            return res.status(201).json(response)
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }
    logout = async (req, res) => {
        try {
            const response = await this.authService.logout(req.body)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }
    callback = async (req) => {
        
    }
}