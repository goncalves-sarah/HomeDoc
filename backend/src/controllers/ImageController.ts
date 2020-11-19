import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Image from '../models/Image';

import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

import images_view from '../views/images_view';


const s3 = new aws.S3();

export default {

    async deletePicture(req: Request,res: Response) {
        const { id } = req.params;

        const imageRepository = getRepository(Image);

        try {
            const image = await imageRepository.findOneOrFail(id);
    
            const { key } = image;
    
            if(process.env.STORAGE_TYPE == 's3') {
                s3.deleteObject({
                    Bucket: 'homedocupload',
                    Key: `${key}`,
                }).promise();
            } else {
                promisify(fs.unlink)(path.resolve(__dirname, '..','..','public','uploads',key));
            }
    
            await imageRepository.delete(id);
        
            res.status(200).send();
        }catch {
            res.status(404).send("Picture not found!");
        }
    },

    async getPicture(req: Request,res: Response) {
        const { id } = req.params;

        const imageRepository = getRepository(Image);
        
        try{
            const image = await imageRepository.findOneOrFail(id);
            return res.json(images_view.render(image));
        } catch {
            return res.status(404).send("Picture not found!");
        }
        
    },

    async getAll(req: Request,res: Response) {
        const imageRepository = getRepository(Image);

        const images= await imageRepository.find();

        return res.json(images_view.renderMany(images));
    }

}