import mongoose from "mongoose";

const QuestionTimingSchema = new mongoose.Schema({
  Type: {
    type: String,
    required: true
  },
  first_time: {
    type: Number,
    required: false
  },
  second_time: {
    type: Number,
    required: false
  },
  skip_time: {
    type: Number,
    required: false
  },
  total_time: {
    type: Number,
    required: false
  },
  tutor_time: {
    type: Number,
    required: false
  },
  admin_time: {
    type: Number,
    required: false
  },
  unsolved_time: {
    type: Number,
    required: false
  }
});

export default mongoose.model('QuestionTiming', QuestionTimingSchema, 'QuestionTiming');

