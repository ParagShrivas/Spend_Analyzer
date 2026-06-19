const app = require("./app");
const startUpcomingNotificationMailJob = require("./jobs/upcomingNotificationMailJob");

const PORT = process.env.PORT || 1500;

app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}`);
     startUpcomingNotificationMailJob();
});