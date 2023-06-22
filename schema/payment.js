import mongoose from "mongoose";

const PaymentGatewaySchema = new mongoose.Schema({
  name: { type: String, required: true },
  isactive: { type: Boolean, default: false },
  publicKey: { type: String },
  privateKey: { type: String },
  merchantId: { type: String },
  accessCode: { type: String },
  workingKey: { type: String }
});

export default mongoose.model('PaymentGateway', PaymentGatewaySchema, 'PaymentGateway');