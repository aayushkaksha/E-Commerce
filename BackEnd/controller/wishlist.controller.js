import Wishlist from "../models/wishlist.model.js";

// Get Wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id }).populate("items.productId");
    if (!wishlist) return res.status(200).json({ success: true, data: [] });
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add to Wishlist
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.user.id, items: [] });
    }

    const exists = wishlist.items.find((item) => item.productId.toString() === productId);
    if (exists) return res.status(400).json({ success: false, message: "Product already in wishlist" });

    wishlist.items.push({ productId });
    await wishlist.save();

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Remove from Wishlist
export const removeFromWishlist = async (req, res) => {
  const { productId } = req.body;
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) return res.status(404).json({ success: false, message: "Wishlist not found" });

    wishlist.items = wishlist.items.filter((item) => item.productId.toString() !== productId);
    await wishlist.save();

    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};