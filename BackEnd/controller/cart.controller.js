import Cart from '../models/cart.model.js'

// Get Cart
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate(
      'items.productId'
    )

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] })
      await cart.save()
    }

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    })
  }
}

// Add to Cart
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body
  try {
    let cart = await Cart.findOne({ userId: req.user.id })

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] })
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    )

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity
    } else {
      cart.items.push({ productId, quantity })
    }

    await cart.save()

    // Populate the items before sending response
    await cart.populate('items.productId')

    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    })
  }
}

// Remove from Cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body
  try {
    const cart = await Cart.findOne({ userId: req.user.id })

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: cart ? 'No items to remove' : 'Cart not found',
      })
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    )
    await cart.save()

    res.status(200).json({
      success: true,
      cartItems: cart,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' })
  }
}

// Add clear cart endpoint
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id })

    if (cart) {
      cart.items = []
      await cart.save()
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
    })
  }
}
