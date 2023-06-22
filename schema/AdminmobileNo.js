import mongoose from "mongoose";

const AdminMobileNoSchema = new mongoose.Schema({
    mobileNo: { type: String, required: true }
});

export default mongoose.model('AdminMobileNo',AdminMobileNoSchema, 'AdminMobileNo');