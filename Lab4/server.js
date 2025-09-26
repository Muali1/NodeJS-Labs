    const express = require("express");
    const fs = require("fs/promises");
    const path = require("path");
    const authRouter = require("./routes/auth");
    const profileRouter = require("./routes/profile");
    const jwt = require("jsonwebtoken");
    const { verify } = require("crypto");
    const app = express();
    const port = 3000;

    const logger = (req, res, next) => {
    console.log("request started");
    const auth = req.headers['authorization']
    if (auth) {
        const token = auth.split(" ")?.[1];
        jwt.verify(token, 'secretkeygfsgd', (err, data)=>{
            if(err) {
                console.log("Token verification failed:", err.message);
                return res.status(401).json({ error: "invalid token" });
            }
            req.user = data; 
        })
        console.log("🚀 ~ logger ~ token:", token)
    } else {
        return res.status(401).json({ error: "missing token" });
    }
    next();
    };
    app.use(express.json());
    app.get(["/", "/home"], async (req, res) => {
    console.log("🚀 ~ req:", req);
    res.send({ content: "here" });
    return;
    });

    app.use("/auth", authRouter);
    app.use("/profile", logger, profileRouter);

    const errorHandler = (err, req, res, next) => {
    console.log(err);
    if(err === 401){
        res.status(401).send({ error: "unauthorizared" });
        return;
    }
    res.status(400).send({ error: "something went wrong" });
    return;
    };
    app.use(errorHandler);
    app.listen(port, () => {
    console.log(`API app listening on port ${port}`);
    });
