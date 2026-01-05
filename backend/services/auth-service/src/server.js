const { PORT } = require("../../order-service/src/config/env");
const app = require("./app");

app.listen(PORT, () =>
  console.log(`Auth service running on ${process.env.PORT}`)
);
