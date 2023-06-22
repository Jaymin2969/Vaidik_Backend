import mongoose from "mongoose";

const TokenTutorSchema = new mongoose.Schema({

    token: { type: String, unique: true },
    expiresAt: {
        type: Date,
        required: true,
        // expires: 60 // token expires in 60 seconds
      }

});

TokenTutorSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600*24 });

export default mongoose.model('TokenTutor', TokenTutorSchema, 'TutorTokens');