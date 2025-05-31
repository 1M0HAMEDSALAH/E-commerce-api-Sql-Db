const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *       500:
 *         description: Error creating product
 */
router.post('/', productsController.addProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: تحديث منتج حسب الـ ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: رقم تعريف المنتج
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               stock:
 *                 type: integer
 *               categoryId:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: "منتج محدث"
 *               price: 199.99
 *               description: "تفاصيل محدثة"
 *               stock: 15
 *               categoryId: 2
 *               images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
 *     responses:
 *       200:
 *         description: تم تحديث المنتج بنجاح
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: المنتج غير موجود
 *       500:
 *         description: خطأ في الخادم
 */
router.put('/:id', productsController.updateProduct);



/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (with optional filters)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by product name (partial match)
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by product description (partial match)
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Filter by exact product price
 *     responses:
 *       200:
 *         description: List of all products with images
 *       500:
 *         description: Error fetching products
 */

router.get('/', productsController.getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error fetching product
 */
router.get('/:id', productsController.getProductById);


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete('/:id', productsController.deleteProduct);



module.exports = router;
