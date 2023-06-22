import mongoose from "mongoose";

const QuestionPricingSchema = new mongoose.Schema({
  Type: {
    type: String,
    required: true
  },
  question_price: {
    type: Number,
    required: true
  },
  tutor_price: {
    type: Number,
    required: true
  },
  admin_price: {
    type: Number,
    required: true
  }
});

export default mongoose.model('QuestionPricing', QuestionPricingSchema, 'QuestionPricing');

