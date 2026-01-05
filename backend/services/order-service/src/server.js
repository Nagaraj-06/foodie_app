const app = require("./app");
const { PORT } = require("./config/env");

app.listen(PORT, () =>
  console.log(`Auth service running on ${process.env.PORT}`)
);
