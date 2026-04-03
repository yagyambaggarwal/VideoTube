import { Router } from "express"
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
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


router.route("/change-password").patch(verifyJWT, upload.none(), changeCurrentPassword);


router.route("/current-user").get(verifyJWT, getCurrentUser);


router.route("/update-account-details").patch(verifyJWT, upload.none(), updateAccountDetails);


router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar);


router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateCoverImage);


router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);


router.route("/watch-history").get(verifyJWT, getWatchHistory);


export default router