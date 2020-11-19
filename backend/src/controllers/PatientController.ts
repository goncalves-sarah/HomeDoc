import { Request, Response } from 'express';
import Patient from '../models/Patient';
import { getRepository } from 'typeorm';

import bcrypt from 'bcrypt-nodejs';
import jwt from 'jwt-simple';
import patients_view from '../views/patients_view';

import aws from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Image from '../models/Image';

const s3 = new aws.S3();

interface Img {
    originalname: string;
    size: number;
    filename: string;
    location?:string;
    path?:string;
    isAvatar?:boolean;
}

const obterHash =  (password: string,callback: any) => {
    bcrypt.genSalt(10, (err:Error,salt:string) => {
        bcrypt.hash(password,salt,null,(err:Error,hash:string) => callback(hash));
    });
}

export default {

    async canUserSignUp (req: Request,res: Response) {
        
        const patientRepository = getRepository(Patient);

        const patient = await patientRepository.find({
            where: ([{cpf:req.body.CPF},{email:req.body.email}])
        });
        
        
        if(patient.length === 1) {
            return res.status(400).json({message:'Usuário já cadastrado!'});
        } else {
            return res.status(200).send();
        }
    },

    async signin(req: Request,res: Response) {
        const { email, password } = req.body;
        
        if(!email || !password) {
            return res.status(400).json({message:'Dados incompletos'});
        }

        const patientRepository = getRepository(Patient);

        try {
            const patient = await patientRepository.findOneOrFail({
                where:[{email:email}]
            });
            
            bcrypt.compare(password,patient.password,(err,isMatch) => {
                if(err || !isMatch) {
                    return res.status(401).json({message:'Senha incorreta'});
                }

                const payload = {id: patient.id};
                const authSecret = process.env.authSecret as string;
                return res.status(200).json({
                    id: patient.id,
                    userType: 'paciente',
                    token: jwt.encode(payload, authSecret),
                });
            })
        } catch {
            return res.status(400).json({message:'Usuário não cadastrado!'});
        }
    },

    async updatePassword(req: Request,res: Response)  {
        const { id, newPassword, oldPassword } = req.body;
       
        const patientRepository = getRepository(Patient);
        
        try {
            const patient = await patientRepository.findOneOrFail({
                where:[{id:id}]
            });
            
            bcrypt.compare(oldPassword,patient.password,(err,isMatch) => {
                if(err || !isMatch) {
                    return res.status(401).json({message:'Senha incorreta'});
                }

                obterHash(newPassword, async (hash: string) => {
                    const password = hash;
        
                    patient.password = password;    
                
                    await patientRepository.save(patient);
        
                    return res.status(204).send();
                });
            });

        } catch {
            return res.status(400).send();
        }
    },

    async updateProfile(req: Request,res: Response) {
        let requestImages = req.files as Express.Multer.File[];
        
        const { isAvatar } = req.body;
        
        const { id } = req.params;
        
        const { 
            name,
            birthDate,
            email,
            CPF
        } = req.body;

        const patientRepository = getRepository(Patient);
        
        try {
            let updatedProfile = await patientRepository.findOneOrFail({
                where:{id},
                relations: ['images']
            });
            
            updatedProfile.name = name;
            updatedProfile.birthDate = birthDate;
            updatedProfile.email = email;
            updatedProfile.cpf = CPF;

            const imageRepository = getRepository(Image);
            
            //Adiciona novas imagens
            let images = requestImages.map((image:Img) => {
                return { 
                    url: process.env.STORAGE_TYPE === 'local' ? `${process.env.APP_URL}/pictures/${image.filename}` : image.location,
                    name:image.originalname, 
                    size: image.size,
                    key: image.filename,
                    isAvatar: image.originalname === isAvatar ? true : false,
                    patient: updatedProfile,
                }
            });
        
            if(isAvatar.length > 0) {

                const profilePic = updatedProfile.images.filter(img => img.isAvatar);
                
                const { key } = profilePic[0];
                
                if(process.env.STORAGE_TYPE == 's3') {
                    s3.deleteObject({
                        Bucket: 'homedocupload',
                        Key: `${key}`,
                    }).promise();
                } else {
                    promisify(fs.unlink)(path.resolve(__dirname, '..','..','public','uploads',key));
                }
                const { id } = profilePic[0];
                await imageRepository.delete(id);

                updatedProfile.images = updatedProfile.images.filter(img => !img.isAvatar);
            }
            
            //AJUSTAR
            images.map(async image => {
                await imageRepository.save(image);
            });
            
            await patientRepository.save(updatedProfile);
            return res.json(updatedProfile);
        } catch {
            return res.status(400).send("Not found");
        }
    },

    async show(req: Request,res: Response) {
        const { id } = req.params;

        const patientRepository = getRepository(Patient);

        try {
            const patient = await patientRepository.findOneOrFail(id,{
                relations:['images']
            });
            return res.json({patient:patients_view.render(patient)});
        } catch {
            return res.status(400).send("Not found");
        }
    },

    async create(req: Request,res: Response) {
      
        const requestImages = req.files as Express.Multer.File[];

        const { isAvatar } = req.body;

        const images = requestImages.map((image:Img) => {
            
            return { 
                url: process.env.STORAGE_TYPE === 'local' ? `${process.env.APP_URL}/pictures/${image.filename}` : image.location,
                name:image.originalname, 
                size: image.size,
                key: image.filename,
                isAvatar: image.originalname === isAvatar ? true : false
            }
        });

        obterHash(req.body.password, async (hash: string) => {
            const password = hash;

            const {
                name,
                latitude,
                longitude,
                birthDate,
                email,
                CPF
            } = req.body;
            
            const patientRepository = getRepository(Patient);
            
            const patient = patientRepository.create({
                name,
                latitude,
                longitude,
                birthDate,
                email,
                cpf:CPF,
                password,
                images
            });

            await patientRepository.save(patient);

            return res.status(201).json(patients_view.render(patient));
        })
    },
    async deleteProfile(req: Request,res: Response) {
        const {id} = req.params;
        const patientRepository = getRepository(Patient);

        try {
            const patient = await patientRepository.findOneOrFail({
                relations:['images'],
                where:{id}
            });

            const { images } = patient;

            images.map(img => {

                if(process.env.STORAGE_TYPE == 's3') {
                    s3.deleteObject({
                        Bucket: 'homedocupload',
                        Key: `${img.key}`,
                    }).promise();
                } else {
                    promisify(fs.unlink)(path.resolve(__dirname, '..','..','public','uploads',img.key));
                }
            })

            await patientRepository.delete(patient.id);

            return res.status(200).json({message:"Usário deletado com sucesso!"});
        } catch {
            return res.status(400).json({message:"Houve um problema, tente novamente!"});
        }
    }
}