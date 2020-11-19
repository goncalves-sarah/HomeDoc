import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import Image from './Image';

@Entity('doctors')
export default class Doctor {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    birthDate: Date;

    @Column()
    email: string;

    @Column()
    cellphone: string;

    @Column()
    crm: string;

    @Column()
    specialty: string;

    @Column()
    about: string;

    @Column()
    city: string;

    @Column()
    consult_price: string;

    @Column()
    password: string;

    @OneToMany(() => Image, image => image.doctor, {
        cascade: ['insert','update']
    })
    @JoinColumn({name:'doctorId'})
    images: Image[];
}