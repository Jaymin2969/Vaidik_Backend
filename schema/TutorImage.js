import mongoose from 'mongoose';

const TutorImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('TutorImage', TutorImageSchema, 'TutorImage');

