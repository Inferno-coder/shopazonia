const express=require('express')
const { createOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require('../controllers/orderController')
const router=express.Router()
const {isAuthenticatedUser, authorizeRoles}=require('../middlewares/authenticate')
router.route('/order/new').post(isAuthenticatedUser,createOrder)
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route('/myorders').get(isAuthenticatedUser,myOrders)
//admin routes
router.route('/allorders').get(isAuthenticatedUser,authorizeRoles('admin'),getAllOrders)
router.route('/order/:id').put(isAuthenticatedUser,authorizeRoles('admin'),updateOrder)
router.route('/order/:id').delete(isAuthenticatedUser,authorizeRoles('admin'),deleteOrder)
module.exports=router