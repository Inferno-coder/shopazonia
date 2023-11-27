const dotenv=require('dotenv')
const productModel=require('../models/productModel')

const data=require('../data/products.json')
const databaseConnection = require('../configure/database')


dotenv.config({path:'backend/configure/config.env'})
databaseConnection()
const seedData=async(req,res,next)=>{
    try {
        await productModel.deleteMany()
        console.log('All prodcuts deleted');
        const allProducts=await productModel.insertMany(data)
        console.log('All products added'); 
    } catch (error) {
        console.log(error.message);
    }
    process.exit()
}

seedData()