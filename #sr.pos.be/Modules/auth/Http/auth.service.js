const User = require('../../user/Model/user.model.js')
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv'); dotenv.config()
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY

module.exports = class authService{
    login = async (req) => {
        const {user_username,user_password} = req
        const user = await User.findOne({where : {user_username: user_username}});
        if(user){
            const ValidationPassword = await bcryptjs.compare(user_password, user.user_password);
            const token = jwt.sign({ 
                userId: user.user_id, 
                name : user.user_name,
                username: user.user_username,
                email: user.user_email,
                access : user.user_useraccess ?? '7af23d14-7922-48c9-a816-2c75354147bf'
            }, secretKey, { expiresIn: '168h' });

            if(ValidationPassword){
                return {
                    msg: "Login Successfully",
                    token : token,
                    data: user
                }
            }else{
                throw "Password not match"
            }
        }else{
            throw "User not found"
        }
    }
    register = async (req) => {
        const {
            user_name, 
            user_username, 
            user_email, 
            user_password,
            user_password_repeat
        } = req

        if(user_password !== user_password_repeat){
            throw "Password not match";
        }
        const userCheck = await User.findOne({
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
        req.user_password = hashpassword
        
        const created = await User.create(req)
        const result = await User.findOne({
            where: {
                user_id: created.user_id
            }
        })
        const token = jwt.sign({ 
            userId: result.user_id,
            userId: result.user_id, 
            name : result.user_name,
            username: result.user_username,
            email: result.user_email,
            access : result.user_useraccess ?? '7af23d14-7922-48c9-a816-2c75354147bf'
        }, secretKey, { expiresIn: '1h' });
        return {
            msg : 'Register Successfully',
            token : token,
            data : result
        }
    }
    logout = async (req) => {

        return 
    }
}