import mongoose from 'mongoose';

const StudentContactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: true },
    fullname: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true},
    Message: { type: String,required: true },
    issolved: { type: Number,required: false, default: 0 }
});


export default mongoose.model('StudentContact', StudentContactSchema, 'StudentContact');
