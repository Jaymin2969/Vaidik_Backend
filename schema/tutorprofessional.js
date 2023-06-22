import mongoose from "mongoose";

const TutorProfessionalSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    degree_choice: { type: String, required: true },
    degree: { type: String, required: true },
    degree_image: { type: String, required: true },
    degree_specialisation: { type: String, required: true },
    clg_name: { type: String, required: true },
    clg_city: { type: String, required: true },
    gpa: { type: Number, required: true }

});
export default mongoose.model('TutorProfessional', TutorProfessionalSchema, 'TutorProfessional');
