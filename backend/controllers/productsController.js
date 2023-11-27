const ErrorHandler=require('../utils/errorHandler')
const productModel=require('../models/productModel')
const asyncError=require('../middlewares/asyncError')
const APIFeatures = require('../utils/apiFeatures')

exports.getProducts=async(req,res,next)=>{
    const resPerPage=3
    let buildQuery=()=>{
        return new APIFeatures(productModel.find(),req.query).search().filter()
    }
    const filteredProductsCount=await buildQuery().query.countDocuments({})
    const totDoc=await productModel.countDocuments({})
    const products=await buildQuery().paginate(resPerPage).query
    let productCount=totDoc
    if(filteredProductsCount!==totDoc){
        productCount=filteredProductsCount
    }
    res.status(200).json({
        success:true,
        productCount,
        count:products.length,
        products
    })
}

exports.newProduct=asyncError(async(req,res,next)=>{
 
    let images = []
    
    if(req.files.length > 0) {
        req.files.forEach( file => {
            let url = `${process.env.BACKEND_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })
    }

    req.body.images = images;

    req.body.user=req.user.id
const product=await productModel.create(req.body)
res.status(201).json({
    success:true,
    product
})
})



exports.getProduct=async (req,res,next)=>{
    
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return next(new ErrorHandler('product not found in the database',400))
    }
}

exports.updateProduct=async (req,res,next)=>{
    try {
        const product = await productModel.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


exports.deleteProduct=async (req,res,next)=>{
    try {
    await productModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message:'product Deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

exports.createReview=async(req,res,next)=>{
const{productId,rating,comment}=req.body
const review={
    user:req.user.id,
    rating,
    comment
}
const product=await productModel.findById(productId)
const isReviewed=product.reviews.find(review=>{
    return review.user.toString()==req.user.id.toString()
})
if(isReviewed){
 product.reviews.forEach(review=>{
   
  if(review.user.toString()==req.user.id.toString()){
    review.comment=comment
    review.rating=rating
  }
 })
}else{

    product.reviews.push(review)
    product.NumOfReviews=product.reviews.length
}
product.ratings=product.reviews.reduce((acc,review)=>{
return review.rating+acc
},0)/product.reviews.length

product.ratings=isNaN(product.ratings)?0:product.ratings
await product.save({validateBeforeSave:false})
res.status(200).json({
    success:true
})
}

exports.getReviews = async (req, res, next) =>{
    const product = await productModel.findById(req.query.id)

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
}

exports.deleteReview = async (req, res, next) =>{
    const product = await productModel.findById(req.query.productId);
   // console.log(product);
    const reviews = product.reviews.filter(review => {
       return review._id.toString() !== req.query.id.toString()
    });
   // console.log(product.numOfReviews,'---');
    const NumOfReviews = reviews.length;
    let ratings = reviews.reduce((acc, review) => {
        return review.rating + acc;
    }, 0) / reviews.length;
    ratings = isNaN(ratings)?0:ratings;
    await productModel.findByIdAndUpdate(req.query.productId, {
        reviews,
        NumOfReviews,
        ratings
    })
    res.status(200).json({
        success: true
    })
}

exports.getAdminProducts=async(req,res,next)=>{
const products=await productModel.find()
res.status(200).json({
    success:true,
    len:products.length,
    products
})
}