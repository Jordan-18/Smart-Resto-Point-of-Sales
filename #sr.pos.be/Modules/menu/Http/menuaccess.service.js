const menuaccess = require('../Model/menuaccess.model.js')
const menuService = require('./menu.service.js')
const accessService = require('../../access/Http/access.service.js')
const menu = require('../Model/menu.model.js')

module.exports = class experienceService{
    constructor() {
        this.menuService = new menuService()
        this.accessService = new accessService()
        this.nestedResult = {}
    }
    find = async (req) => {
        const response = await menuaccess.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }
    findOne = async (id) => {
        const response = await menuaccess.findAll({
            where: {
                menuaccess_id : id
            }
        })

        return response
    }
    showAccess = async (id) => {
        const menus = await menu.findAll({ order: ['menu_order'] });
        const menuAccess = await menuaccess.findAll({ where: { menuaccess_access: id } });
      
        const menuDict = {};
        menus.forEach(menu => {
          menuDict[menu.menu_id] = { ...menu.dataValues, menus: [] };
        });
      
        menuAccess.forEach(menuaccess => {
          const menuId = menuaccess.menuaccess_menu;
          const parentMenuId = menuDict[menuId]?.menu_parent;
      
          if (parentMenuId) {
            menuDict[parentMenuId].menus.push({
                ...menuDict[menuId],
                menuAccess: menuaccess,
            });
          }
        });
      
        const filtered = menus.filter(menu => !menu.menu_parent).map(menu => ({
          ...menuDict[menu.menu_id],
          menuAccess: menuAccess.find(menuaccess => menu.menu_id == menuaccess.menuaccess_menu),
        }));
      
        return filtered;
    };
    create = async (bulkCreateData, transaction) => {
        const createdData = await menuaccess.bulkCreate(bulkCreateData, { transaction });

        return createdData
    }
    update = async  (id, req, transaction) => {
        const data = req.body
        const splitData = data.data.map(value => value.split('@'))
        const groupedData = splitData.reduce((result, [id, operation]) => {
            if (!result[id]) {result[id] = [id, []];} result[id][1].push(operation);
            return result;
        }, {});
        const expectResult = Object.values(groupedData);
        await menuaccess.destroy({where: {menuaccess_access: id},transaction: transaction})

        const prosesedData = expectResult.map(value => {
            return {
                menuaccess_access: id,
                menuaccess_menu: value[0],
                menuaccess_create: value[1].includes('CREATE') ? 1 : 0,
                menuaccess_read: value[1].includes('READ') ? 1 : 0,
                menuaccess_update: value[1].includes('UPDATE') ? 1 : 0,
                menuaccess_delete: value[1].includes('DELETE') ? 1 : 0,
            }
        })

        const updateData = await this.create(prosesedData, transaction)
        return updateData;
    }
    delete = async (id, transaction) => {
        const deleteData = await menuaccess.destroy({
            where: {
                menuaccess_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : {msg: 'Data Deleted'})
        return response;
    }
    accessMenu = async (id) => {
        var result = [];
        var response = [];

        let menus = await this.menuService.menus()
        menus = await this.nestedMenu(menus, 'menu')
        this.nestedResult = {}
        let accessMenu = await this.showAccess(id)
        accessMenu = await this.nestedMenu(accessMenu)

        Object.entries(menus).forEach(([key, value]) => {
            const menuItem = { ...value}
            menuItem.state = { opened : value['parent'] == '' ? true : false}

            if(accessMenu[key]){
                const checked = 'checked'
                const children01 = value.children && value.children.length > 0
                let children02 = false

                if (children01) {
                    for (const key2 of value.children) {
                      if (menus[key2]) {
                        children02 = true;
                        menuItem.state.opened = true;
                      }
                    }
            
                    const check = accessMenu[key].children[0].split("#");
                    if (check[1]) {
                      menuItem.state.opened = false;
                    }
                }

                
                if (children02) {
                    menuItem.state[checked] = 'undetermined';
                } else {
                    menuItem.state[checked] = true;
                }
            }
            
            result.push(menuItem)
        })

        // return result
        const getActived = this.getActived(result)
        const prosesTree = this.prosesTree(result)
        return {
            activeId : getActived,
            dataTree : prosesTree
        }
    }

    nestedMenu = async (data = [], role = '') => {
        data.map(( value, item) =>{
            var children = [value['menu_id']+'@OPTIONS']

            if(value['menus']){
                children = children.concat(value['menus'].map(value => value['menu_id']))
            }

            if(!this.nestedResult[value['menu_id']]){
                this.nestedResult[value['menu_id']] = {
                    'key': value.menu_id,
                    'title' : value.menu_name,
                    'parent' : value.menu_parent ?? '',
                    'children' : children
                }
            }

            var options = [
                value['menu_id']+'@CREATE',
                value['menu_id']+'@READ',
                value['menu_id']+'@UPDATE',
                value['menu_id']+'@DELETE',
            ]

            if(role == 'menu'){
                this.nestedResult[value['menu_id']+'@OPTIONS'] = {
                    'key': value.menu_id+'@OPTIONS',
                    'title' : "OPTIONS",
                    'parent' : value.menu_id,
                    'children' : options
                }

                options.forEach((item, key) => {
                    this.nestedResult[item] = {
                        'key': item,
                        'title' : item.split('@')[1],
                        'parent' : value.menu_id+'@OPTIONS'
                    }
                })
            }else{
                this.nestedResult[value['menu_id']+'@OPTIONS'] = {
                    'key': value.menu_id+'@OPTIONS',
                    'title' : "OPTIONS",
                    'parent' : value.menu_id,
                    'children' : options
                }

                let access = [
                    value?.menuAccess?.menuaccess_create,
                    value?.menuAccess?.menuaccess_read,
                    value?.menuAccess?.menuaccess_update,
                    value?.menuAccess?.menuaccess_delete
                ]
                options.forEach((item, key) => {
                    if(access[key] == 1){
                        this.nestedResult[item] = {
                            'key': item,
                            'title' : item.split('@')[1],
                            'parent' : value.menu_id+'@OPTIONS'
                        }
                    }
                })
            }

            this.nestedMenu(value['menus'], role)
        })

        return this.nestedResult
    }

    prosesTree = (data) => {
        var prosesData = [];
        
        const recursive = (item) => {
          const children = data.filter(child => child.parent === item.key);
          if (children.length > 0) {
            item.children = children.map(child => recursive(child));
          }
          return item;
        }
      
        const mainRoute = data.filter(value => value.parent === '');
      
        mainRoute.forEach(value => {
          const treeItem = recursive(value);
          prosesData.push(treeItem);
        });
      
        return prosesData;
    }

    getActived = (data) => {
        const actived = data.filter(value=> value.state.checked == true || value.state.checked == 'undetermined')
        const activedId = actived.map(value => value.key)
        const filteredId = activedId.filter(value => {
            const check = value.split("@")
            if(check[1] && check[1] != 'OPTIONS'){
                return value
            }
        })
        return filteredId
    }
}