import mongoose from 'mongoose';

const TutorDocumentSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('TutorDocument', TutorDocumentSchema, 'TutorDocument');

