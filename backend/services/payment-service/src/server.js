const app = require("./app");
const { PORT } = require("./config/env");
const { connectKafka } = require("./config/kafka");

connectKafka();

app.listen(PORT, () => {
    console.log(`Payment Service listening on port ${PORT}`);
});
