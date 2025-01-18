
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const POST = mongoose.model("POST");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");


// to update user profile
router.put("/user/:id", requireLogin, async (req, res) => {
    try {
        const updatedUser = await USER.findByIdAndUpdate(
            req.params.id,
            {
                bio: req.body.bio
            },
            { new: true }
        ).select("-password");
        
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ user: updatedUser });
    } catch (err) {
        res.status(422).json({ error: err.message });
    }
});



// to get user profile
router.get("/user/:id", (req, res) => {
    USER.findOne({ _id: req.params.id })
        .select("-password")
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            POST.find({ postedBy: req.params.id })
                .populate("postedBy", "_id name bio")
                .then(posts => {
                    res.status(200).json({ user, posts });
                })
                .catch(err => {
                    res.status(422).json({ error: err });
                });
        })
        .catch(err => {
            res.status(404).json({ error: "User not found" });
        });
});

// to follow user
router.put("/follow", requireLogin, async (req, res) => {
    try {
        // Update the followers array of the user to be followed
        const updatedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $push: { followers: req.user._id } },
            { new: true }
        );

        // If the update fails, throw an error
        if (!updatedUser) {
            return res.status(422).json({ error: "User not found" });
        }

        // Update the following array of the current user
        const currentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $push: { following: req.body.followId } },
            { new: true }
        );

        // Return the updated current user
        res.json(currentUser);
    } catch (err) {
        // Handle any errors
        res.status(422).json({ error: err.message });
    }
});

// to unfollow user
router.put("/unfollow", requireLogin, async (req, res) => {
    try {
        // Update the followers array of the user to be unfollowed
        const updatedUser = await USER.findByIdAndUpdate(
            req.body.followId,
            { $pull: { followers: req.user._id } },
            { new: true }
        );

        // If the update fails, throw an error
        if (!updatedUser) {
            return res.status(422).json({ error: "User not found" });
        }

        // Update the following array of the current user
        const currentUser = await USER.findByIdAndUpdate(
            req.user._id,
            { $pull: { following: req.body.followId } },
            { new: true }
        );

        // Return the updated current user
        res.json(currentUser);
    } catch (err) {
        // Handle any errors
        res.status(422).json({ error: err.message });
    }
});

// to upload profile pic
router.put("/uploadProfilePic", requireLogin, (req, res) => {
    USER.findByIdAndUpdate(req.user._id, {
        $set: { Photo: req.body.pic }
    }, {
        new: true
    }).then(result => {
        res.json(result);
    }).catch(err => {
        res.status(422).json({ error: err });
    });
});

module.exports = router;
