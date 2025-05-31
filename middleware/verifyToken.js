const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ status: "error", message: "Authorization token is required" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
        req.user = decoded; // نحفظ البيانات في req.user علشان نستخدمها بعدين
        next();
    } catch (err) {
        return res.status(401).json({ status: "error", message: "Invalid or expired token" });
    }
};

module.exports = verifyToken;
