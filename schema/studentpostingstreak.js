import mongoose from 'mongoose';

const StudentPostingStreakSchema = new mongoose.Schema({
    initial : { type: Number , required: false },
    extrasum: { type: Number , required: false },
    referralpersonalreward: { type: Number , required: false },
    referralotherreward: { type: Number , required: false },
    paymentcondition: { type: Number , required: false }
});

export default mongoose.model('StudentPostingStreak', StudentPostingStreakSchema, 'StudentPostingStreak');
