import mongoose from "mongoose";

const CurrencyConversionSchema = new mongoose.Schema({
  Currency: {
    type: String,
    required: true
  },
  ConversionToInr: {
    type: Number,
    required: true
  }
});

export default mongoose.model('CurrencyConversion', CurrencyConversionSchema, 'CurrencyConversion');

