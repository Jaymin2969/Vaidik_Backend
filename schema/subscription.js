import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema({
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  isactive: { type: Boolean, required: false, default: true }
}, { timestamps: true });

export default mongoose.model('Subscription', SubscriptionSchema, 'Subscription');