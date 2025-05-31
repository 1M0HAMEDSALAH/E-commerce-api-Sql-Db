const { validationResult } = require("express-validator");
const db = require("../config/dbConnection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DbContext = require("../config/Data/AppDbContext");


const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array(),
        });
    }

    const { name, email, password } = req.body;

    try {
        db.query('SELECT * FROM resister WHERE email = ?', [email], async (err, result) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Database error",
                    error: err.message,
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    status: "error",
                    message: "Email already exists",
                });
            }

            // تشفير الباسورد
            const hashedPassword = await bcrypt.hash(password, 10);

            // إدخال المستخدم
            db.query(
                'INSERT INTO resister (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            status: "error",
                            message: "Database error",
                            error: err.message,
                        });
                    }

                    res.status(201).json({
                        status: "success",
                        message: "User registered successfully",
                        data: {
                            name,
                            email,
                        },
                    });
                }
            );
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Unexpected error",
            error: err.message,
        });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: "error",
            message: "البريد الإلكتروني وكلمة المرور مطلوبة",
        });
    }

    db.query('SELECT * FROM resister WHERE email = ?', [email], async (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Database error",
                error: err.message,
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                status: "error",
                message: "البريد الإلكتروني غير مسجل",
            });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: "error",
                message: "كلمة المرور غير صحيحة",
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "45d" }
        );

        res.status(200).json({
            status: "success",
            message: "تم تسجيل الدخول بنجاح",
            token, // التوكن
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    });
};

const verifyEmail = (req, res) => {
    const userId = req.user.id;

    db.query('UPDATE resister SET is_verified = 1 WHERE id = ?', [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ status: "error", message: "Database error", error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.status(200).json({ status: "success", message: "Email verified successfully" });
    });
};

const sendResetCode = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: "error",
            message: "الرجاء إدخال البريد الإلكتروني."
        });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // كود من 6 أرقام

    db.query('UPDATE resister SET reset_code = ? WHERE email = ?', [code, email], (err, result) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "حدث خطأ في قاعدة البيانات.",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "هذا البريد غير مسجل."
            });
        }

        return res.status(200).json({
            status: "Success",
            message: "تم إرسال الكود، الرجاء إدخاله في الخطوة التالية.",
            next: "reset-password",
            code // فقط للتجربة، لا تستخدم الكود في production
        });
    });
};

const resetPassword = async (req, res) => {
    const { email, reset_code, newPassword } = req.body;

    if (!email || !reset_code || !newPassword) {
        return res.status(400).json({
            status: "error",
            message: "يرجى ملء جميع الحقول: البريد الإلكتروني، الكود، وكلمة المرور الجديدة."
        });
    }

    db.query('SELECT * FROM resister WHERE email = ? AND reset_code = ?', [email, reset_code], async (err, results) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Database error",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "الكود غير صحيح أو منتهي."
            });
        }

        const user = results[0];
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.query('UPDATE resister SET password = ?, reset_code = NULL WHERE email = ?', [hashedPassword, email], (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "خطأ أثناء تحديث كلمة المرور",
                    error: err.message
                });
            }

            // توليد JWT بعد النجاح
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET || "secret_key",
                { expiresIn: "1d" }
            );

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
        });
    });
};

const NewRegister = async (req, res) => {
    try {
        const { name, email, password, image } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

        // Create new user with hashed password
        const newUser = await DbContext.Resister.create({
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

        res.status(201).json({ message: 'User registered successfully.', user: newUser });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Something went wrong while registering the user.' });
    }
  };


module.exports = {
    register,
    login,
    verifyEmail,
    sendResetCode,
    resetPassword, NewRegister
};
