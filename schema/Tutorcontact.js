import mongoose from 'mongoose';

const TutorContactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    fullname: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true},
    Message: { type: String,required: true },
    issolved: { type: Number,required: false, default: 0 }
});


export default mongoose.model('TutorContact', TutorContactSchema, 'TutorContact');
