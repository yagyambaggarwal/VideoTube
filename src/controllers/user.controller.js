import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req, res)=>{
    // get user details from frontend
    // validation -> Not empty
    // check if user already exists: using username and email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res



    // get user details from frontend
    const {fullName, email, username, password} = req.body
    console.log(`fullname: ${fullName} email: ${email}, passowrd: ${password}`);

    // validation -> Not empty
    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All the fields are needed.")
    }
    
    // check if user already exists: using username and email
    const existedUser = User.find({
        $or: [{ email }, { username }]
    })

    if(existedUser){
        throw new ApiError(409, "User already exists: Please enter unique username and email.")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath)throw new ApiError(400, "Avatar is required.")


    // upload them to cloudinary, avatar    
    const avatar = await uploadOnCloudinary(avatarLocalPath);    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // Check if avatar is uploaded on cloudinary
    if(!avatar)throw new ApiError(400, "Avatar not found")


    // create user object - create entry in db
    const user = await User.create(
        {
            fullName,
            avatar : avatar.url,
            coverImage : coverImage?.url || "",
            email,
            password,
            username: username.toLowerCase() 
        }
    )

    // check for user creation & 
    //if created remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser)throw new ApiError(500, "Something went wrong while registering the user on server side.")

    
    // return res
    return new ApiResponse(201, "User Registered Successfuly", createdUser) 
})



export {registerUser}