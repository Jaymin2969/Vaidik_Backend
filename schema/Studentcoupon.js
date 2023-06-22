import mongoose from "mongoose";

const StudentCouponSchema = new mongoose.Schema({
    couponCode: { type: String, required: true },
    validityDate: { type: Date, required: true },
    discount: { type: Number, required: true }
},{ timestamps: true });

export default mongoose.model('StudentCoupon',StudentCouponSchema, 'StudentCoupon');