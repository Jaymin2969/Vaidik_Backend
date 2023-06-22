import mongoose from 'mongoose';

const StudentWalletSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Studentregister', required: true },
    totalAmount: { type: Number, required: false, default: 0 },
    availableAmount: { type: Number, required: false, default: 0 },
    paidAmount: { type: Number, required: false, default: 0 },
    depositAmount: { type: Number, required: false, default: 0 },
    referralAmount: { type: Number, required: false, default: 0 },
    redeemableAmount: { type: Number, required: false, default: 0 },
    walletHistory: [{
        transactionId: { type: String, required: true, unique: true },
        date: { type: Date, required: true },
        type: { type: String, enum: ['Deposit', 'Withdrawal', 'Refund', 'Question posted', 'Partial Refund', 'Partial Charge', 'Referral', 'Referfriend'], required: true },
        amount: { type: Number, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ['Success', 'Failed'], required: true },
        balance: { type: Number, required: true },
        referstudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Studentregister', required: false },
    }],
    isSubscribed: { type: Boolean, default: false },
    planType: { type: String, required: false, default: " " },
    planStartingDate: { type: Date, required: false },
    planEndingDate: { type: Date, required: false },
    planPrice: { type: Number, required: false, default: 0 },
    questionsAvailable: { type: Boolean, default: false },
    questionsRemaining: { type: Number, required: false, default: 0 }
});

export default mongoose.model('StudentWallet', StudentWalletSchema, 'StudentWallet');
