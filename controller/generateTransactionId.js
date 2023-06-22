import mongoose from 'mongoose';
import { counterSchema } from '../schema/index.js';

export default async function generateTransactionId() {
  const session = await mongoose.startSession();
  let transactionId;

  try {
    await session.withTransaction(async () => {
      // Acquire a lock on the counter document
      await counterSchema.findOneAndUpdate(
        { _id: "transactionId" },
        {},
        { session, new: true, upsert: true, setDefaultsOnInsert: true }
      ).exec();

      // Get the current sequence value and increment it
      const counter = await counterSchema.findOneAndUpdate(
        { _id: "transactionId" },
        { $inc: { sequence_value: 1 } },
        { new: true, session }
      ).exec();

      transactionId = `T${counter.sequence_value.toString().padStart(10, "0")}`;
    });
  } finally {
    session.endSession();
  }

  return transactionId;
}
