import { Router } from "express"
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logoutUser,
    refreshTokens,
    registerUser,
    updateAccountDetails,
    updateAvatar,
    updateCoverImage
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(
    // Middleware to upload through multer 
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),    
    registerUser
)

router.route("/login").post(
    
    // THIS parses form-data (text only)
    upload.none(), 

    loginUser
);

router.route("/logout").post(verifyJWT, logoutUser);


router.route("/refresh").post(refreshTokens);


router.route("/change-password").post(verifyJWT, changeCurrentPassword);


router.route("/currentUser").post(verifyJWT, getCurrentUser);


router.route("/update-account-details").post(verifyJWT, updateAccountDetails);


router.route("/update-avatar").post(upload.single("avatar"), verifyJWT, updateAvatar);


router.route("/update-coverImage").post(upload.single("coverImage"), verifyJWT, updateCoverImage);


export default router