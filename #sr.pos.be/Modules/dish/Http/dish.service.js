const {dish, dish_gallery, tagItem, tag} = require('../Model/dish.model.js')
const dotenv = require('dotenv'); dotenv.config()

module.exports = class dishceService{
    constructor (){
    }
    find = async (req) => {
        const exclude = ['created_at', 'updated_at', 'deleted_at']
        const data = await dish.findAll({
            include: [
                { 
                    model: dish_gallery, 
                    attributes: { exclude: [...exclude,...['dish_gallery_id','dish_gallery_dish']]},
                },
                { 
                    model: tagItem, 
                    attributes: { exclude: [...exclude,...['tag_item_tag','tag_item_dish']]},
                    include: [{ 
                        model: tag, 
                        attributes: { exclude: [...exclude] } 
                    }], 
                },
            ],
            attributes: { exclude: exclude},
            order: [['created_at', 'ASC']],
        })

        const response = data.map((dish) => {
            const modifiedGalleries = dish.dish_galleries.map((gallery) => {
                return {
                    dish_gallery_url: process.env.AWS_URL + gallery.dish_gallery_url
                };
            });
        
            return { ...dish.toJSON(), dish_galleries: modifiedGalleries };
        });
        
        return response;
    }
    findOne = async (id) => {
        const exclude = ['created_at', 'updated_at', 'deleted_at']
        const data = await dish.findAll({
            where: {
                dish_id : id
            },
            include: [
                { 
                    model: dish_gallery, 
                    attributes: { exclude: [...exclude,...['dish_gallery_id','dish_gallery_dish']]},
                },
                { 
                    model: tagItem, 
                    attributes: { exclude: [...exclude,...['tag_item_tag','tag_item_dish']]},
                    include: [{ 
                        model: tag, 
                        attributes: { exclude: [...exclude] } 
                    }], 
                },
            ],
            attributes: { exclude: exclude},
            order: [['created_at', 'ASC']],
        })

        const response = data.map((dish) => {
            const modifiedGalleries = dish.dish_galleries.map((gallery) => {
                return {
                    dish_gallery_url: process.env.AWS_URL + gallery.dish_gallery_url
                };
            });
        
            return { ...dish.toJSON(), dish_galleries: modifiedGalleries };
        });
        
        return response;
    }
    create = async (req, transaction) => {
        const data = await dish.create(req.body, {transaction})

        const tagData = (req.body.tag_items).map((item) => {
            return {
                tag_item_dish : data.dish_id,
                tag_item_tag : item
            }
        })
        const tagItems = await tagItem.bulkCreate(tagData, {transaction})
        return req.body
    }
    update = async  (id, req, transaction) => {
        const numUpdated = await dish.update(req.body, {
            where: {dish_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }
    delete = async (id, transaction) => {
        const deleteData = await dish.destroy({
            where: {
                dish_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }
}