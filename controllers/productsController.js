const db = require('../config/Data/AppDbContext');
const { Product, ProductImage } = db;
const { Op } = require('sequelize');


// إضافة منتج جديد مع صور
const addProduct = async (req, res) => {
    try {
        const { name, price, description, stock, categoryId, images } = req.body;

        const newProduct = await Product.create({ name, price, description, stock, categoryId });

        if (images && Array.isArray(images)) {
            // هنا تأكد إنك تستخدم imageUrl مش url
            const imagesToCreate = images.map(imageUrl => ({ imageUrl, productId: newProduct.id }));
            await ProductImage.bulkCreate(imagesToCreate);
        }

        const productWithImages = await Product.findByPk(newProduct.id, {
            include: [{ model: ProductImage, as: 'images' }],
        });

        res.status(200).json({ message: 'Product created successfully', product: productWithImages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
};

// تحديث منتج حسب ID
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock, categoryId, images } = req.body;

        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // تحديث بيانات المنتج الأساسية
        await product.update({ name, price, description, stock, categoryId });

        // لو فيه صور جديدة مرفقة
        if (images && Array.isArray(images)) {
            // حذف الصور القديمة
            await ProductImage.destroy({ where: { productId: id } });

            // إضافة الصور الجديدة
            const imagesToCreate = images.map(imageUrl => ({ imageUrl, productId: id }));
            await ProductImage.bulkCreate(imagesToCreate);
        }

        // إرجاع المنتج بعد التحديث
        const updatedProduct = await Product.findByPk(id, {
            include: [{ model: ProductImage, as: 'images' }],
        });

        res.json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { name, description, price } = req.query;

        const where = {};

        if (name) {
            where.name = { [Op.like]: `%${name}%` };
        }

        if (description) {
            where.description = { [Op.like]: `%${description}%` };
        }

        if (price) {
            const parsedPrice = parseFloat(price);
            if (!isNaN(parsedPrice)) {
                // سعر أقل من أو يساوي القيمة المرسلة
                where.price = {
                    [Op.lte]: parsedPrice
                };
            }
        }

        const products = await Product.findAll({
            where,
            include: [{ model: ProductImage, as: 'images' }],
        });

        res.json({
            message: 'Products fetched successfully',
            total: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};


// جلب منتج واحد مع الصور حسب الـ id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{ model: ProductImage, as: 'images' }],
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(400).json({ message: 'Product not found' });
        }

        await ProductImage.destroy({ where: { productId: id } });
        await Product.destroy({ where: { id } });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
};


module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
