const app=require('./app')

const path=require('path')
const databaseConnection = require('./configure/database')



databaseConnection()
app.listen(process.env.PORT,()=>{
console.log(`server is listening to ${process.env.PORT} in the environment as ${process.env.NODE_ENV}`);
})