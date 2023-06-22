import mongoose from "mongoose";

const SocialMediaSchema = new mongoose.Schema({
    Facebook: { type: String, required: true },
    LinkedIn: { type: String, required: true },
    Twitter: { type: String, required: true },
    YouTube: { type: String, required: true },
    Instagram: { type: String, required: true }
},{ timestamps: true });

export default mongoose.model('SocialMedia',SocialMediaSchema, 'SocialMedia');