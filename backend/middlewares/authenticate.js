const ErrorHandler = require("../utils/errorHandler")
const asyncError = require("./asyncError")
const jwt=require('jsonwebtoken')
const userModel=require('../models/userModel')
exports.isAuthenticatedUser=asyncError(async(req,res,next)=>{
const {token}=req.cookies
if(token===undefined){
return  next(new ErrorHandler('to access you need to be first logged in '))
}
const decode=jwt.verify(token,process.env.JWT_SECRET)
req.user=await userModel.findById(decode.id)
next()
})

exports.authorizeRoles=(...roles)=>{
return (req,res,next)=>{
if(!roles.includes(req.user.role)){
return next(new ErrorHandler('you are allowed to access this'),401)
}

 next()
}
}