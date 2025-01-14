import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  //Get user detaials from user
  //Check validation for user details
  //Check if user already exists: username, email
  //check for images : optional cover image and required avatar image
  //Upload them to cloudinary
  //Create entry in database for user
  //remove password, refresh token from response
  //check for user creation
  //return response
  const { fullName, username, email, password } = req.body;
  if ([fullName, username, email, password].some((field) => field === "")) {
    throw new ApiError(400, "Username is required");
  }

  const existingUser = User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  const user = User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Failed to create user");
  }

  console.log(fullName, username, email);
  res.status(201).json(new ApiResponse(201, createdUser, "User created"));
  close();
});

export { registerUser };
