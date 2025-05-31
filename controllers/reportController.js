const DbContext = require("../config/Data/AppDbContext");
const Report = DbContext.Report;
const { validationResult } = require("express-validator");

// Get all reports
const getAllReports = async (req, res) => {
    try {
        const reports = await Report.findAll({
            where: {
                userId: req.user.id  // جلب البلاغات الخاصة بالمستخدم فقط
            }
        });

        res.status(200).json({
            status: "success",
            count: reports.length,
            data: reports,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "حدث خطأ أثناء جلب البلاغات",
            error: err.message,
        });
    }
};


// Get report by ID
const getReportById = async (req, res) => {
    try {
        const report = await Report.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (!report) {
            return res.status(404).json({
                status: "error",
                message: "البلاغ غير موجود أو غير مسموح بالوصول إليه",
            });
        }

        res.status(200).json({
            status: "success",
            data: report,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "حدث خطأ أثناء جلب البلاغ",
            error: err.message,
        });
    }
};



// Create a new report
const createReport = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "فشل التحقق من البيانات",
            errors: errors.array(),
        });
    }

    try {
        const newReportData = {
            ...req.body,
            userId: req.user.id,  // أضف معرف المستخدم
        };

        const report = await Report.create(newReportData);

        res.status(200).json({
            status: "success",
            message: "تم إنشاء البلاغ بنجاح",
            data: report,
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "فشل إنشاء البلاغ",
            error: err.errors ? err.errors : err.message,
        });
    }
};




const updateReport = async (req, res) => {
    try {
        const [updated] = await Report.update(req.body, {
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (updated === 0) {
            return res.status(404).json({
                status: "error",
                message: "البلاغ غير موجود أو غير مسموح بتعديله",
            });
        }

        res.status(200).json({
            status: "success",
            message: "تم تعديل البلاغ بنجاح",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "فشل تعديل البلاغ",
            error: err.message,
        });
    }
};

const deleteReport = async (req, res) => {
    try {
        const deleted = await Report.destroy({
            where: {
                id: req.params.id,
                userId: req.user.id,
            },
        });

        if (deleted === 0) {
            return res.status(404).json({
                status: "error",
                message: "البلاغ غير موجود أو غير مسموح بحذفه",
            });
        }

        res.status(200).json({
            status: "success",
            message: "تم حذف البلاغ بنجاح",
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "فشل حذف البلاغ",
            error: err.message,
        });
    }
};



module.exports = {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
};
