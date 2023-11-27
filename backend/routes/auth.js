const express=require('express')
const multer=require('multer')
const path=require('path')
const upload = multer({storage: multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join( __dirname,'..' , 'uploads/user' ) )
    },
    filename: function(req, file, cb ) {
        cb(null, file.originalname)
    }
}) })

const { registerUser, loginUser, logoutUser, forgotpassword, resetPassword, getProfile, changepassword, updateProfile, getAllUser, getSpecificUser, updateUser, deleteUser } = require('../controllers/authContoller')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate')
const router=express.Router()

router.route('/register').post(upload.single('avatar'),registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotpassword)
router.route('/password/reset/:token').post(resetPassword)
router.route('/myProfile').get(isAuthenticatedUser,getProfile)
router.route('/password/change').put(isAuthenticatedUser,changepassword)
router.route('/update').put(isAuthenticatedUser,upload.single('avatar'),updateProfile )
//admin routes
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),getAllUser)
router.route('/admin/user/:id')
.get(isAuthenticatedUser,authorizeRoles('admin'),getSpecificUser)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deleteUser)
module.exports=router