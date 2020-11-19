import { Router } from 'express';
import DoctorController from './controllers/DoctorController';
import PatientController from './controllers/PatientController';
import ImageController from './controllers/ImageController';

import multer from 'multer';
import uploadConfig from './config/upload';

const routes = Router();
const upload = multer(uploadConfig);

routes.get('/find/doctors',DoctorController.index);
routes.get('/doctor/profile/:id',DoctorController.show);
routes.get('/patient/profile/:id',PatientController.show)
routes.get('/pictures',ImageController.getAll);
routes.get('/pictures/:id',ImageController.getPicture);

routes.post('/doctor/signup',upload.array('images'),DoctorController.create);
routes.post('/doctor/signin',DoctorController.signin);
routes.post('/doctor',DoctorController.canUserSignUp);
routes.post('/patient/signup',upload.array('images'),PatientController.create);
routes.post('/patient/signin',PatientController.signin);
routes.post('/patient',PatientController.canUserSignUp);

routes.put('/doctor/update/password',DoctorController.updatePassword);
routes.put('/doctor/update/:id',upload.array('images'),DoctorController.updateProfile);
routes.put('/patient/update/password',PatientController.updatePassword);
routes.put('/patient/update/:id',upload.array('images'),PatientController.updateProfile);

routes.delete('/delete/pictures/:id',ImageController.deletePicture);
routes.delete('/delete/doctor/:id',DoctorController.deleteProfile);
routes.delete('/delete/patient/:id',PatientController.deleteProfile);

export default routes;