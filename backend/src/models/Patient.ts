import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Image from './Image';

@Entity('patients')
export default class Patient {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @Column()
    birthDate: Date;

    @Column()
    email: string;

    @Column()
    cpf: string;

    @Column()
    password: string;

    @OneToMany(() => Image, image => image.patient, {
        cascade: ['insert','update']
    })
    @JoinColumn({name:'patientId'})
    images: Image[];
}