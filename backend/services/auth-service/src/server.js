const { port: PORT } = require("./config/env");
const app = require("./app");

app.listen(PORT, () =>
  console.log(`Auth service running on ${PORT}`)
);
