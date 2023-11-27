const orderModel = require("../models/orderModel")
const userModel=require('../models/userModel')
const productModel=require('../models/productModel');
const ErrorHandler = require("../utils/errorHandler");
exports.createOrder=async (req,res,next)=>{
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await orderModel.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    })

    res.status(200).json({
        success: true,
        order
    })
}

exports.getSingleOrder = async (req, res, next) => {
    const order = await orderModel.findById(req.params.id).populate('user', 'name email');
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        order
    })
}

exports.myOrders =async (req, res, next) => {
    const orders = await orderModel.find({user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
}

exports.getAllOrders =async (req, res, next) => {
    const orders = await orderModel.find();
    let totAmount=0
    orders.forEach(order=>{
        totAmount+=order.totalPrice
    })
    res.status(200).json({
        success: true,
        totAmount,
        orders
    })
}

exports.updateOrder = async (req, res, next) => {   
    const order = await orderModel.findById(req.params.id);
    
    if(order.orderStatus == 'Delivered') {
        return next(new ErrorHandler('Order has been already delivered!', 400))
    }
    //Updating the product stock of each order item
    order.orderItems.forEach(async orderItem => {
        await updateStock(orderItem.product, orderItem.quantity)
    })
    order.orderStatus = req.body.orderStatus;
    order.deliveredAt = Date.now();
    await order.save()
    res.status(200).json({
        success: true
    })
}

async function updateStock(productId,quantity){
const product=await productModel.findById(productId)
product.stock-=quantity
await product.save({validateBeforeSave:false})
}

exports.deleteOrder = async (req, res, next) => {
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if(!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true
    })
}