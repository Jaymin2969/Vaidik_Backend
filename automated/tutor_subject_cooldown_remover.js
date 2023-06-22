import mongoose from "mongoose";
import cron from "cron";
import { TutorSubjectsSchema } from "../schema/index.js"
import  { connectDB } from "../database/index.js";
connectDB();


// Schedule a cron job to check for expired cooldownPeriods every day at midnight
const cooldownRemover = new cron.CronJob('0 0 * * *', async () => {
  console.log('Checking for expired cooldownPeriods...');
  
  try {
    const currentDate = new Date();
    const expiredCooldowns = await TutorSubjectsSchema.find({
      "subjectsWithCooldown.cooldownPeriod": { $lt: currentDate }
    });
    
    if (expiredCooldowns.length) {
      console.log(`Removing ${expiredCooldowns.length} expired cooldownPeriods...`);
      
      for (const subject of expiredCooldowns) {
        subject.subjectsWithCooldown = subject.subjectsWithCooldown.filter((s) => s.cooldownPeriod > currentDate);
        await subject.save();
      }
      
      console.log('Expired cooldownPeriods removed successfully.');
    } else {
      console.log('No expired cooldownPeriods found.');
    }
  } catch (error) {
    console.error('Error while removing expired cooldownPeriods:', error);
  }
});

cooldownRemover.start();
