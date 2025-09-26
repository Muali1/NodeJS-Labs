    const express = require("express");
    const router = express.Router();
    const { query } = require("../helpers/database");
    const bcrypt = require("bcrypt");
    const _ = require("loadsh");
    const jwt = require("jsonwebtoken");
    const joi = require('joi');



    const registerSchema = joi.object({
        name: joi.string().min(2).max(100).required(),
        email: joi.string().email().required(),
        password: joi.string().min(8).required(),
        age: joi.number().integer().min(13).max(120).required(),
    });
    
    router.post("/register", async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { name, email, password, age } = req.body;

        const existing = await query("SELECT * FROM users WHERE email=?", [email]);
        if (existing && existing.length > 0) {
        return res.status(409).json({ error: "email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
        "INSERT INTO users (name, email, password_hash, age) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, age]
        );

        res.status(201).json({
        id: result.insertId,
        name,
        email,
        age,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
    });

    const loginSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    });
    
    router.post("/login", async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = req.body;
        const users = await query("SELECT * FROM users WHERE email=?", [email]);

        if (users.length === 0) {
        return res.status(401).json({ error: "invalid email or password" });
        }

        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: "invalid email or password" });

        const token = jwt.sign({ id: user.id, email: user.email }, "secretkeygfsgd", { expiresIn: "1h" });

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
    });

    module.exports = router;
