import mongoose from "mongoose";

const TutorWalletSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    totalAmount: { type: Number, required: false, default: 0 },
    availableAmount: { type: Number, required: false, default: 0 },
    pendingAmount: { type: Number, required: false, default: 0 },
    earningAmount: { type: Number, required: false, default: 0 },
    paidAmount: { type: Number, required: false, default: 0 },
    walletHistory: [{
        transactionId: { type: String, required: true, unique: true },
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: false },
        date: { type: Date, required: true },
        type: { type: String, enum: ['Withdrawal', 'Chargeback', 'Answer given', 'Referral', 'Referfriend'], required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ['Success', 'Pending', 'Failed'], required: true },
        balance: { type: Number, required: true },
        isCounted: { type: Number, required: false, default: 0 },
        refertutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: false },
    }]
});
export default mongoose.model('TutorWallet', TutorWalletSchema, 'TutorWallet');
