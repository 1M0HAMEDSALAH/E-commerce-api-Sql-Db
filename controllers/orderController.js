const db = require('../config/Data/AppDbContext');
const { Order } = db;

// إنشاء طلب جديد
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id; // ⬅️ استخدم user من التوكن
        const { total, status } = req.body;

        const newOrder = await Order.create({
            userId,
            total,
            status: status || 'pending',
        });

        res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

// جلب كل الطلبات الخاصة بالمستخدم الحالي فقط
const getAllOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.findAll({
            where: { userId }
        });

        res.json({
            message: 'Orders fetched successfully',
            total: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

// جلب طلب واحد فقط لو يخص المستخدم الحالي
const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const order = await Order.findOne({
            where: { id: req.params.id, userId }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

// تحديث الطلب لو يخص المستخدم
const updateOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status, total } = req.body;

        const order = await Order.findOne({ where: { id, userId } });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        await order.update({ status, total });

        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

// حذف الطلب لو يخص المستخدم
const deleteOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await Order.findOne({ where: { id, userId } });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or access denied' });
        }

        await order.destroy();
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};


module.exports = {
    createOrder,
    updateOrder,
    getAllOrders,
    getOrderById,
    deleteOrder
};
