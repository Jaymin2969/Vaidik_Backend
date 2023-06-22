import mongoose from "mongoose";

const StudentRegisterBonusSchema = new mongoose.Schema({
    price: { type: Number, required: true }
},{ timestamps: true });
export default mongoose.model('StudentRegisterBonus', StudentRegisterBonusSchema, 'StudentRegisterBonus');
