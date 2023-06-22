import mongoose from 'mongoose';

const AdminContactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    fullname: { type: String, required: true },
    mobileNo: { type: String, required: true },
    email: { type: String, required: true},
    Message: { type: String,required: true }
});


export default mongoose.model('AdminContact', AdminContactSchema, 'AdminContact');
