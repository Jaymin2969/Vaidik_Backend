import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminRole', required: false },
  isactive: { type: Number, required: false },
  isdeletable: { type: Number, required: false }
});

export default mongoose.model('Admin', AdminSchema, 'Admin');
