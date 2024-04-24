const dishGallery = require('../Model/gallery.dish.model.js')
const dotenv = require('dotenv'); dotenv.config()
const AWS = require('aws-sdk');
const path = require('path');
const bcryptjs = require('bcryptjs');
const generateRandomString = require('../../../helpers/Random.js');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
});
const s3 = new AWS.S3({ endpoint: process.env.AWS_ENDPOINT });

module.exports = class dishGalleryceService{
    constructor() {
        this.S3Path = `${process.env.AWS_ENDPOINT}/${process.env.AWS_BUCKET}`
    }
    find = async (req) => {
        const response = await dishGallery.findAll({
            order: [['created_at', 'DESC']],
        })
        return response;
    }

    findOne = async (id) => {
        const response = await dishGallery.findAll({
            where: {
                dish_gallery_id : id
            }
        })

        return response
    }

    create = async (req, transaction) => {
        if(!req.files){throw "File not found"}
        const uploadPromises = req.files.map(async (file) => {
            const { originalname, buffer } = file;
            const resultName = await this.generateName(originalname);
            const pathS3 = `foods/${resultName}`;
            const params = { Bucket: 'srpos', Key: pathS3, Body: buffer };
        
            return new Promise((resolve, reject) => {
              s3.upload(params, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(pathS3);
                }
              });
            });
        });

        
        const uploadedPaths = await Promise.all(uploadPromises);
        const dataUploaded = uploadedPaths.map((path) => ({
            dish_gallery_dish: req.body.dish_gallery_dish,
            dish_gallery_url: path,
        }))
    
        await dishGallery.bulkCreate(dataUploaded, { transaction });
    
        return { msg: 'Files uploaded to S3 successfully!' };
        // const { originalname, buffer } = req.file;
        // const resultName = await this.generateName(originalname)
        // const pathS3 = `foods/${resultName}`
        // const params = {Bucket: 'srpos',Key: pathS3,Body: buffer};

        // s3.upload(params, (err, data) => {
        //     if (err) {
        //       throw err
        //     }
        // });
        
        // req.body.dish_gallery_url = pathS3
        // await dishGallery.create(req.body, {transaction})
        // return {msg : 'File uploaded to S3 successfully!'}
    }

    single = async (req) =>{
        const { originalname, buffer } = req.file;
        const resultName = await this.generateName(originalname)
        const pathS3 = `foods/${resultName}`
        const params = {Bucket: 'srpos',Key: pathS3,Body: buffer};

        s3.upload(params, (err, data) => {
            if (err) {
              throw err
            }
        });
        
        req.body.dish_gallery_url = pathS3
        await dishGallery.create(req.body, {transaction})
        return {msg : 'File uploaded to S3 successfully!'}
    }

    group = async (req) => {
        const uploadPromises = req.files.map(async (file) => {
            const { originalname, buffer } = file;
            const resultName = await this.generateName(originalname);
            const pathS3 = `foods/${resultName}`;
            const params = { Bucket: 'srpos', Key: pathS3, Body: buffer };
        
            return new Promise((resolve, reject) => {
              s3.upload(params, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(pathS3);
                }
              });
            });
        });
        
        const uploadedPaths = await Promise.all(uploadPromises);
    
        req.body.dish_gallery_urls = uploadedPaths;
    
        await dishGallery.create(req.body, { transaction });
    
        return { msg: 'Files uploaded to S3 successfully!' };
    }

    update = async  (id, req, transaction) => {
        const numUpdated = await dishGallery.update(req.body, {
            where: {dish_gallery_id: id},
            transaction: transaction
        });

        if (numUpdated == 0) {
            return { msg: 'Data Not Found' };
        }

        const response = await this.findOne(id)
    
        return response;
    }

    delete = async (id, transaction) => {
        const deleteData = await dishGallery.destroy({
            where: {
                dish_gallery_id: id
            },
            transaction: transaction
        })
        const response = (deleteData == 0 ? { msg: 'Data Not Found' } : { msg: 'Data Deleted' })
        return response;
    }

    generateName = async (name) => {
        const Extension = path.extname(name);
        var salt = bcryptjs.genSaltSync(12);
        let encripted = await bcryptjs.hash(generateRandomString(8),salt);
        encripted = encripted.replace(/\//g, '');

        return encripted + Extension
    }
}