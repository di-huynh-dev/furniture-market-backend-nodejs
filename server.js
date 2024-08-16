const app = require("./src/app");
const {
  app: { port },
} = require("./src/config/environment");

const server = app.listen(port, () => {
  console.log(`Server is running at PORT ${port}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
