const menu = require('../Model/menu.model.js')

module.exports = class experienceService{
    constructor() {
        this.menusResult
        this.countMenu
    }
    find = async (req) => {
        const response = await menu.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await menu.findAll({
            where: {
                menu_id : id
            }
        })

        return response
    }
    create = async (req, transaction) => {
        const { menu_parent } = req.body
        let menu_lvl = 1
        if(menu_parent != ''){
            const menuParent = await this.findOne(menu_parent)
            menu_lvl = parseInt(menuParent[0]?.menu_level) + 1
        }
        req.body.menu_level = menu_lvl
        const data = await menu.create(req.body, {transaction})

        return data
    }
    update = async  (id, req, transaction) => {
        const numUpdated = await menu.update(req.body, {
            where: {menu_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await menu.destroy({
            where: {
                menu_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }

    menus = async () => {
        this.countMenu = 1
        this.menusResult = await menu.findAll({
            attributes: ['menu_id','menu_name','menu_parent','menu_icon','menu_endpoint'],
            include: menu,
            order: [['created_at', 'DESC']],
            where: {
                menu_level : this.countMenu,
                menu_status : '1'
            }
        })

        return this.menusResult
    }

    // not work yet
    menuRecursive = async (query) =>{
        this.countMenu++

        query.findAll({
            attributes: ['menu_id','menu_name','menu_parent','menu_icon','menu_endpoint'],
            include: menu => {
                this.menuRecursive(menu)
            },
            order: [['created_at', 'DESC']],
            where: {
                menu_level : this.countMenu,
                menu_status : '1'
            }
        })
    }
}