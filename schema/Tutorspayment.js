import mongoose from "mongoose";

const TutorsPaymentSchema = new mongoose.Schema({
    startdate: { type: Date, required: true },
    enddate: { type: Date, required: true },
    pendingAmount: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    transaction: [{
        tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
        email: { type: String, required: true },
        name: { type: String, required: true },
        bankdetails: [{
            bankcountry: { type: String, required: false },
            Tutorbankname: { type: String, required: false },
            bankName: { type: String, required: false },
            accountNumber: { type: String, required: false },
            IFSCCode: { type: String, required: false },
            accountType: { type: String, required: false },
            panCard: { type: String, required: false }
        }],
        amount: { type: Number, required: true },
        isPaymentDone: { type: Number, required: true, default: 0 },
        howMuchPaymentDone: { type: Number, required: true, default: 0 },
        isPaymentCompleted: { type: Number, required: true, default: 0 },
        tran_ids_remaining: [ { type: String, required: false } ],
        tran_ids_completed: [ { type: String, required: false } ],
        finalTransactionIds: [ { type: String, required: false } ] 
    }]
});

export default mongoose.model('TutorsPayment', TutorsPaymentSchema, 'TutorsPayment');