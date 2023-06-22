import mongoose from 'mongoose';

const TestimonialImageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('TestimonialImage', TestimonialImageSchema, 'TestimonialImage');

