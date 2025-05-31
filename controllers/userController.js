const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DbContext = require("../config/Data/AppDbContext");
const Resister = DbContext.Resister;


const Register = async (req, res) => {
    try {
        const { name, email, password, image } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new user with hashed password
        const newUser = await Resister.create({
            name,
            email,
            password: hashedPassword,
            image: image || '',
            is_admin: false,
            is_verified: false,
            last_login: new Date(),
            created_at: new Date(),
            updated_at: new Date(),
        });

        res.status(200).json({ message: 'User registered successfully.', user: newUser });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Something went wrong while registering the user.' });
    }
};

// تسجيل الدخول
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: "error", message: "البريد الإلكتروني وكلمة المرور مطلوبة" });
    }

    try {
        const user = await Resister.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ status: "error", message: "البريد الإلكتروني غير مسجل" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "كلمة المرور غير صحيحة" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret_key", { expiresIn: "45d" });

        res.status(200).json({
            status: "success",
            message: "تم تسجيل الدخول بنجاح",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "حدث خطأ أثناء تسجيل الدخول", error: error.message });
    }
};

// تأكيد البريد الإلكتروني
const verifyEmail = async (req, res) => {
    const userId = req.user.id;

    try {
        const updated = await Resister.update({ is_verified: true }, { where: { id: userId } });

        if (updated[0] === 0) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        res.status(200).json({ status: "success", message: "Email verified successfully" });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Database error", error: error.message });
    }
};

// إرسال كود إعادة التعيين
const sendResetCode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ status: "error", message: "الرجاء إدخال البريد الإلكتروني." });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const [updated] = await Resister.update({ reset_code: code }, { where: { email } });

        if (updated === 0) {
            return res.status(400).json({ status: "error", message: "هذا البريد غير مسجل." });
        }

        return res.status(200).json({
            status: "Success",
            message: "تم إرسال الكود، الرجاء إدخاله في الخطوة التالية.",
            next: "reset-password",
            code // في الإنتاج لا تعرض هذا
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Database error", error: error.message });
    }
};

// إعادة تعيين كلمة المرور
const resetPassword = async (req, res) => {
    const { email, reset_code, newPassword } = req.body;

    if (!email || !reset_code || !newPassword) {
        return res.status(400).json({ status: "error", message: "يرجى ملء جميع الحقول" });
    }

    try {
        const user = await Resister.findOne({ where: { email, reset_code } });

        if (!user) {
            return res.status(400).json({ status: "error", message: "الكود غير صحيح أو منتهي." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await Resister.update(
            { password: hashedPassword, reset_code: null },
            { where: { email } }
        );

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "secret_key", { expiresIn: "1d" });

        return res.status(200).json({
            status: "done",
            message: "تم إعادة تعيين كلمة المرور بنجاح.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "خطأ أثناء تحديث كلمة المرور", error: error.message });
    }
};


module.exports = {
    Register,
    login,
    verifyEmail,
    sendResetCode,
    resetPassword
};

