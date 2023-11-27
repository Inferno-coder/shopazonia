module.exports=(err,req,res,next)=>{
err.statusCode=err.statusCode || 500

if(process.env.NODE_ENV=='development'){
res.status(err.statusCode).json({
    success:false,
    message:err.message,
    stack:err.stack,
    error:err
})
}
if(process.env.NODE_ENV=='production'){
    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })
    }

}
