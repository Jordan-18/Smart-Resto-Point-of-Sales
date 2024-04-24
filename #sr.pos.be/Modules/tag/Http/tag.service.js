const tag = require('../Model/tag.model.js')

module.exports = class tagService{
    find = async (req) => {
        const response = await tag.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await tag.findAll({
            where: {
                tag_id : id
            }
        })

        return response
    }
    create = async (req, transaction) => {
        const data = await tag.create(req.body, {transaction})

        return req.body
    }
    update = async  (id, req, transaction) => {
        const numUpdated = await tag.update(req.body, {
            where: {tag_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await tag.destroy({
            where: {
                tag_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}