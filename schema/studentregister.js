import mongoose from 'mongoose';

const StudentRegisterSchema = new mongoose.Schema({
    email: { type: String, required: true , unique: true},
    password: { type: String, required: false },
    mobileNo: { type: String, required: false },
    googleId: { type: String, required: false },
    class: { type: String, required: false },
    registerType: { type: String, enum: ['google', 'email'], required: true },
    referralCode: { type: String, optional: false },
    emailverified: { type: Number, required: false, default: 0 },
    googleverified: { type: Number, required: false, default: 0 }
},{timestamps: true});
export default mongoose.model('StudentRegister', StudentRegisterSchema, 'StudentRegister');
