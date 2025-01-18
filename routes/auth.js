
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Jwt_secret } = require("../keys");
const requireLogin = require("../middlewares/requireLogin");

router.post("/signup", (req, res) => {
    const { name, userName, email, password, bio } = req.body;

    if (!name || !email || !userName || !password || !bio) {
        return res.status(422).json({ error: "Please add all the fields" });
    }

    USER.findOne({ $or: [{ email: email }, { userName: userName }] }).then((savedUser) => {
        if (savedUser) {
            return res.status(422).json({ error: "User already exists with that email or userName" });
        }

        bcrypt.hash(password, 12).then((hashedPassword) => {
            const user = new USER({
                name,
                email,
                userName,
                password: hashedPassword,
                bio  
            });

            user.save()
                .then((user) => {
                    res.json({ message: "Registered successfully" });
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please add email or password" });
    }

    USER.findOne({ email: email }).then((savedUser) => {
        if (!savedUser) {
            return res.status(422).json({ error: "Invalid Email or Password" });
        }

        bcrypt.compare(password, savedUser.password).then((doMatch) => {
            if (doMatch) {
                const token = jwt.sign({ _id: savedUser._id }, Jwt_secret);
                const { _id, name, email, userName, bio } = savedUser;  
                res.json({ token, user: { _id, name, email, userName, bio } });
            } else {
                return res.status(422).json({ error: "Invalid Email or Password" });
            }
        });
    });
});

router.post("/googleLogin", (req, res) => {
    const { email_verified, email, name, clientId, userName, Photo } = req.body;

    if (email_verified) {
        USER.findOne({ email: email }).then((savedUser) => {
            if (savedUser) {
                const token = jwt.sign({ _id: savedUser._id }, Jwt_secret);
                const { _id, name, email, userName } = savedUser;

                res.json({ token, user: { _id, name, email, userName } });
            } else {
                const password = email + clientId;
                const user = new USER({
                    name,
                    email,
                    userName,
                    password: password,
                    Photo,
                });

                user.save()
                    .then((user) => {
                        const token = jwt.sign({ _id: user._id }, Jwt_secret);
                        const { _id, name, email, userName } = user;

                        res.json({ token, user: { _id, name, email, userName } });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        });
    } else {
        res.status(400).json({ error: "Email not verified" });
    }
});

module.exports = router;
