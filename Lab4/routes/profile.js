    const express = require("express");
    const router = express.Router();
    const { query } = require("../helpers/database");
    const _ = require("loadsh");
    const jwt = require("jsonwebtoken");
    const joi = require('joi');

    router.get("/", async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) return res.status(401).json({ error: "not authorized" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ error: "missing token" });

        let decoded;
        try {
        decoded = jwt.verify(token, "secretkeygfsgd");
        } catch (err) {
        return res.status(401).json({ error: "invalid token" });
        }

        const users = await query("SELECT id, name, email, age, created_at FROM users WHERE id=?", [decoded.id]);
        if (users.length === 0) return res.status(404).json({ error: "user not found" });

        res.json(users[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "server error" });
    }
    });

    module.exports = router;
