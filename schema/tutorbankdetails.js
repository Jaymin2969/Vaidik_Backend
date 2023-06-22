import mongoose from "mongoose";

const TutorBankDetailsSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    bankcountry: { type: String, required: false },
    Tutorbankname: { type: String, required: false },
    bankName: { type: String, required: false },
    accountNumber: { type: String, required: false },
    IFSCCode: { type: String, required: false },
    accountType: { type: String, required: false },
    panCard: { type: String, required: false }
});
export default mongoose.model('TutorBankDetails', TutorBankDetailsSchema, 'TutorBankDetails');
