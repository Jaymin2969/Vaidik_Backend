import mongoose from 'mongoose';

const AnsweringguidelineSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('Answeringguideline', AnsweringguidelineSchema, 'Answeringguideline');

