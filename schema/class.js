import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  studentClass: {
    type: String,
    required: true
  }
});

export default mongoose.model('Class', ClassSchema, 'Class');

