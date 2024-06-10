import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {

//get user details from frontend
  //validation-not empty
  //check if user already exists: username,email
  //check for images and avtar
  //upload then to cloudinary
  //create user object-create entry in db
  //remove password and refresh token field from response
  //check for user creation
  //return response

  const { fullname, email, username, password } = req.body;
  //console.log("fullname:", fullname);

  // Validate input fields
  if ([fullname, email, username, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Check for avatar and cover image files
  const avtarLocalPath = req.files?.avtar[0]?.path;
  const coverImageLocalPath = req.files?.CoverImage?.[0]?.path;
  if (!avtarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // Upload files to Cloudinary
  const avtar = await uploadOnCloudinary(avtarLocalPath);
  const CoverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avtar) {
    throw new ApiError(500, "Failed to upload avatar to Cloudinary");
  }

  // Create user object in database
  const user = await User.create({
    fullname,
    avtar: avtar.url,
    CoverImage: CoverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
  });

  // Remove sensitive fields and fetch the created user
  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Return the response
  return res.status(201).json(
    new ApiResponse(200, createdUser, "User Registered successfully")
  );
});

export {
  registerUser,
};
