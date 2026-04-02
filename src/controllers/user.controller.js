import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return {
            accessToken, 
            refreshToken
        }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}




// Register

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
    console.log(`fullname: ${fullName} email: ${email}, passowrd: ${password}, Username ${username}`);

    // validation -> Not empty
    if([fullName, email, username, password].some((field) => field === "")){
        throw new ApiError(400, "All the fields are needed.")
    }
    
    // check if user already exists: using username and email
    const existedUser = await User.find({
        $or: [{ email }, { username }]
    })

    if(existedUser.length > 0){
        throw new ApiError(409, "User already exists: Please enter unique username and email.")
    }

    // check for images, check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath)throw new ApiError(400, "Avatar is required.")


    // upload them to cloudinary, avatar    
    const avatar = await uploadOnCloudinary(avatarLocalPath);    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

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
            username: username
        }
    )

    // check for user creation & 
    //if created remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser)throw new ApiError(500, "Something went wrong while registering the user on server side.")
    else {
        console.log("User is registered: ", createdUser);
        console.log("----------------------------------");
        console.log("User: ", user);
    }
    // return res
    return res.status(201).json(new ApiResponse(201, "User Registered Successfuly", createdUser)) 
})




// Login

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    // find the user
    // password check
    // access and refresh token
    // send cookie

    const {username, email, password} = req.body;

    console.log(username, password, email);

    if(!username && !email){
        throw new ApiError(400, "username or email is required");
    }

    if(!password)throw new ApiError(400, "Password is required");
    
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    
    if(!user){
        throw new ApiError(404, "User Not Found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid password");
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        // if NODE_ENV = production then secure true else false 
        secure : process.env.NODE_ENV === "production"
    }


    console.log(user ," successfully logged in as ", loggedInUser)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    // A sample cookie just to show that we can send any cookie to browser
    .cookie("sample_cookie", "This cookie is very tasty", options)
    .json(
        new ApiResponse(
            200,
            "User successfully logged In",
            {
                user : loggedInUser,
                accessToken : accessToken,
                refreshToken : refreshToken
            },
        )
    )

})





// logout

const logoutUser = asyncHandler(async(req, res) => {
    // Still works 

    // const user = req.user;
    // user.refreshToken = undefined;

    // await user.save({validateBeforeSave : false})

    // Better Approach

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : { refreshToken : ""}
        },
        {
            new : true
        }
    );

    const options = {
        httpOnly : true,
        // if NODE_ENV = production then secure true else false 
        secure : process.env.NODE_ENV === "production"
    }

    console.log("User Logged Out Successfully.")

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .clearCookie("sample_cookie", options)
    .json(new ApiResponse(200, "User Logged Out Successfully!"));
})





// refresh tokens
const refreshTokens = asyncHandler(async (req, res) => {
    const oldRefreshToken = req.cookies.refreshToken;

    if(!oldRefreshToken)throw new ApiError(401, "Refresh token missing.")
    
    let decoded
    try {
        decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid Refresh Token.")
    }

    const {accessToken : newAccessToken, refreshToken : newRefreshToken} = await generateAccessAndRefreshToken(decoded._id)

    const options = {
        httpOnly : true,
        secure : process.env.NODE_ENV === "production" 
    }

    console.log("New tokens are set.")

    return res.status(201)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .cookie("sample-cookie", "The cookies are very tasty", options)
    .json(new ApiResponse(
        201,
        "New cookies are set",
        {
            newAccessToken, newRefreshToken
        }
    ))
})






// change Current password
const changeCurrentPassword = asyncHandler(async (req, res) => {

    const { oldPassword, newPassword } = req.body;

    const user = req.user;

    const isValidPassword = await user.isPasswordCorrect(oldPassword);
    if(!isValidPassword){
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    
    await user.save({validateBeforeSave : false});


    return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}))

});






// get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
    .status(200)
    .json(new ApiResponse(200, "Current user fetched successfully", req.user));
}) 





// Update account details (WE'LL MAKE FILE UPDATION ROUTES SEPARATELY)
const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;

    if( !fullName && !email ){
        throw new ApiError(400, "All fields are required!");
    }

    const user = User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                fullName,
                email
            }
        },
        {
            new : true
        }
    )
    .select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, "Credentials are updated", user))
})





// Update file based account details (avatar)
const updateAvatar = asyncHandler(async (req, res) => {
    const user = req.user;
    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required.")
    }
    try {
        const avatar = await uploadOnCloudinary(avatarLocalPath);

        if(!avatar || !avatar.url){
            throw new ApiError(500, "Error while uploading avatar");
        }

        user.avatar = avatar.url;
    
        await user.save({validateBeforeSave : false});
    
        return res
        .status(200)
        .json(new ApiResponse(200, "Avatar updated", {avatar : user.avatar}))
    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong in Avatar updation.")
    }
})





// Updating CoverImage
const updateCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "CoverImage is needed.")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!coverImage || !coverImage.url)
        throw new ApiError(500, "Something went wrong while uploading cover image to cloudinary.");


    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                coverImage : coverImage.url
            }
        },
        {
            new : true
        }
    ).select("-password -refreshToken")


    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Cover Image is updated.",
        user
    ))

})




export {
    registerUser,
    loginUser,
    logoutUser,
    refreshTokens,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateCoverImage,
    updateAvatar,
}