const menuaccessService = require('./menuaccess.service.js');
const {validationResult} = require('express-validator');
const sequelize = require('../../../config/db.js')

module.exports = class menuaccessController{
    constructor() {
        this.menuaccessService = new menuaccessService()
    }
    find = async(req, res) => {
        try {
            const response = await this.menuaccessService.find(req)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    findOne = async(req, res) => {
        try {
            const response = await this.menuaccessService.findOne(req.params.id)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    create = async(req, res) => {
        const transaction = await sequelize.transaction();    
        try {
            const error  = validationResult(req)
            if(!error.isEmpty()){
                res.status(505).json({status : res.statusCode,'msg' : error});
            }else{
                const response = await this.menuaccessService.create(req, transaction)

                await transaction.commit();
                return await res.status(201).json(response)
            }
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    update = async(req, res) => {
        const transaction = await sequelize.transaction();    
        try {
            const error  = validationResult(req)
            if(!error.isEmpty()){
                res.status(505).json({status : res.statusCode,'msg' : error});
            }else{
                const response = await this.menuaccessService.update(req.params.id, req, transaction)

                await transaction.commit();
                return await res.status(201).json(response)
            }
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    delete = async(req, res) => {
        const transaction = await sequelize.transaction();    
        try {
            const response = await this.menuaccessService.delete(req.params.id,transaction)
            await transaction.commit();
            res.status(201).json(response)
        } catch (error) {
            await transaction.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    roleAccess = async(req, res) => {
        try {
            const response = await this.menuaccessService.showAccess(req.params.id)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    accessMenu = async(req, res) => {
        try {
            const response = await this.menuaccessService.accessMenu(req.params.id)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }
}