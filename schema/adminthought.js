import mongoose from "mongoose";

const AdminThoughtSchema = new mongoose.Schema({
    thought: { type: String, required: true }
});

export default mongoose.model('AdminThought',AdminThoughtSchema, 'AdminThought');



