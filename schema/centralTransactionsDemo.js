import mongoose from "mongoose";

const CentralTransactionsDemoSchema = new mongoose.Schema({
    category: { type: String, enum: ['Student', 'Tutor'], required: true },
    walletId: { type: mongoose.Schema.Types.ObjectId, required: true },
    transactionId: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['Deposit', 'Withdrawal', 'Refund', 'Question posted', 'Partial Refund', 'Partial Charge', 'Referral', 'Chargeback', 'Answer given'], required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: false },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['Success', 'Pending', 'Failed'], required: true },
    balance: { type: Number, required: true },
  });

  export default mongoose.model('CentralTransactionsDemo', CentralTransactionsDemoSchema, 'CentralTransactionsDemo');