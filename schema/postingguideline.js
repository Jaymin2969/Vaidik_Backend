import mongoose from 'mongoose';

const PostingguidelineSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('Postingguideline', PostingguidelineSchema, 'Postingguideline');

