import Patient from '../models/Patient';
import imagesView from './images_view';

export default {
    render(patient: Patient) {
        return {
            id:patient.id,
            name:patient.name,
            birthDate:patient.birthDate,
            email:patient.email,
            CPF:patient.cpf,
            images: imagesView.renderMany(patient.images)
        }
    },

    renderMany(patients: Patient[]) {
        return patients.map(patient => this.render(patient))
    }
}