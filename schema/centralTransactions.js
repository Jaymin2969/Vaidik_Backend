import mongoose from "mongoose";

const CentralTransactionsSchema = new mongoose.Schema({
    category: { type: String, enum: ['Student', 'Tutor'], required: true },
    walletId: { type: mongoose.Schema.Types.ObjectId, required: true },
    transactionId: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Deposit', 'Withdrawal', 'Refund', 'Question posted', 'Partial Refund', 'Partial Charge', 'Referral', 'Chargeback', 'Answer given', 'Referfriend'], required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: false },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], required: true },
    balance: { type: Number, required: true },
    isCounted: { type: Number, required: false, default: 0 },
    referstudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: false },
    refertutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: false }
  });

  export default mongoose.model('CentralTransactions', CentralTransactionsSchema, 'CentralTransactions');