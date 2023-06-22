import mongoose from "mongoose";

const StudentOTPSchema = new mongoose.Schema({
    mobileNo: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt:{
        type: Date,
        default: Date.now,
        index: { expires: 600 }
    }
},{ timestamps: true });
export default mongoose.model('StudentOTP', StudentOTPSchema, 'StudentOTP');
