import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import Doctor from './Doctor';
import Patient from './Patient';

@Entity('images')
export default class Image {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    name: string;

    @Column()
    size: number;

    @Column()
    url: string;

    @Column()
    key: string;

    @Column()
    isAvatar: boolean;

    @ManyToOne(() => Doctor, doctor => doctor.images)
    @JoinColumn({name: 'doctorId'})
    doctor: Doctor;

    @ManyToOne(() => Patient, patient => patient.images)
    @JoinColumn({name: 'patientId'})
    patient: Patient;
}