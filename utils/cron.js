const cron = require("node-cron");
const mongoose = require("mongoose");
require("../models/post");
const POST = mongoose.model("POST");

const deleteExpiredPosts = () => {
    cron.schedule("0 * * * *", async () => { // Runs every hour
        try {
            const now = new Date();
            const result = await POST.deleteMany({ expiresAt: { $lte: now } });
            console.log(`${result.deletedCount} expired posts deleted.`);
        } catch (err) {
            console.error("Error deleting expired posts:", err);
        }
    });
};

module.exports = deleteExpiredPosts;
