const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: "User not found" });

        const user = results[0];

        // Compare Hashed Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Generate Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            email: user.email
        });
    });
};

exports.registerAdmin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email, and password" });
    }

    try {
        User.findByEmail(email, async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(400).json({ message: "Email already exists" });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newAdmin = {
                email,
                password: hashedPassword,
            };

            User.createUser(newAdmin, (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                res.status(201).json({
                    message: "Admin registered successfully",
                    adminId: result.insertId
                });
            });
        });

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};

exports.getAdminDashboard = async (req, res) => {


    try {
        console.log("admin login");

    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};