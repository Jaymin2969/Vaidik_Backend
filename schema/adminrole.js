import mongoose from 'mongoose';

const AdminRoleSchema = new mongoose.Schema({
  rolename: { type: String, required: true, unique: true },
  action: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdminPages', required: true }],
  isdeletable: { type: Number, required: false }
});

export default mongoose.model('AdminRole', AdminRoleSchema, 'AdminRole');