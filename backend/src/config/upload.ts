import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import { Request } from 'express';

const storageTypes = {
    local: multer.diskStorage({
        destination: (req,file,cb) => {
            cb(null,path.resolve(__dirname, '..','..','public','uploads'));
        },
        filename: (req,file,cb) => {
            crypto.randomBytes(16,(err,hash) => {
                if(err) cb(err,'');
                
                file.filename  = `${hash.toString('hex')}-${file.originalname}`;
                cb(null,file.filename);
            })
        }
    }),
    s3:  multerS3({
        s3: new aws.S3(),
        bucket: 'homedocupload',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req:any,file:any,cb:any) => {
            crypto.randomBytes(16,(err,hash) => {
                if(err) cb(err);

                file.filename = `${hash.toString('hex')}-${file.originalname}`;

                cb(null,file.filename);
            })
        },
    })
}

export default {
    
    dest: path.resolve(__dirname, '..','public','uploads'),
    storage: storageTypes['local'],
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req: Request,file: Express.Multer.File,cb:any) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/jpg'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null,true);
        } else {
            cb(new Error('Invalid file type.'));
        }
    },
}