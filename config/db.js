const mongoose = require("mongoose");

function connection() {
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: "eshop",
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Database connected....");
    })
    .catch((err) => {
      console.log("Error connecting database...", err);
    });
}

module.exports = connection;
