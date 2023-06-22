import mongoose from "mongoose";

const TutorPersonalSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    profilephoto: { type: String, required: false, default: ""},
    name: { type: String, required: true },
    mobileNo: { type: String, required: true},
    country: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: String, required: true },
    experience: { type: Number, required: true },
});
export default mongoose.model('TutorPersonal', TutorPersonalSchema, 'TutorPersonal');
