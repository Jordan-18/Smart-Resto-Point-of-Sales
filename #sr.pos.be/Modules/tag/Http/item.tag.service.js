const tagItem = require('../Model/item.tag.model.js')

module.exports = class tagItemService{
    find = async (req) => {
        const response = await tagItem.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await tagItem.findAll({
            where: {
                tag_item_id : id
            }
        })

        return response
    }
    create = async (req, transaction) => {
        const createdData = await tagItem.bulkCreate(req.body, {transaction})

        return createdData
    }
    update = async  (id, req, transaction) => {
        const numUpdated = await tagItem.update(req.body, {
            where: {tag_item_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await tagItem.destroy({
            where: {
                tag_item_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}