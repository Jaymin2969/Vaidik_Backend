import mongoose from "mongoose";

const AdminPagesSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subpages: [{ type: String, required: false }]
});

export default mongoose.model('AdminPages', AdminPagesSchema, 'AdminPages');