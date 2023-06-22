import mongoose from "mongoose";

const TutorMinBalanceSchema = new mongoose.Schema({
    minBalance: { type: Number, required: true }
});
export default mongoose.model('TutorMinBalance', TutorMinBalanceSchema, 'TutorMinBalance');
