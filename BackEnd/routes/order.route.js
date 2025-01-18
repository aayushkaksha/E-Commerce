import express from 'express'
import {
  createOrder,
  getOrders,
  getSellerOrders,
  updateOrderStatus,
} from '../controller/order.controller.js'
import { protect, authorize } from '../middleware/auth.middleware.js'

const router = express.Router()

// Buyer routes
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getOrders)

// Seller routes
router.get('/seller-orders', protect, authorize('seller'), getSellerOrders)
router.patch(
  '/:orderId/status',
  protect,
  authorize('seller'),
  updateOrderStatus
)

export default router
