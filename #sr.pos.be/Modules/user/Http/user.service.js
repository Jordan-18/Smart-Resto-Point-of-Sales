const user = require('../Model/user.model.js')
const bcryptjs = require('bcryptjs');

module.exports = class experienceService{
    find = async (req) => {
        const response = await user.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await user.findAll({
            where: {
                user_id : id
            }
        })

        return response
    }
    create = async (req, transaction) => {
        const {
            user_name, 
            user_username, 
            user_email, 
            user_password,
            user_password_repeat
        } = req.body

        if(user_password !== user_password_repeat){
            throw "Password not match";
        }
        const userCheck = await user.findOne({
            where: {
                user_name: user_name,
                user_email: user_email
            }
        })

        if(userCheck){
            throw "User already exists";
        }

        var salt = bcryptjs.genSaltSync(10);
        let hashpassword = await bcryptjs.hash(user_password,salt);
        req.body.user_password = hashpassword
        
        await user.create(req.body, {transaction})
        return req.body
    }
    update = async  (id, req, transaction) => {
        const {user_name,user_email,user_password,user_password_repeat} = req.body

        if(user_password){
            if(user_password !== user_password_repeat){throw "Password not match";}

            var salt = bcryptjs.genSaltSync(10);
            let hashpassword = await bcryptjs.hash(user_password,salt);
            req.body.user_password = hashpassword
        }else{
            delete req.body.user_password
        }
        const userCheck = await user.findOne({
            where: {
                user_name: user_name,
                user_email: user_email
            }
        })
        if(userCheck){throw "User already exists";}

        const numUpdated = await user.update(req.body, {
            where: {user_id: id},
            transaction: transaction
        });
        if (numUpdated == 0) {return { msg: 'Data Not Found' };}
        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await user.destroy({
            where: {
                user_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}