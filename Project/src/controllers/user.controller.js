import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
const registerUser =asyncHandler(async(req,res)=>{
  //get user details from frontend
  //validation-not empty
  //check if user already exists: username,email
  //check for images and avtar
  //upload then to cloudinary
  //create user object-create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  const {fullname,email,username,password}=req.body
  console.log("fullname:",fullname);
  if(
[fullname,email,username,password].some((field)=>field?.trim()==="")
  ){
      throw new ApiError(400,"all fields are required")

  }
  const existedUser=User.findOne({
    $or:[{username},{email}]
  })
  if(existedUser){
    throw new ApiError(400,"user with email or username already exists")

  }
const avtarLocalPath=req.files?.avtar[0]?.path;
const coverImageLocalPath=req.files?.coverImage[0]?.path
if(!avtarLocalPath){
  throw new ApiError(400,"avtar file is required")
}
const avtar=await uploadOnCloudinary(avtarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avtar){
  throw new ApiError(400,"user with email or username already exists")
}

const user=await User.create({
  fullname,
  avtar:avtar.url,
  coverImage:coverImage?.url || "",
  email,
  password,
  username:username.toLowerCase()
})

const createdUser=await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500,"something went wrong while registering the user")
}

return res.status(201).json(
  new ApiResponse(200,createdUser,"User Registered sucessfully")
)
})


export {
    registerUser,
    
}