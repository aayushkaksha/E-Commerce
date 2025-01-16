import Order from '../models/order.model.js'
import Cart from '../models/cart.model.js'
import Product from '../models/product.model.js'

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body

    // Get user's cart
    const cart = await Cart.findOne({ userId: req.user.id }).populate(
      'items.productId'
    )

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      })
    }

    // Calculate total amount and prepare order items
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }))

    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )

    // Create order
    const order = new Order({
      userId: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: 'pending',
    })

    await order.save()

    // Clear cart
    cart.items = []
    await cart.save()

    res.status(201).json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
    })
  }
}

// Get buyer's orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.productId')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      data: orders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
    })
  }
}

// Get seller's orders
export const getSellerOrders = async (req, res) => {
  try {
    // Find all products by this seller
    const sellerProducts = await Product.find({ sellerId: req.user.id })
    const productIds = sellerProducts.map((product) => product._id)

    // Find orders containing these products
    const orders = await Order.find({
      'items.productId': { $in: productIds },
    })
      .populate('userId', 'name email')
      .populate('items.productId')
      .sort('-createdAt')

    res.status(200).json({
      success: true,
      data: orders,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching seller orders',
    })
  }
}

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params
    const { status } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    order.status = status
    await order.save()

    res.status(200).json({
      success: true,
      data: order,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
    })
  }
}
