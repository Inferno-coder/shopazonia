class ErrorHandler extends Error{
constructor(message,sc){
super(message)
this.statusCode=sc
Error.captureStackTrace(this,this.constructor)
}
}
module.exports=ErrorHandler 