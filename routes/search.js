
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const USER = mongoose.model("USER");
const requireLogin = require("../middlewares/requireLogin");

router.get("/search", requireLogin, (req, res) => {
  const { query } = req.query;

  let filterCriteria = {};

  if (query) {
    filterCriteria.$or = [
      { userName: { $regex: query, $options: "i" } },
      { name: { $regex: query, $options: "i" } },
    ];
  }

  USER.find(filterCriteria)
    .select("_id name userName Photo")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

module.exports = router;

