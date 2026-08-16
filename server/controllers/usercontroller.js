import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloundinary from "../lib/cloudinary.js";


// Signup a new User

export const signup = async (req, res)=>{
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details" }) 

        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists" }) 

        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio

        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Acount created sucesssfully"})

        

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}

// Controller Login A user

export const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email})

        if (!userData) {
            return res.json({success: false, message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        if (!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials" });

        }
        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login successful"})

    } catch (error){
        console.log(error.message);
        res.json({success: false, message: error.message})

    }
}

// Controller to chek if user is Authenticated

export const checkAuth = (req, res)=>{
    res.json({success: true, user: req.user}); // ✅ ঠিক করা হলো: sucess থেকে success করা হলো

}


// Controller to update user Profile Detail

export const updateProfile = async (req, res)=>{
    try{
        const { profilePic, bio, fullName } = req.body;
        const userID = req.user.id;
        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userID, {bio, fullName}, {new: true});
        } else {
            const upload = await cloundinary.uploader.upload(profilePic);

            updatedUser = await User.findByIdAndUpdate(userID, {profilePic: upload.secure_url, bio, fullName}, {new: true});
        }
        res.json({success: true, user: updatedUser}) // ✅ ঠিক করা হলো: sucess থেকে success করা হলো

    } catch (error){
        console.log("=== updateProfile error ===");
        console.log("message:", error.message);
        console.log("full error:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
        res.json({success: false, message: error.message}) // ✅ ঠিক করা হলো: sucess থেকে success করা হলো

    }
}