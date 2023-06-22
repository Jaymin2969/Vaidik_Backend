import mongoose from "mongoose";

const ReAnswerChoiceSchema = new mongoose.Schema({
  choice: {
    type: Boolean,
    required: false,
    default: true
  }, 
  reanswer_time: {
    type: Number,
    required: false
   }
});

export default mongoose.model('ReAnswerChoice', ReAnswerChoiceSchema, 'ReAnswerChoice');

