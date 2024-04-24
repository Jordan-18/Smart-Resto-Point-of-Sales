const transaction = require('../Model/transaction.model.js')

module.exports = class transactionService{
    find = async (req) => {
        const response = await transaction.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await transaction.findAll({
            where: {
                transaction_id : id
            }
        })

        return response
    }
    create = async (req, transaction) => {
        const data = await transaction.create(req.body, {transaction})

        return req.body
    }
    update = async  (id, req, transaction) => {
        const numUpdated = await transaction.update(req.body, {
            where: {transaction_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await transaction.destroy({
            where: {
                transaction_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}