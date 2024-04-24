const access = require('../Model/access.model.js')

module.exports = class accessService{
    find = async (req) => {
        const response = await access.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await access.findAll({
            where: {
                access_id : id
            }
        })

        return response
    }
    create = async (req, transaction) => {
        const data = await access.create(req.body, {transaction})

        return req.body
    }
    update = async  (id, req, transaction) => {
        const numUpdated = await access.update(req.body, {
            where: {access_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await access.destroy({
            where: {
                access_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}