import mongoose from "mongoose";

const CMSSchema = new mongoose.Schema({
    sortOrder: { type: Number, required: true },
    pageName: { type: String, required: true },
    contentText: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaKeyword: { type: String, required: true },
    metaDescription: { type: String, required: true },
    isactive: { type: Boolean, required: false, default: true }
},{ timestamps: true });

export default mongoose.model('CMS',CMSSchema,'CMS');