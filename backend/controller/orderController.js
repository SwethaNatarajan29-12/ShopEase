import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Place a new order from the user's cart
export const placeOrder = async (req, res) => {
  try {
    const { userId, paymentMethod, address } = req.body;
    if (!userId || !paymentMethod) {
      return res.status(400).json({ message: "Missing userId or payment method" });
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = new Order({
      user: userId,
      items: cart.items.map(i => ({ ...i.toObject() })),
      total,
      paymentMethod,
      address,
      status: "placed",
      identityId: req.user.identityId // Save identityId as identifier
    });
    await order.save();
    await Cart.findOneAndDelete({ user: userId }); // Clear cart after order
    res.status(201).json(order);
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all orders for a user by identityId
export const getOrders = async (req, res) => {
  try {
    const identityId = req.user.identityId;
    const orders = await Order.find({ identityId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
