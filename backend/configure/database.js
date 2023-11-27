const mongoose=require('mongoose')
const databaseConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        // useNewUrlParser:true,
        // useUnifiedTopology:true
    }).then((conn)=>{
        console.log(`mongo db is connected to the host ${conn.connection.host}`);
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports=databaseConnection