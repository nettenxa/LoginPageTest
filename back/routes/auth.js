const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// ดึงผู้ใช้ทั้งหมด — จำกัดสิทธิ์ Admin เท่านั้น (เพิ่ม middleware เช็ค admin ถ้ามี)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // ดึงข้อมูลทั้งหมด แต่ไม่ส่งรหัสผ่าน
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// อัปเดตรหัสผ่านผู้ใช้ (admin เท่านั้น)
router.put("/users/:id", async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ msg: "Password is required" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });

    res.json({ msg: "Password updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ลบผู้ใช้ (admin เท่านั้น)
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE ผู้ใช้
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/auth/users/:id
router.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.username === "admin01") {
      return res.status(403).json({ message: "Cannot modify protected admin account." });
    }

    // ดำเนินการ update ตามปกติ
    const updatedData = {};
    if (req.body.password) updatedData.password = req.body.password;
    if (req.body.role) updatedData.role = req.body.role;

    await User.findByIdAndUpdate(req.params.id, updatedData);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/auth/users/:id
router.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.username === "admin01") {
      return res.status(403).json({ message: "Cannot delete protected admin account." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body; // **ไม่รับ role จาก client**

    // ตรวจสอบ user ซ้ำ
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    // เข้ารหัสรหัสผ่าน
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // บังคับ role เป็น 'user' เสมอ
    user = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',  // กำหนด role ที่นี่
    });

    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // หา user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // สร้าง JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role, } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
