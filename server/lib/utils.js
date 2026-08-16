import jwt from "jsonwebtoken"; // ✅ ঠিক করা হলো: Jwt থেকে ছোট হাতের jwt করা হলো

export const generateToken = (userId)=>{
    const token = jwt.sign({ userID: userId }, process.env.JWT_SECRET);
    return token;
}