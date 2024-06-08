import mongoose from "mongoose";

const doctorScehma=new mongoose.Schema({
    name:{
       
            type:String,
            required:true
           
    },
    salary:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    expirenceInYears:{
        type:Number,
        default:0
    },
    worksInHospitals:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hospital",
    }
},{timestamps:true})
export const Doctor=mongoose.model("Doctor",doctorScehma)