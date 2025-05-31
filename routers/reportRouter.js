const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const authorization = require("../middleware/verifyToken");
const { body } = require("express-validator");


// ✅ Get all reports
router.get("/getAllReports", authorization, reportController.getAllReports);

// ✅ Get report by ID
router.get("/getReport/:id", authorization, reportController.getReportById);

// ✅ Create new report
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

// ✅ Update report
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

// ✅ Delete report
router.delete("/deleteReport/:id", authorization, reportController.deleteReport);

module.exports = router;
