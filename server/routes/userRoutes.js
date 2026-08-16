import express from "express";
import { checkAuth, login, signup, updateProfile } from "../controllers/usercontroller.js"; 
// 👆 এখানে নিশ্চিত করুন '../controllers/' অংশটি যেন ছোট হাতের 'c' দিয়ে শুরু হয়।
import { protectRoute } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/update-profile", protectRoute, updateProfile);
userRouter.get("/check", protectRoute, checkAuth);


export default userRouter;
