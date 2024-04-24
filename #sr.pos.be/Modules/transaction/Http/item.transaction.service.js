const transactionItem = require('../Model/item.transaction.model.js')

module.exports = class transactionItemService{
    find = async (req) => {
        const response = await transactionItem.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await transactionItem.findAll({
            where: {
                transactionItem_id : id
            }
        })

        return response
    }
    create = async (req, transactionItem) => {
        const data = await transactionItem.create(req.body, {transactionItem})

        return req.body
    }
    update = async  (id, req, transactionItem) => {
        const numUpdated = await transactionItem.update(req.body, {
            where: {transactionItem_id: id},
            transactionItem: transactionItem
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transactionItem) => {
        const deleteData = await transactionItem.destroy({
            where: {
                transactionItem_id: id
            },
            transactionItem: transactionItem
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}