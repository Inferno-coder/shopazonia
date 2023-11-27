const userModel=require('../models/userModel')
const { use } = require('../routes/auth')
const crypto=require('crypto');
const sendEmail = require('../utils/email')
const ErrorHandler=require('../utils/errorHandler')
const sendToken = require('../utils/jwt')
exports.registerUser=async(req,res,next)=>{
  try {
    const {name,email,password}=req.body
    let avatar
    if(req.file){
      avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
    }
    const user=await userModel.create({name,email,password,avatar})
    const token=user.getJwtToken();
    sendToken(user,201,res)
  } catch (error) {
    return  next(new ErrorHandler('Please Enter all the necessary Details',404))
  }
}

exports.loginUser=async(req,res,next)=>{
  const {email,password}=req.body
  if(!email || !password){
   return next(new ErrorHandler('enter the password and email',400))
  }
 
  try {
    const user=await userModel.findOne({email}).select('+password')
    if(!await user.isValid(password)){
        return next(new ErrorHandler('invalid password',400))  
    }  
    sendToken(user,201,res)
  } catch (error) {
   return next(new ErrorHandler('invalid email and password',400))
  }
 
}


exports.logoutUser=(req,res,next)=>{
res.cookie('token',null,{
  expires:new Date(Date.now()),
  httpOnly:true
})
.status(200)
.json({
  success:true,
  message:'logged out'
})
}

exports.forgotpassword=async(req,res,next)=>{
try {
  const user=await userModel.findOne({email:req.body.email})
  const resetToken=user.getResetToken()
  await user.save({validateBeforeSave:false});
  const resetURL=`${process.env.FRONTEND_URL}/password/reset/${resetToken}`
  const msg=`your password reset url is below here
  ${resetURL}\n\n if not you then ignore it`
 
  try {
    sendEmail({
      email:user.email,
      subject:'shopazonia password recovery',
      text:msg 
    })
    res.status(200).json({
      success:true,
      message:'email send '
    })
   
  } catch (error) {
    user.resetPasswordToken=undefined
    user.resetPasswordTokenExpire=undefined
    await user.save({validateBeforeSave:false})
    return next(new ErrorHandler(error.message),500)
  }
} catch (error) {
  return next(new ErrorHandler('data not found',404))
}
}

exports.resetPassword=async(req,res,next)=>{
const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
const  user=await userModel.findOne({
  resetPasswordToken,
  resetPasswordTokenExpire:{
    $gt:Date.now()  
    }
})
if(!user){
  return  next(new ErrorHandler('reset pawword expired'))
}
if(req.body.password!==req.body.confirmPassword){
  return next(new ErrorHandler('wrong password'))
}
user.password=req.body.password
user.resetPasswordToken=undefined
user.resetPasswordTokenExpire=undefined
await user.save({validateBeforeSave:false})
sendToken(user,201,res)
}

exports.getProfile=async(req,res,next)=>{
const user=await userModel.findById(req.user.id)
res.status(200).json({
 success:true,
 user 
})
}

exports.changepassword=async (req,res,next)=>{
const user=await userModel.findById(req.user.id).select('+password')

if(!await user.isValid(req.body.oldPassword)){
 return next(new ErrorHandler('old password is incorrect'),401) 
}

user.password=req.body.password
await user.save()
res.status(200).json({
  success:true, 
  msg:'password changed'
})
}

exports.updateProfile=async(req,res,next)=>{
  let data={
   name:req.body.name,
   email:req.body.email,
   role: req.body.role 
  }

  let avatar;
    if(req.file){
      avatar=`${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
      data={...data,avatar}
    }

  const user=await userModel.findByIdAndUpdate(req.user.id,data,{
    new:true,
    runValidators:true
  })

  res.status(200).json({
   success:true,
   user 
  })
}

exports.getAllUser=async(req,res,next)=>{
const users=await userModel.find()
res.status(200).json({
  success:true,
  users
})
}

exports.getSpecificUser=async(req,res,next)=>{
  const user=await userModel.findById(req.params.id)
  try {
    if(!user){
      return next(new ErrorHandler('user not found'))
    }

  } catch (error) {
    console.log(error);
  }
  res.status(200).json({
    success:true,
    user
  })
  }

  exports.updateUser = async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        user
    })
}
exports.deleteUser = async(req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if(!user) {
      return next(new ErrorHandler(`User not found with this id ${req.params.id}`))
  }
  res.status(200).json({
      success: true,
  })
}