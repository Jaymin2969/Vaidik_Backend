import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('Image', ImageSchema, 'Images');

