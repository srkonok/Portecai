import express from 'express'
import asyncHandler from 'express-async-handler'
import { getProducts, getProductById, deleteProduct, updateProduct, createProduct, createProductReview,  getTopProducts } from '../controllers/productController.js'
import {protect,admin} from '../middleware/authMiddleware.js'
const router = express.Router()

router.route('/').get(getProducts).post(protect,admin,createProduct)
router.get('/top',getTopProducts)
router.route('/:id/reviews').post(protect,createProductReview)
router.route('/:id').get(getProductById)
.delete(protect,admin,deleteProduct)
.put(protect,admin,updateProduct)


export default router
// router.get('/:id',asyncHandler( async(req,res)=>{
//     if(mongoose.Types.ObjectId.isValid(req.params.id)){
//     const product= await Product.findById(req.params.id)
//     if(product){
//        res.json(product)
//    } else{
//         res.status(404).json({message:'Product not found'})
//    }
// }else{
//     res.status(404).json({message:'Product not found'})
// }
// }))

// router.get('/:id',asyncHandler( async(req,res)=>{
//     const product= await Product.findById(req.params.id)
//     if(product){
//        res.json(product)
//     }else{
//         res.status(404)
//         throw new Error('Product not Found')
//    }
//  }
// ))

