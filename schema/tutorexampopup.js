import mongoose from "mongoose";

const TutorExamPopUpSchema = new mongoose.Schema({
    content: { type: String, required: true }
});

export default mongoose.model("TutorExamPopUp", TutorExamPopUpSchema, "TutorExamPopUp");