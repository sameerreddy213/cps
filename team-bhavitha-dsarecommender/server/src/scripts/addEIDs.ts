// scripts/addEIDs.ts
import mongoose from "mongoose";
import EducatorID from "../models/EducatorID";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGO_URI || "");

  const eids = [
    "1234567890123456",
    "1111222233334444",
    "5555666677778888"
  ];

  await EducatorID.insertMany(eids.map(eid => ({ eid })));

  console.log("EIDs inserted");
  mongoose.disconnect();
})();
