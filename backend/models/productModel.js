const mongoose=require('mongoose')
const productSch=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'enter the product name'],
        trim:true,
        maxLength:[100,"name should not exceed 100 characters"],
    },
    price:{
        type:Number,
        required:true,
        default:0.0
    },
    description:{
        type:String,
        required:[true,'enter the product desc'],
    },
    ratings:{
        type:String,
        default:0
    },
    images:[{
        image:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true,'enter the category'],
        enum:{
            values:[
                'Electronics',
                'Mobile Phones',
                'Laptops',
                'Headphones',
                'Books',
                'Food',
                'Cloths',
                'Beauty',
                'Sports',
                'Outdoor',
                'Home',
                'Accessories'
            ],
            message:'select  correct Category'
        },
    },
    seller:{
        type:String,
        required:[true,'enter the product seller']
    },
    stock:{
        type:Number,
        required:[true,'enter the stock'],
        maxLength:[20,'stock cannot exeed 20']
    },
    NumOfReviews:{
        type:Number,
        default:0
    },
    reviews:[{
        user:mongoose.Schema.Types.ObjectId,
        rating:{
            type:String,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }],
    user:{
        type:mongoose.Schema.Types.ObjectId
    },  
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const sch= mongoose.model('product',productSch)
module.exports=sch
