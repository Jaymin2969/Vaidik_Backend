import mongoose from 'mongoose';

const StaticLogoSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

export default mongoose.model('StaticLogo', StaticLogoSchema, 'StaticLogo');

