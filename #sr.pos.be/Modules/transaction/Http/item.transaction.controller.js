const transactionItemService = require('./item.transaction.service.js');
const {validationResult} = require('express-validator');
const sequelize = require('../../../config/db.js')

module.exports = class transactionItemController{
    constructor() {
        this.transactionItemService = new transactionItemService()
    }
    find = async(req, res) => {
        try {
            const response = await this.transactionItemService.find(req)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    findOne = async(req, res) => {
        try {
            const response = await this.transactionItemService.findOne(req.params.id)
            return res.status(200).json(response)
        } catch (error) {
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    create = async(req, res) => {
        const transactionItem = await sequelize.transactionItem();    
        try {
            const error  = validationResult(req)
            if(!error.isEmpty()){
                res.status(505).json({status : res.statusCode,'msg' : error});
            }else{
                const response = await this.transactionItemService.create(req, transactionItem)

                await transactionItem.commit();
                return await res.status(201).json(response)
            }
        } catch (error) {
            await transactionItem.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    update = async(req, res) => {
        const transactionItem = await sequelize.transactionItem();    
        try {
            const error  = validationResult(req)
            if(!error.isEmpty()){
                res.status(505).json({status : res.statusCode,'msg' : error});
            }else{
                const response = await this.transactionItemService.update(req.params.id, req, transactionItem)

                await transactionItem.commit();
                return await res.status(201).json(response)
            }
        } catch (error) {
            await transactionItem.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }

    delete = async(req, res) => {
        const transactionItem = await sequelize.transactionItem();    
        try {
            const response = await this.transactionItemService.delete(req.params.id,transactionItem)
            await transactionItem.commit();
            res.status(201).json(response)
        } catch (error) {
            await transactionItem.rollback();
            console.log(error);
            res.status(500).json({msg:error});
        }
    }
}