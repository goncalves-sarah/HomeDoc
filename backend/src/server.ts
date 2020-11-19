import express from 'express';
import morgan from 'morgan';
import './database/connection';
import Passport from './config/passport';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({path:'../.env'});

import routes from './routes';
import errorHandler from './errors/handler';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use('/pictures',express.static(path.resolve(__dirname, '..' , 'public' , 'uploads')));
app.use(routes);
app.use(errorHandler);

app.listen(8000);
