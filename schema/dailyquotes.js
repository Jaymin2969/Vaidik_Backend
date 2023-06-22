import mongoose from 'mongoose';

const DailyQuotesSchema = new mongoose.Schema({
    quote: { type: String, required: true },
    author: { type: String, required: true },
    day: { type: Number, required: true }
});

export default mongoose.model('DailyQuotes', DailyQuotesSchema, 'DailyQuotes');
