import Doctor from '../models/Doctor';
import imagesView from './images_view';

export default {
    render(doctor: Doctor) {
        return {
            id:doctor.id,
            name:doctor.name,
            birthDate:doctor.birthDate,
            email:doctor.email,
            cellphone:doctor.cellphone, 
            CRM:doctor.crm,
            specialty:doctor.specialty,
            about:doctor.about,
            city:doctor.city,
            consult_price:doctor.consult_price,
            images: imagesView.renderMany(doctor.images)
        }
    },

    renderMany(doctors: Doctor[]) {
        return doctors.map(doctor => this.render(doctor))
    }
}