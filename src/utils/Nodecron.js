const cron = require("node-cron");
const ConnectionRequest = require("../models/ConnectionRequests");
const sendMail = require("./Mailsender");

// Run at 9:00 AM every day except Sunday
cron.schedule("13 17 * * *", async () => {
  try {
    const users = await ConnectionRequest.find({
      status: "intrested",
    }).populate("toUserId");

    const listOfEmails = [...new Set(users.map((itm) => itm.toUserId.emailId))];

    for (const email of listOfEmails) {
      await sendMail(email);
    }

    // console.log(`Sent ${listOfEmails.length} emails`);
  } catch (err) {
    console.error("Error running cron job:", err);
  }
});
