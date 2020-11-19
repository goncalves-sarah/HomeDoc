import passport, { authenticate } from 'passport';
import passportJwt from 'passport-jwt';
const { Strategy, ExtractJwt } = passportJwt;

import { getRepository } from 'typeorm';
import Doctor from '../models/Doctor';
import Patient from '../models/Patient';

export default function Passport() {
    const params = {
        secretOrKey: process.env.authSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    }

    const strategy = new Strategy(params, async (payload,done) => {

        const doctorRepository = getRepository(Doctor);
        const patientRepository = getRepository(Patient);
       
        doctorRepository.findOneOrFail({
            where: ([{id:payload.id}])
        })
        .then(doctor => {
            const {id,email,name,birthDate,cellphone,crm} = doctor;
            done(null, {id,email,name,birthDate,cellphone,crm});
        })
        .catch(_ => {
            patientRepository.findOneOrFail({
                where: ([{id:payload.id}])
            })
            .then(patient => {
                const {id,email,name,birthDate,cpf} = patient;
                done(null, {id,email,name,birthDate,cpf});
            })
            .catch(err => {
                done(err,false);
            })

        })
    })

    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', {session: false})
    }

}
