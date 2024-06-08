import mongoose from "mongoose";
const medicalRecordScehma=new mongoose.Schema({},{timestamps:true})
export const MedicalRecord=mongoose.model("MedicalRecord",medicalRecordScehma)