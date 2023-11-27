const express=require('express')
const { getProducts, newProduct, getProduct, updateProduct, deleteProduct, createReview, getReviews, deleteReview, getAdminProducts } = require('../controllers/productsController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate')
const router=express.Router()
const multer=require('multer')
const path=require('path')
const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/product' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })


router.route('/products').get(getProducts)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),upload.array('images'),newProduct)
router.route('/admin/products').get(isAuthenticatedUser,authorizeRoles('admin'),getAdminProducts) 
router.route('/products/:id')
.get(getProduct)
.put(updateProduct)
.delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser,createReview)
router.route('/review').delete(isAuthenticatedUser,deleteReview)
router.route('/reviews').get(isAuthenticatedUser,getReviews)


module.exports=router