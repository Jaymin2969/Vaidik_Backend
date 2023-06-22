import mongoose from 'mongoose';

const TutorPostingStreakSchema = new mongoose.Schema({
    initial : { type: Number , required: false },
    extrasum: { type: Number , required: false },
    referralpersonalreward: { type: Number , required: false },
    referralotherreward: { type: Number , required: false, default: 0 }
});

export default mongoose.model('TutorPostingStreak', TutorPostingStreakSchema, 'TutorPostingStreak');
