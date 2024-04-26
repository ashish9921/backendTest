import { ApiError } from "../utils/ApiError.js";
import { asynchandeller } from "../utils/asyncHnadeler.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefereshToken=async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken =user.genAccessToken()
        const refreshToken =user.generateRefreshtoken()
        
        user.refreshToken=refreshToken

        await user.save({validateBeforSave:false})
        return {accessToken,refreshToken}
    }
    catch(error){
        throw new ApiError(500,"somthing went wrong while generating refresh and access token")
    }
}

const registerUser=asynchandeller(async (req,res)=>{
//get user detail from frontend
//validate -not empty
// check if user already exist :username,email
//check for image check for avatar
// did all stpe and exicute functions befor creating entry
//create user object - create entry in db
//*remove password and refresh token from responce 
//check for user creation 
// return responce 

const {username,fullName,email,password}=req.body

if([username,fullName,email,password].some((field)=>field?.trim()==="")){
    throw new ApiError(400,"All fields are required")
}
const existUser=await User.findOne({
    $or:[{username},{email}]
})

if(existUser){
    throw new ApiError(409, "user with email or username already exists") 
}

const createUser =User.create({
    fullName,
    avatar:"lk",
    coverImage:"jhjh",
    email,
    password,
    username:username.toLowerCase()
})

res.status(201).json({success:true,message:"created"})


})

const loginuser=asynchandeller(async(req,res)=>{
    //req body -data
    // username email
    // find user
    // password check
    // access and refresh token
    //send cookies
    
    const {username,password,email}=req.body

    if(!username && !email){
        throw new ApiError(400 ,"user or email is requred")
    }

    const user=await User.findOne({
        $or:[{email},{username}]
    })
    

    if(!user){
        throw new ApiError(400 ,"user not fout")
    }
    const isPasswordValid =await user.isPasswordCorrect(password) 
    if(!isPasswordValid){
        throw new ApiError(401 ,"invalid user credential")
    }
    
    const {accessToken , refreshToken}=await generateAccessAndRefereshToken(user._id)
    
    const loggedInUser =await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:true
    } 
    return res.status(200)
    .cookie("accessToken",accessToken) 
    .cookie("refreshToken",refreshToken)
    .status(200).json({user:loggedInUser,accessToken,refreshToken ,message:"user logged in successfully"}) 
})

const logout=asynchandeller(async(req,res)=>{
   
    await User.findByIdAndUpdate(
        req.user._id,
        
        {
            $unset:{
                refreshToken:1  //remove field from document
            }
        },
        {
            new :true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    } 
    return res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .status(200).json({message:"user logged out successfully"}) 
})

// const getUserChanelProfile=asynchandeller(async(req,res)=>{
//     const {username}=req.params
//     if(!username?.trim()){
//         throw new ApiError(400,"username is missing")
//     }
//     const channel=await User.aggregate([
//         {
//         $match:{
//             username:username?.toLowerCase()
//         },
//         {
//             $lookup:{
//                 from:"sub",
//                 localfield:_id,
//                 foreignField:"channel",
//                 as:"SubScriber"
//             }
//         }

//     }
       
//     ])
// })
export {registerUser,loginuser,logout}