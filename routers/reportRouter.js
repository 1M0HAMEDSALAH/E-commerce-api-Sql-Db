const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authorization = require("../middleware/verifyToken");
const { body } = require("express-validator");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Reports management
 */

/**
 * @swagger
 * /api/reports/getAllReports:
 *   get:
 *     summary: Get all reports
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all reports
 *       500:
 *         description: Error retrieving reports
 */
router.get("/getAllReports", authorization, reportController.getAllReports);

/**
 * @swagger
 * /api/reports/getReport/{id}:
 *   get:
 *     summary: Get a report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report data
 *       404:
 *         description: Report not found
 *       500:
 *         description: Error retrieving report
 */
router.get("/getReport/:id", authorization, reportController.getReportById);

/**
 * @swagger
 * /api/reports/createReport:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - latitude
 *               - longitude
 *             properties:
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               description:
 *                 type: string
 *               reporterName:
 *                 type: string
 *               reporterPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report created
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating report
 */
router.post(
    "/createReport",
    authorization,
    [
        body("latitude").notEmpty().withMessage("خط العرض مطلوب"),
        body("longitude").notEmpty().withMessage("خط الطول مطلوب"),
        body("description").optional(),
        body("reporterName").optional(),
        body("reporterPhone").optional(),
    ],
    reportController.createReport
);

/**
 * @swagger
 * /api/reports/updateReport/{id}:
 *   put:
 *     summary: Update a report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               latitude:
 *                 type: string
 *               longitude:
 *                 type: string
 *               description:
 *                 type: string
 *               reporterName:
 *                 type: string
 *               reporterPhone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated
 *       404:
 *         description: Report not found
 *       500:
 *         description: Error updating report
 */
router.put(
    "/updateReport/:id",
    authorization,
    [
        body("latitude").optional(),
        body("longitude").optional(),
        body("description").optional(),
        body("reporterName").optional(),
        body("reporterPhone").optional(),
    ],
    reportController.updateReport
);

/**
 * @swagger
 * /api/reports/deleteReport/{id}:
 *   delete:
 *     summary: Delete a report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report deleted
 *       404:
 *         description: Report not found
 *       500:
 *         description: Error deleting report
 */
router.delete("/deleteReport/:id", authorization, reportController.deleteReport);

module.exports = router;
