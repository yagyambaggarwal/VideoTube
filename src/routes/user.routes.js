import { Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js"
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

export default router