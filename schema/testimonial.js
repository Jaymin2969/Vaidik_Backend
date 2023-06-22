import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
    sortOrder: { type: Number, required: true },
    profileimage: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isactive: { type: Boolean, required: false, default: true }
},{ timestamps: true });

export default mongoose.model('Testimonial',TestimonialSchema, 'Testimonial');